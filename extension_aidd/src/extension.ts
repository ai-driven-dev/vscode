import * as vscode from "vscode";
import * as packageJSON from "../package.json";

export async function activate(context: vscode.ExtensionContext) {
  const hasShownWelcome = context.globalState.get<boolean>("aidd.extensionWelcomeShown");

  if (!hasShownWelcome) {
    const version = packageJSON.version;

    const choice = await vscode.window.showInformationMessage(
      `🚧 AI Driven Dev Extension v${version} is currently under active development. Report issues or suggestions via GitHub or Discord.`,
      "GitHub",
    );

    if (choice === "GitHub") {
      vscode.env.openExternal(vscode.Uri.parse("https://github.com/ai-driven-dev/vscode"));
    }

    await context.globalState.update("aidd.extensionWelcomeShown", true);
  }
}
