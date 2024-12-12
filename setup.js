// setup.js
const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const settingsPath = path.join(__dirname, 'settings.json');
const packagePath = path.join(__dirname, 'package.json');
const keybindingsPath = path.join(__dirname, 'keybindings.json');

// Fonction pour lire le fichier JSON
function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Fonction pour écrire dans le fichier JSON
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Fonction principale
function updatePackageJson() {
    const settings = readJsonFile(settingsPath);
    const packageJson = readJsonFile(packagePath);
    const keybindings = readJsonFile(keybindingsPath);
    const configDescriptions = {
        "workbench.editor.wrapTabs": "Wrap tabs for better visibility",
        "workbench.editor.enablePreview": "Disable preview mode for tabs",
        "explorer.compactFolders": "Disable compact folder display",
        "css.hover.documentation": "Disable CSS hover documentation",
        "editor.pasteAs.preferences": "Update imports on paste"
    };

    packageJson.contributes.configuration.properties = {
        ...packageJson.contributes.configuration.properties,
        ...Object.keys(settings).reduce((acc, key) => {
            acc[key] = {
                type: Array.isArray(settings[key]) ? 'array' : 'boolean',
                default: settings[key],
                description: configDescriptions[key] || ``
            };
            return acc;
        }, {})
    };

    packageJson.contributes.keybindings = [
        ...packageJson.contributes.keybindings || [],
        keybindings
    ];

    writeJsonFile(packagePath, packageJson);
}

// Exécuter la fonction
updatePackageJson();