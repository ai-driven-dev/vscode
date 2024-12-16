import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Override the conflicting command with a neutral implementation
    const disableConflictingCommand = vscode.commands.registerCommand(
        'addCursorsAtSearchResults',
        () => {
            console.log('The conflicting command "addCursorsAtSearchResults" has been neutralized.');
        }
    );

    // Ensure proper cleanup
    context.subscriptions.push(disableConflictingCommand);

    vscode.window.showInformationMessage(
        'AI-Driven Dev: Conflicting command neutralized. Default behavior is now active.'
    );
} 