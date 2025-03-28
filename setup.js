import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const extensionDir = join(__dirname, "extension_aidd");

const generatedPackage = join(extensionDir, "package.json");
const workspacePackageBase = join(extensionDir, "config", "base-package.json");

const settingsPath = join(__dirname, ".vscode", "settings.json");
const keybindingsPath = join(__dirname, ".vscode", "keybindings.json");
const extensionsPath = join(__dirname, ".vscode", "extensions.json");

export function stripJSONComments(jsonString) {
  return jsonString.replace(
    /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
    (m, g) => (g ? "" : m),
  );
}

export async function readJsonFile(filePath) {
  try {
    const data = await readFile(filePath, "utf8");
    const cleanContent = stripJSONComments(data);
    return JSON.parse(cleanContent);
  } catch (error) {
    throw new Error(`Failed to read or parse ${filePath}: ${error.message}`);
  }
}

export async function writeJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

async function updatePackageJson() {
  const packageJson = await readJsonFile(workspacePackageBase);

  if (!workspacePackageBase) {
    throw new Error("Failed to read package.json");
  }

  // paste readme in extension
  const readmePath = join(__dirname, "README.md");
  const readmeContent = await readFile(readmePath, "utf8");

  await writeFile(join(extensionDir, "README.md"), readmeContent);

  // get config files
  const configurationDefaults = await readJsonFile(settingsPath);
  const keybindings = await readJsonFile(keybindingsPath);
  const extensions = await readJsonFile(extensionsPath);

  if (configurationDefaults) {
    packageJson.contributes.configurationDefaults = configurationDefaults;
  }
  if (keybindings) {
    packageJson.contributes.keybindings = keybindings;
  }
  if (extensions) {
    // Add extensions to extensionPack for installation with the extension
    packageJson.extensionPack = extensions.recommendations;
  }

  await writeJsonFile(generatedPackage, packageJson);
}

updatePackageJson().catch((error) => {
  console.error("Error during setup:", error);
  process.exit(1);
});
