import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const extensionDir = join(__dirname, "extension_aidd");

const settingsPath = join(extensionDir, "config", "settings.json");
const packagePath = join(extensionDir, "package.json");
const keybindingsPath = join(extensionDir, "config", "keybindings.json");
const extensionsPath = join(extensionDir, "config", "extensions.json");

export function stripJSONComments(jsonString) {
  return jsonString.replace(
    /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
    (m, g) => (g ? "" : m)
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
  const packageJson = await readJsonFile(packagePath);
  if (!packageJson) {
    throw new Error("Failed to read package.json");
  }

  const configurationDefaults = await readJsonFile(settingsPath);
  const keybindings = await readJsonFile(keybindingsPath);
  const extensions = await readJsonFile(extensionsPath);

  if (!packageJson.contributes) {
    packageJson.contributes = {};
  }

  if (configurationDefaults) {
    packageJson.contributes.configurationDefaults = configurationDefaults;
  }
  if (keybindings) {
    packageJson.contributes.keybindings = keybindings;
  }
  if (extensions) {
    packageJson.contributes.recommendations = extensions.recommendations;
    packageJson.contributes.unwantedRecommendations =
      extensions.unwantedRecommendations;
  }

  packageJson.built = new Date().toISOString();

  await writeJsonFile(packagePath, packageJson);
}

updatePackageJson().catch((error) => {
  console.error("Error during setup:", error);
  process.exit(1);
});
