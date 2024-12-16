import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "ai-driven-dev" is now active!');

  vscode.window.showInformationMessage(
    "AI-Driven Dev extension is activated 🤖"
  );
}
