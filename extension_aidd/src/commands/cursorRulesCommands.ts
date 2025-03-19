import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import * as vscode from "vscode";

/**
 * GitHub API configuration
 */
const GITHUB_API = {
  RULES_REPO_URL: "https://api.github.com/repos/ai-driven-dev/rules/contents/.cursor/rules",
  USER_AGENT: "AI-Driven-Dev-Extension",
};

/**
 * Represents a file from GitHub API response
 */
interface GitHubFile {
  name: string;
  path: string;
  download_url: string;
  type: string;
}

/**
 * Main command handler for updating Cursor rules from GitHub
 * Orchestrates the entire update workflow
 */
export async function updateCursorRules(): Promise<void> {
  // Step 1: Confirm with user before proceeding
  const confirmation = await vscode.window.showInformationMessage(
    "This will update your Cursor rules with the latest version from GitHub. Continue?",
    "Update",
    "Cancel",
  );

  if (confirmation !== "Update") {
    return;
  }

  // Step 2: Get workspace root path
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder open");
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const cursorRulesPath = path.join(rootPath, ".cursor", "rules");

  // Step 3: Show progress and execute update
  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Updating Cursor Rules",
        cancellable: true,
      },
      async (progress, token) => {
        // Setup cancellation
        token.onCancellationRequested(() => {
          console.log("User canceled the Cursor rules update");
        });

        try {
          // Step 3.1: Create directory structure
          progress.report({ message: "Creating directories..." });
          await createDirectoryRecursively(cursorRulesPath);

          // Step 3.2: Fetch files list from GitHub
          progress.report({ message: "Fetching rules from GitHub..." });
          const files = await fetchGitHubDirectoryContents();

          if (token.isCancellationRequested) {
            return;
          }

          // Step 3.3: Download files in parallel
          await downloadFilesWithProgress(files, cursorRulesPath, progress, token);

          // Step 3.4: Finalize
          progress.report({ message: "Finalizing..." });
          vscode.window.showInformationMessage("Cursor rules updated successfully!");
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          vscode.window.showErrorMessage(`Error updating Cursor rules: ${errorMessage}`);
        }
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Error updating Cursor rules: ${errorMessage}`);
  }
}

/**
 * Creates directory structure recursively if it doesn't exist
 */
async function createDirectoryRecursively(dirPath: string): Promise<void> {
  const dirUri = vscode.Uri.file(dirPath);
  try {
    await vscode.workspace.fs.stat(dirUri);
  } catch {
    // Directory doesn't exist, create it recursively
    await vscode.workspace.fs.createDirectory(dirUri);
  }
}

/**
 * Fetches the list of files from GitHub repository
 */
function fetchGitHubDirectoryContents(): Promise<GitHubFile[]> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": GITHUB_API.USER_AGENT,
      },
    };

    https
      .get(GITHUB_API.RULES_REPO_URL, options, (response) => {
        let rawData = "";

        response.on("data", (chunk) => {
          rawData += chunk;
        });

        response.on("end", () => processApiResponse(response, rawData, resolve, reject));
      })
      .on("error", (error) => {
        reject(new Error(`Error fetching GitHub directory: ${error.message}`));
      });
  });
}

/**
 * Processes GitHub API response
 */
function processApiResponse(
  response: http.IncomingMessage,
  data: string,
  resolve: (files: GitHubFile[]) => void,
  reject: (error: Error) => void,
): void {
  if (response.statusCode !== 200) {
    reject(
      new Error(`GitHub API request failed: ${response.statusCode} ${response.statusMessage}`),
    );
    return;
  }

  try {
    const files = JSON.parse(data);
    resolve(files);
  } catch (error) {
    reject(new Error(`Error parsing GitHub API response: ${error}`));
  }
}

/**
 * Downloads files in parallel while updating progress information
 */
async function downloadFilesWithProgress(
  files: GitHubFile[],
  targetDir: string,
  progress: vscode.Progress<{ message?: string; increment?: number }>,
  token: vscode.CancellationToken,
): Promise<void> {
  progress.report({ message: `Downloading ${files.length} files...` });

  let downloadedCount = 0;
  const totalFiles = files.length;

  await Promise.all(
    files.map(async (file) => {
      if (token.isCancellationRequested) {
        return;
      }

      await downloadFile(file, targetDir);

      // Update progress counter
      downloadedCount++;
      progress.report({
        message: `Downloaded ${downloadedCount}/${totalFiles} files...`,
      });
    }),
  );
}

/**
 * Downloads a single file from GitHub to the target directory
 */
function downloadFile(file: GitHubFile, targetDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!file.download_url) {
      reject(new Error(`No download URL for ${file.name}`));
      return;
    }

    const targetPath = path.join(targetDir, file.name);
    const fileStream = fs.createWriteStream(targetPath);

    https
      .get(file.download_url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download ${file.name}: ${response.statusCode} ${response.statusMessage}`,
            ),
          );
          return;
        }

        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
      })
      .on("error", (error) => handleDownloadError(error, targetPath, file.name, reject));

    fileStream.on("error", (error) => handleDownloadError(error, targetPath, file.name, reject));
  });
}

/**
 * Handles errors during file download
 */
function handleDownloadError(
  error: Error,
  filePath: string,
  fileName: string,
  reject: (error: Error) => void,
): void {
  // Clean up partial file
  fs.unlink(filePath, () => {});
  reject(new Error(`Error downloading ${fileName}: ${error.message}`));
}
