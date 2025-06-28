// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	/* Linguee */
	let lingueePlaceholder = "Construction to translate";
	vscode.commands.registerCommand('extension.lingueeDutchEnglish', async () => {
		wordLookup("linguee",
		{ "base": "english-dutch",
				"source": "dutch", 
				"placeholder": lingueePlaceholder, 
				"prompt": "Enter a construction to translate from Dutch to English." }
		);
	});
	vscode.commands.registerCommand('extension.lingueeEnglishDutch', async () => {
		wordLookup("linguee", 
			{ "base": "english-dutch",
				"source": "english",
				"placeholder": lingueePlaceholder,
				"prompt": "Enter a construction to translate from English to Dutch." });
	});

	/* Thesaurus */
	vscode.commands.registerCommand('extension.thesaurus', async () => {
		wordLookup("thesaurus", { "placeholder": "Word to look up",
				"prompt": "Enter a word or construction to get thesaurus info for." });
	});

	/* Synoniemen */
	vscode.commands.registerCommand('extension.synoniemen', async () => {
		wordLookup("synoniemen", { "placeholder": "Word to look up",
				"prompt": "Enter a word to a synonym for." });
	});
}

async function wordLookup(contentType, options) {
	// Get the active text editor and selection
	const editor = vscode.window.activeTextEditor;
	let selectedText = '';

	if (editor) {
		const selection = editor.selection;
		selectedText = editor.document.getText(selection);
	}

	// Use the selected text as the query if there is any; otherwise, prompt the user
	let query;
	if (selectedText.trim() !== '') {
		query = selectedText;
	} else {
		// Ask the user for input
		query = await vscode.window.showInputBox({
			placeHolder: options.placeholder,
			prompt: options.prompt
		});
	}

	if (query) {
		openWebview(query, contentType, options);
	}
}

function openWebview(query, contentType, options) {
	// Create and show a new webview
	// const panel = vscode.window.createWebviewPanel(
	// 	'queryWebview', // Identifies the type of the webview
	// 	'Linguee Dutch to English', // Title of the panel displayed to the user
	// 	vscode.ViewColumn.One, // Editor column to show the new webview panel in
	// 	{ enableScripts: true } // Webview options
	// ); 
	const encodedQuery = encodeURIComponent(query);
	let searchUrl;

	switch (contentType) {
		case "linguee":
			searchUrl = `https://www.linguee.com/${options.base}/search?source=${options.source}&query=${encodedQuery}`;
			break;
		case "thesaurus":
			searchUrl = `https://thesaurus.com/browse/${encodedQuery}`;
			break;
		case "synoniemen":
			searchUrl = `https://synoniemen.net/index.php?zoekterm=${encodedQuery}`;
			break;
	}

	vscode.env.openExternal(searchUrl);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
