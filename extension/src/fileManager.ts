import * as vscode from "vscode";

export async function writeGlobalRulesFile(): Promise<void> {
  try {
    // Get the workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error("No workspace folder found");
    }

    // Use the first workspace folder as root
    const rootUri = workspaceFolders[0].uri;
    const ruleFiles = [".windsurfrules", ".cursorrules"];

    // Read template content once
    const extensionUri = vscode.extensions.getExtension(
      "ai-driven-dev.ai-driven-dev"
    )?.extensionUri;
    if (!extensionUri) {
      throw new Error("Could not find extension path");
    }

    const templatePath = vscode.Uri.joinPath(
      extensionUri,
      "resources",
      "coding_rules.md"
    );
    const templateContent = await vscode.workspace.fs.readFile(templatePath);

    // Process each rule file
    for (const ruleFile of ruleFiles) {
      const targetFile = vscode.Uri.joinPath(rootUri, ruleFile);

      // Check if file exists and is not empty
      try {
        const stat = await vscode.workspace.fs.stat(targetFile);
        if (stat.size > 0) {
          // File exists and is not empty, ask for confirmation
          const answer = await vscode.window.showWarningMessage(
            `${ruleFile} file already exists and is not empty. Do you want to overwrite it?`,
            "Yes",
            "No"
          );

          if (answer !== "Yes") {
            vscode.window.showInformationMessage(
              `Skipped ${ruleFile} creation.`
            );
            continue;
          }
        }
      } catch {
        // File doesn't exist, continue with creation
      }

      // Write the file
      await vscode.workspace.fs.writeFile(targetFile, templateContent);
      vscode.window.showInformationMessage(
        `${ruleFile} file created successfully.`
      );
    }
  } catch (error) {
    // Log error and show error message
    console.error("Error writing rule files:", error);
    vscode.window.showErrorMessage(
      `Failed to create rule files: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
