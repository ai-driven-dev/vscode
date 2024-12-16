// setup.js
const { readFile, writeFile } = require('fs/promises');
const { join } = require('path');

// Chemins des fichiers
const settingsPath = join(__dirname, 'config', 'settings.json');
const packagePath = join(__dirname, 'package.json');
const keybindingsPath = join(__dirname, 'config', 'keybindings.json');
const extensionsPath = join(__dirname, 'config', 'extensions.json');

// Fonction pour nettoyer les commentaires JSON
function stripJSONComments(jsonString) {
    return jsonString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m);
}

// Fonction pour lire le fichier JSON
async function readJsonFile(filePath) {
    try {
        const data = await readFile(filePath, 'utf8');
        const cleanContent = stripJSONComments(data);
        return JSON.parse(cleanContent);
    } catch (error) {
        throw new Error(`Failed to read or parse ${filePath}: ${error.message}`);
    }
}

// Fonction pour écrire dans le fichier JSON
async function writeJsonFile(filePath, data) {
    await writeFile(filePath, JSON.stringify(data, null, 2));
}

// Fonction principale
async function updatePackageJson() {
    const configurationDefaults = await readJsonFile(settingsPath);
    const packageJson = await readJsonFile(packagePath);
    const keybindings = await readJsonFile(keybindingsPath);
    const extensions = await readJsonFile(extensionsPath);

    packageJson.contributes.configurationDefaults = configurationDefaults;
    packageJson.contributes.keybindings = keybindings;
    packageJson.contributes.recommendations = extensions.recommendations;
    packageJson.contributes.unwantedRecommendations = extensions.unwantedRecommendations;

    await writeJsonFile(packagePath, packageJson);
    console.log('Package.json updated successfully');
}

// Exporter les fonctions pour les tests
module.exports = {
    stripJSONComments,
    readJsonFile,
    writeJsonFile,
    updatePackageJson
};

// Exécuter la fonction seulement si le fichier est exécuté directement
if (require.main === module) {
    updatePackageJson().catch(error => {
        console.error('Error during setup:', error);
        process.exit(1);
    });
}