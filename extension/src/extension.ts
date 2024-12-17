import * as vscode from "vscode";
import { writeGlobalRulesFile } from './fileManager';

export function activate(context: vscode.ExtensionContext) {
  // Vertical Sidebar
  const config = vscode.workspace.getConfiguration();

  const orientationConfig = config.get("workbench.activityBar.orientation");

  if (orientationConfig && orientationConfig !== "vertical") {
    config.update(
      "workbench.activityBar.orientation",
      "vertical",
      vscode.ConfigurationTarget.Global
    );

    vscode.window.showInformationMessage(
      "Please restart VSCode to apply the new vertical sidebar."
    );
  }

  // Write global rules file
  writeGlobalRulesFile().catch(error => {
    console.error('Failed to write global rules file:', error);
  });

  // Launch the extension
  const extension = vscode.extensions.getExtension(
    "ai-driven-dev.ai-driven-dev"
  );
  const buildDate = extension?.packageJSON.built;

  vscode.window.showInformationMessage(
    "AI-Driven Dev extension is activated 🤖 " + buildDate
  );

  // Register command
  let disposable = vscode.commands.registerCommand('my-extension.writeGlobalRules', () => {
    writeGlobalRulesFile();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
