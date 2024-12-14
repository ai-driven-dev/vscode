// setup.js
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemins des fichiers
const settingsPath = join(__dirname, 'config', 'settings.json');
const packagePath = join(__dirname, 'package.json');
const keybindingsPath = join(__dirname, 'config', 'keybindings.json');

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
export async function readJsonFile(filePath) {
    try {
        const data = await readFile(filePath, 'utf8');
        const cleanContent = stripJSONComments(data);
        const jsonData = JSON.parse(cleanContent);

        // Si c'est le fichier settings.json, on récupère les descriptions depuis les commentaires
        if (filePath === settingsPath) {
            const rawContent = await readFile(filePath, 'utf8');
            const descriptions = {};
            Object.keys(jsonData).forEach(key => {
                const description = getDescriptionFromComments(rawContent, key);
                if (description) {
                    descriptions[key] = description;
                }
            });
            return { data: jsonData, descriptions };
        }

        return jsonData;
    } catch (error) {
        throw new Error(`Failed to read or parse ${filePath}: ${error.message}`);
    }
}

// Fonction pour écrire dans le fichier JSON
export async function writeJsonFile(filePath, data) {
    await writeFile(filePath, JSON.stringify(data, null, 2));
}

// Fonction principale
async function updatePackageJson() {
    try {
        const { data: settings, descriptions } = await readJsonFile(settingsPath);
        const packageJson = await readJsonFile(packagePath);
        const keybindings = await readJsonFile(keybindingsPath);

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

        await writeJsonFile(packagePath, packageJson);
        console.log('Package.json updated successfully');
    } catch (error) {
        console.error('Error updating package.json:', error);
    }
}

// Exécuter la fonction
updatePackageJson().catch(error => {
    console.error('Error during setup:', error);
    process.exit(1);
});