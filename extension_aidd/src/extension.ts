import * as vscode from "vscode";
import * as packageJSON from "../package.json";

const WELCOME_KEY = "aidd.extensionWelcomeShown";

export async function activate(context: vscode.ExtensionContext) {
  const hasShownWelcome = context.globalState.get<boolean>(WELCOME_KEY);

  if (!hasShownWelcome) {
    const version = packageJSON.version;

    const choice = await vscode.window.showInformationMessage(
      `🚧 AI Driven Dev Extension v${version} is currently under active development. Report issues or suggestions via GitHub or Discord.`,
      "GitHub",
    );

    if (choice === "GitHub") {
      vscode.env.openExternal(
        vscode.Uri.parse("https://github.com/ai-driven-dev/vscode"),
      );
    }

    // Attendez explicitement que la mise à jour soit terminée
    try {
      await context.globalState.update(WELCOME_KEY, true);
      console.log("Welcome message shown and state saved successfully");
    } catch (err) {
      console.error("Failed to update global state:", err);
    }
  }
}

export function deactivate() {}
