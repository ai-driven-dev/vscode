import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Vertical Sidebar
  const config = vscode.workspace.getConfiguration();
  if (config.get("workbench.activityBar.orientation") !== "vertical") {
    config.update(
      "workbench.activityBar.orientation",
      "vertical",
      vscode.ConfigurationTarget.Global
    );

    vscode.window.showInformationMessage(
      "Please restart VSCode to apply the new vertical sidebar."
    );
  }

  // Launch the extension
  const extension = vscode.extensions.getExtension(
    "ai-driven-dev.ai-driven-dev"
  );
  const buildDate = extension?.packageJSON.built;

  vscode.window.showInformationMessage(
    "AI-Driven Dev extension is activated 🤖 " + buildDate
  );
}

export function deactivate() {}
