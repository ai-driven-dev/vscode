import * as vscode from "vscode";
import { configManager } from "./utils/configManager";
import { createIgnoreFile, createRulesFile } from "./utils/fileUtils";
import { showErrorMessage, showSuccessMessage } from "./utils/ui";

async function setupAIConfiguration(type: "cursor" | "windsurf") {
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

    // Afficher un message de succès si les fichiers ont été créés
    if (ruleResult !== false && ignoreResult !== false) {
      await showSuccessMessage(`${type} configuration completed`);
    } else {
      throw new Error(`Failed to create some ${type} configuration files`);
    }
  } catch (error) {
    await showErrorMessage(error, `${type} configuration failed`);
    throw error;
  }
}

export async function activate(context: vscode.ExtensionContext) {
  try {
    await configManager.initialize();

    // Enregistrer les commandes
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

  } catch (error) {
    console.error("Error activating extension:", error);
    await showErrorMessage(error, "Failed to activate extension");
    throw error;
  }
}

export function deactivate() {
  // La désactivation est gérée par le disposable ajouté dans activate()
}
