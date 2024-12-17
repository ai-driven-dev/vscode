import * as vscode from "vscode";
import { FileTemplate, Software, SOFTWARE_CONFIG, EXTENSION_ID } from "./constants";
import {
  confirmOverwrite,
  formatFileCreated,
  formatFileSkipped,
  showErrorMessage,
  showSuccessMessage
} from "./ui";

// Path Operations
export function joinPaths(base: vscode.Uri, ...pathSegments: string[]): vscode.Uri {
  return vscode.Uri.joinPath(base, ...pathSegments);
}

// Workspace Operations
export async function getWorkspaceRoot(): Promise<vscode.Uri> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("No workspace folder found");
  }
  return workspaceFolders[0].uri;
}

export function getExtensionUri(): vscode.Uri {
  const extension = vscode.extensions.getExtension(EXTENSION_ID);
  if (!extension) {
    throw new Error("Extension not found");
  }
  return extension.extensionUri;
}

// File Operations
export async function readWorkspaceFile(filePath: vscode.Uri): Promise<Uint8Array> {
  return await vscode.workspace.fs.readFile(filePath);
}

export async function writeWorkspaceFile(filePath: vscode.Uri, content: Uint8Array): Promise<void> {
  await vscode.workspace.fs.writeFile(filePath, content);
}

export async function getFileSize(filePath: vscode.Uri): Promise<number> {
  const stat = await vscode.workspace.fs.stat(filePath);
  return stat.size;
}

// Template Operations
export function getTemplateFilePath(templatePath: string, resourcePath: vscode.Uri): vscode.Uri {
  return joinPaths(resourcePath, "resources", templatePath);
}

async function getTemplateContent(templatePath: string): Promise<Uint8Array> {
  const extensionUri = getExtensionUri();
  const fullTemplatePath = getTemplateFilePath(templatePath, extensionUri);
  return await readWorkspaceFile(fullTemplatePath);
}

// Validation Utilities
export function isEmptyOrWhitespace(str: string): boolean {
  return !str || str.trim().length === 0;
}

export function validateFileTemplate(template: FileTemplate): void {
  if (isEmptyOrWhitespace(template.filename)) {
    throw new Error("File template filename cannot be empty");
  }
  if (isEmptyOrWhitespace(template.templatePath)) {
    throw new Error("File template path cannot be empty");
  }
}

// File Creation with Confirmation
async function saveFileWithConfirmation(
  filePath: vscode.Uri,
  content: Uint8Array,
  fileName: string
): Promise<void> {
  try {
    const fileSize = await getFileSize(filePath);
    if (fileSize > 0 && !(await confirmOverwrite(fileName))) {
      await showSuccessMessage(formatFileSkipped(fileName));
      return;
    }
  } catch {
    // File doesn't exist, proceed with creation
  }

  try {
    await writeWorkspaceFile(filePath, content);
    await showSuccessMessage(formatFileCreated(fileName));
  } catch (error) {
    await showErrorMessage(error, `Failed to create ${fileName}`);
  }
}

// Public API for Config File Creation
export async function createConfigFile(software: Software, type: "rules" | "ignore"): Promise<void> {
  try {
    const template = SOFTWARE_CONFIG[software][type];
    validateFileTemplate(template);

    const workspaceRoot = await getWorkspaceRoot();
    const content = await getTemplateContent(template.templatePath);
    const filePath = joinPaths(workspaceRoot, template.filename);

    await saveFileWithConfirmation(filePath, content, template.filename);
  } catch (error) {
    await showErrorMessage(error, `Failed to create ${type} file for ${software}`);
  }
}

// Convenience Methods
export async function createRulesFile(software: Software): Promise<void> {
  return createConfigFile(software, "rules");
}

export async function createIgnoreFile(software: Software): Promise<void> {
  return createConfigFile(software, "ignore");
}
