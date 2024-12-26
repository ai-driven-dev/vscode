import * as vscode from "vscode";
import { configManager } from "./utils/configManager";
import { CONFIG_KEYS } from "./utils/constants";
import { createIgnoreFile, createRulesFile } from "./utils/fileUtils";
import { showErrorMessage, showSuccessMessage } from "./utils/ui";

async function setupAIConfiguration(type: "cursor" | "windsurf") {
  const configKey =
    type === "cursor"
      ? CONFIG_KEYS.CREATE_CURSOR_FILES
      : CONFIG_KEYS.CREATE_WINDSURF_FILES;

  try {
    // Exécuter les opérations en parallèle et attendre leur complétion
    const [ruleResult, ignoreResult] = await Promise.all([
      createRulesFile(type).catch(error => {
        console.error(`Error creating rules file for ${type}:`, error);
        return false;
      }),
      createIgnoreFile(type).catch(error => {
        console.error(`Error creating ignore file for ${type}:`, error);
        return false;
      })
    ]);

    // Mettre à jour la configuration seulement si les fichiers ont été créés
    if (ruleResult !== false && ignoreResult !== false) {
      await configManager.updateConfiguration(configKey, true);
      await showSuccessMessage(`${type} configuration completed`);
    } else {
      throw new Error(`Failed to create some ${type} configuration files`);
    }
  } catch (error) {
    await showErrorMessage(error, `${type} configuration failed`);
    throw error;
  }
}

async function applyInitialConfigurations() {
  try {
    const [cursorFiles, windsurfFiles] = await Promise.all([
      configManager.getConfiguration("createCursorFiles", false),
      configManager.getConfiguration("createWindsurfFiles", false)
    ]);

    const setupPromises = [];
    if (cursorFiles) setupPromises.push(setupAIConfiguration("cursor"));
    if (windsurfFiles) setupPromises.push(setupAIConfiguration("windsurf"));

    if (setupPromises.length > 0) {
      await Promise.all(setupPromises);
    }
  } catch (error) {
    console.error("Error applying initial configurations:", error);
    await showErrorMessage(error, "Failed to apply initial configurations");
  }
}

export async function activate(context: vscode.ExtensionContext) {
  try {
    await configManager.initialize();

    // Enregistrer les commandes avec une meilleure gestion des erreurs
    const commandHandlers = {
      "ai-driven-dev.createCursorFiles": () => setupAIConfiguration("cursor"),
      "ai-driven-dev.createWindsurfFiles": () => setupAIConfiguration("windsurf")
    };

    const disposables = Object.entries(commandHandlers).map(([command, handler]) =>
      vscode.commands.registerCommand(command, async () => {
        try {
          await handler();
        } catch (error) {
          console.error(`Error executing ${command}:`, error);
        }
      })
    );

    context.subscriptions.push(...disposables);

    // Nettoyer les ressources lors de la désactivation
    context.subscriptions.push({
      dispose: () => configManager.dispose()
    });

    // Appliquer les configurations initiales de manière asynchrone
    queueMicrotask(applyInitialConfigurations);

  } catch (error) {
    console.error("Error activating extension:", error);
    await showErrorMessage(error, "Failed to activate extension");
    throw error;
  }
}

export function deactivate() {
  // La désactivation est gérée par le disposable ajouté dans activate()
}
