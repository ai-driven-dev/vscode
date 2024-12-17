import * as vscode from "vscode";

interface FileTemplate {
  filename: string;
  templatePath: string;
}

const RULE_FILES: FileTemplate[] = [
  { filename: ".windsurfrules", templatePath: "coding_rules.md" },
  { filename: ".cursorrules", templatePath: "coding_rules.md" }
];

const IGNORE_FILES: FileTemplate[] = [
  { filename: ".codeiumignore", templatePath: "ignore.md" },
  { filename: ".cursorignore", templatePath: "ignore.md" }
];

async function getWorkspaceRoot(): Promise<vscode.Uri> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("No workspace folder found");
  }
  return workspaceFolders[0].uri;
}

async function checkAndConfirmOverwrite(
  targetFile: vscode.Uri,
  fileName: string
): Promise<boolean> {
  try {
    const stat = await vscode.workspace.fs.stat(targetFile);
    if (stat.size > 0) {
      const answer = await vscode.window.showWarningMessage(
        `${fileName} file already exists and is not empty. Do you want to overwrite it?`,
        "Yes",
        "No"
      );
      return answer === "Yes";
    }
  } catch (error) {
    // File doesn't exist, proceed with creation
    return true;
  }
  return true;
}

async function getTemplateContent(templatePath: string): Promise<Uint8Array> {
  const extensionUri = vscode.extensions.getExtension(
    "ai-driven-dev.ai-driven-dev"
  )?.extensionUri;
  if (!extensionUri) {
    throw new Error("Could not find extension path");
  }

  const fullTemplatePath = vscode.Uri.joinPath(
    extensionUri,
    "resources",
    templatePath
  );
  return await vscode.workspace.fs.readFile(fullTemplatePath);
}

async function writeFile(
  rootUri: vscode.Uri,
  fileTemplate: FileTemplate,
  templateContent: Uint8Array
): Promise<void> {
  const targetFile = vscode.Uri.joinPath(rootUri, fileTemplate.filename);

  if (await checkAndConfirmOverwrite(targetFile, fileTemplate.filename)) {
    await vscode.workspace.fs.writeFile(targetFile, templateContent);
    vscode.window.showInformationMessage(
      `${fileTemplate.filename} file created successfully.`
    );
  } else {
    vscode.window.showInformationMessage(
      `Skipped ${fileTemplate.filename} creation.`
    );
  }
}

export async function writeGlobalRulesFile(): Promise<void> {
  try {
    const rootUri = await getWorkspaceRoot();
    const templateContent = await getTemplateContent(
      RULE_FILES[0].templatePath
    );

    for (const ruleFile of RULE_FILES) {
      await writeFile(rootUri, ruleFile, templateContent);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error creating rules files: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function writeIgnoreFile(): Promise<void> {
  try {
    const rootUri = await getWorkspaceRoot();
    const templateContent = await getTemplateContent(
      IGNORE_FILES[0].templatePath
    );

    for (const ignoreFile of IGNORE_FILES) {
      await writeFile(rootUri, ignoreFile, templateContent);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error creating ignore file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
