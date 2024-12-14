// setup.js
const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const settingsPath = path.join(__dirname, 'settings.json');
const packagePath = path.join(__dirname, 'package.json');
const keybindingsPath = path.join(__dirname, 'keybindings.json');

// Fonction pour nettoyer les commentaires JSON
export function stripJSONComments(jsonString) {
    return jsonString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m);
}

// Fonction pour récupérer la description depuis les commentaires
export function getDescriptionFromComments(fileContent, key) {
    const lines = fileContent.split('\n');
    const keyIndex = lines.findIndex(line => line.includes(`"${key}"`));
    
    if (keyIndex === -1) return '';
    
    // Remonter jusqu'au premier commentaire de type //
    let lastComment = '';
    for (let i = keyIndex - 1; i >= 0; i--) {
        const line = lines[i].trim();
        // Sauvegarder le dernier commentaire trouvé
        if (line.startsWith('//')) {
            lastComment = line.substring(2).trim();
        }
        // Si on trouve une ligne non vide qui n'est pas un commentaire, et qu'on a déjà un commentaire
        if (line !== '' && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*') && lastComment) {
            break;
        }
    }
    return lastComment;
}

// Fonction pour lire le fichier JSON
function readJsonFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanContent = stripJSONComments(content);
    const data = JSON.parse(cleanContent);

    // Si c'est le fichier settings.json, on récupère les descriptions depuis les commentaires
    if (filePath === settingsPath) {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const descriptions = {};
        Object.keys(data).forEach(key => {
            const description = getDescriptionFromComments(rawContent, key);
            if (description) {
                descriptions[key] = description;
            }
        });
        return { data, descriptions };
    }

    return data;
}

// Fonction pour écrire dans le fichier JSON
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Fonction principale
function updatePackageJson() {
    const { data: settings, descriptions } = readJsonFile(settingsPath);
    const packageJson = readJsonFile(packagePath);
    const keybindings = readJsonFile(keybindingsPath);

    packageJson.contributes.configuration.properties = {
        ...packageJson.contributes.configuration.properties,
        ...Object.keys(settings).reduce((acc, key) => {
            acc[key] = {
                type: Array.isArray(settings[key]) ? 'array' : typeof settings[key],
                default: settings[key],
                description: descriptions[key] || ''
            };
            return acc;
        }, {})
    };

    packageJson.contributes.keybindings = keybindings;

    writeJsonFile(packagePath, packageJson);
}

// Exécuter la fonction
updatePackageJson();