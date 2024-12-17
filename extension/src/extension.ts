import * as vscode from "vscode";
import { CONFIG_KEYS } from "./utils/constants";
import { createIgnoreFile, createRulesFile } from "./utils/fileUtils";
import {
  showErrorMessage,
  showSuccessMessage
} from "./utils/ui";

async function setupAIConfiguration(type: "cursor" | "windsurf") {
  const aiConfig = vscode.workspace.getConfiguration("ai-driven-dev");
  const configKey =
    type === "cursor"
      ? CONFIG_KEYS.CREATE_CURSOR_FILES
      : CONFIG_KEYS.CREATE_WINDSURF_FILES;

  aiConfig.update(configKey, true, vscode.ConfigurationTarget.Global);

  try {
    await createRulesFile(type);
    await createIgnoreFile(type);
    await showSuccessMessage(`${type} configuration completed`);
  } catch (error) {
    await showErrorMessage(error, `${type} configuration failed`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Register Cursor configuration command
  let setupCursor = vscode.commands.registerCommand(
    "ai-driven-dev.createCursorFiles",
    () => setupAIConfiguration("cursor")
  );

  // Register Windsurf configuration command
  let setupWindsurf = vscode.commands.registerCommand(
    "ai-driven-dev.createWindsurfFiles",
    () => setupAIConfiguration("windsurf")
  );

  // Register Cursor configuration command
  let cursorCommand = vscode.commands.registerCommand(
    "ai-driven-dev.configureCursor",
    async () => {
      try {
        await setupAIConfiguration("cursor");
      } catch (error) {
        await showErrorMessage(error, "Cursor configuration failed");
      }
    }
  );

  // Register Windsurf configuration command
  let windsurfCommand = vscode.commands.registerCommand(
    "ai-driven-dev.configureWindsurf",
    async () => {
      try {
        await setupAIConfiguration("windsurf");
      } catch (error) {
        await showErrorMessage(error, "Windsurf configuration failed");
      }
    }
  );

  // Notify extension activation
  showSuccessMessage(`AI-Driven Dev activated 🔥`);

  // Register commands
  context.subscriptions.push(setupCursor, setupWindsurf, cursorCommand, windsurfCommand);
}

export function deactivate() {}
