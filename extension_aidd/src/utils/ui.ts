import * as vscode from "vscode";
import { Software } from "./constants";

export async function showSuccessMessage(message: string): Promise<void> {
  await vscode.window.showInformationMessage(message);
}

export async function showErrorMessage(
  error: unknown,
  context?: string
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  await vscode.window.showErrorMessage(
    context ? `${context}: ${errorMessage}` : errorMessage
  );
}

export async function confirmOverwrite(fileName: string): Promise<boolean> {
  const answer = await vscode.window.showWarningMessage(
    `${fileName} already exists. Do you want to replace it?`,
    "Yes",
    "No"
  );
  return answer === "Yes";
}

export async function showRestartRequired(): Promise<void> {
  await showSuccessMessage("Please restart VSCode to apply the changes.");
}

export function formatFileSkipped(fileName: string): string {
  return `Skipped creating ${fileName}`;
}

export function formatFileCreated(fileName: string): string {
  return `Created ${fileName} successfully`;
}

export function formatConfigSuccess(software: Software): string {
  return `${software} configuration completed successfully`;
}

export function formatConfigError(software: Software, error: unknown): string {
  return `Failed to configure ${software}: ${
    error instanceof Error ? error.message : String(error)
  }`;
}
