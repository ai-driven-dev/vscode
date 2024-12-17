import * as vscode from "vscode";
import { EXTENSION_ID } from "./constants";

export function getWorkspaceConfiguration(
  section?: string
): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(section);
}

export async function getWorkspaceRoot(): Promise<vscode.Uri> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("No workspace folder found");
  }
  return workspaceFolders[0].uri;
}

export function getExtensionUri(): vscode.Uri {
  const extensionUri =
    vscode.extensions.getExtension(EXTENSION_ID)?.extensionUri;
  if (!extensionUri) {
    throw new Error("Could not find extension path");
  }
  return extensionUri;
}

export async function readWorkspaceFile(
  filePath: vscode.Uri
): Promise<Uint8Array> {
  return await vscode.workspace.fs.readFile(filePath);
}

export async function writeWorkspaceFile(
  filePath: vscode.Uri,
  content: Uint8Array
): Promise<void> {
  await vscode.workspace.fs.writeFile(filePath, content);
}

export async function checkFileExists(filePath: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getFileSize(filePath: vscode.Uri): Promise<number> {
  const stat = await vscode.workspace.fs.stat(filePath);
  return stat.size;
}
