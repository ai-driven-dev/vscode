import * as path from "path";
import * as vscode from "vscode";

// Contenu prédéfini du fichier .prettierrc
const PRETTIER_CONFIG = {
  plugins: ["@prettier/plugin-php"],
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  printWidth: 100,
  overrides: [
    {
      files: "*.jsonc",
      options: {
        parser: "json",
      },
    },
  ],
};

export async function createPrettierConfigFromTemplate() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder open");
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const fileName = ".prettierrc";
  const fileUri = vscode.Uri.file(path.join(rootPath, fileName));

  try {
    // Vérifier si le fichier existe déjà
    try {
      await vscode.workspace.fs.stat(fileUri);
      const confirmation = await vscode.window.showWarningMessage(
        `${fileName} already exists. Do you want to replace it?`,
        "Yes",
        "No",
      );

      if (confirmation !== "Yes") {
        return;
      }
    } catch (err) {
      // Le fichier n'existe pas, on continue
    }

    // Écrire le contenu prédéfini dans le fichier
    const content = JSON.stringify(PRETTIER_CONFIG, null, 2);
    const encoder = new TextEncoder();
    await vscode.workspace.fs.writeFile(fileUri, encoder.encode(content));

    // Ouvrir le fichier créé
    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);

    vscode.window.showInformationMessage(`${fileName} created successfully in your workspace.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Error creating ${fileName}: ${errorMessage}`);
  }
}
