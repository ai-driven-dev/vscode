import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "ai-driven-dev" is now active!');
  vscode.window.showInformationMessage("AI-Driven Dev extension is activated");

  const config = vscode.workspace.getConfiguration("ai-driven-dev");
  let disabledCommandsCount = 0;

  if (config.get("disableCursorOpenEdit")) {
    const disableCursorCommand = vscode.commands.registerCommand(
      "cursor.openEdit",
      handleDisabledCommand("cursor.openEdit")
    );
    context.subscriptions.push(disableCursorCommand);
    disabledCommandsCount++;
  }

  if (config.get("disableConflictingCommand")) {
    const disableConflictingCommand = vscode.commands.registerCommand(
      "addCursorsAtSearchResults",
      handleDisabledCommand("addCursorsAtSearchResults")
    );
    context.subscriptions.push(disableConflictingCommand);
    disabledCommandsCount++;
  }

  if (disabledCommandsCount > 0) {
    showDisabledCommandsMessage(disabledCommandsCount);
  }
}

function handleDisabledCommand(commandName: string) {
  return () => {
    console.log(`Conflicting command "${commandName}" has been neutralized.`);
  };
}

function showDisabledCommandsMessage(count: number) {
  vscode.window.showInformationMessage(
    `AI-Driven Dev: Removed ${count} Cursor conflicted commands.`
  );
}
