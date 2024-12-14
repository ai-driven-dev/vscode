// setup.js
import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemins des fichiers
const settingsPath = join(__dirname, 'config', 'settings.json');
const packagePath = join(__dirname, 'package.json');
const keybindingsPath = join(__dirname, 'config', 'keybindings.json');
const extensionsPath = join(__dirname, 'config', 'extensions.json');

// Fonction pour nettoyer les commentaires JSON
export function stripJSONComments(jsonString) {
    return jsonString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m);
}

// Fonction pour lire le fichier JSON
export async function readJsonFile(filePath) {
    try {
        const data = await readFile(filePath, 'utf8');
        const cleanContent = stripJSONComments(data);
        return JSON.parse(cleanContent);
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

// Exécuter la fonction
updatePackageJson().catch(error => {
    console.error('Error during setup:', error);
    process.exit(1);
});