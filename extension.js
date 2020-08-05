// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('create-react-component.createreactcomponent', 
		function () {
			vscode.window.showInputBox({
				placeHolder: 'Введите название компонента разделяя слова пробелом'
			}).then((input) => {
				console.log('Введено пользователем: ' + input);
				const contentIndex = 
				`import ${input} from './${input}';\nexport default ${input};`;
				const contentComponent = `import React, {Component} from 'react';\n\nimport './${input}.css';\n\nexport default class ${input} extends Component {\n\n	constructor(props) {\n\n	}\n\n	render() {\n\n	}\n}`;
				const componentPath = `src/component/${input}`;
				const folderPath = path.join(
					vscode.workspace.workspaceFolders[0].uri.path.toString().split(':')[1],
					componentPath);

				console.log('folderPath: ' + folderPath);

				fs.mkdirSync(folderPath, { recursive: true });

				console.log('Создана директория');

				fs.writeFile(path.join(folderPath, `${input}.js`), contentComponent, err => {
					if (err) {
						console.error(err);
						return vscode.window.showErrorMessage("Failed to create React component");
					}
					//vscode.window.showInformationMessage(`React component created`);
				});
			    fs.writeFile(path.join(folderPath, `${input}.css`), '', err => {
					if (err) {
						console.error(err);
						return vscode.window.showErrorMessage("Failed to create React component");
					}
					//vscode.window.showInformationMessage(`React component created`);
				});
				fs.writeFile(path.join(folderPath, `index.js`), contentIndex, err => {
					if (err) {
						console.error(err);
						return vscode.window.showErrorMessage("Failed to create React component");
					}
					//vscode.window.showInformationMessage(`React component created`);
				});
				vscode.window.showInformationMessage(`React component "${input}" created in ${componentPath}`);
				console.log('Файлы созданы!');
			});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
