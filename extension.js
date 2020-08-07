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
		function (e) {
			//Выбран ли путь
			let dir;
			if (e != undefined) {
				if (fs.lstatSync(e.fsPath).isDirectory()) {
					dir = e.fsPath + '\\';
				} else {
					dir = path.dirname(e.fsPath);
				}
			} else {
				dir = path.join(
					vscode.workspace.workspaceFolders[0].uri.path.toString().split(':')[1], 
					'src/components');
			}
			console.log(dir);

			vscode.window.showInputBox({
				placeHolder: 'Введите название компонента на латинице разделяя слова пробелом'
			}).then((input) => {
				console.log('Введено пользователем: ' + input);
				
				const splitedInput = input.toLowerCase().split(' ');
				let componentName = '';
				splitedInput.forEach(word => {
					componentName += word[0].toUpperCase() + word.slice(1);
				});
				const componentDirName = componentName[0].toLowerCase() + componentName.slice(1);
				console.log('Установлено имя компонента как: ' + componentName);

				const contentIndex = 
				`import ${componentName} from './${componentDirName}';\nexport default ${componentName};`;
				const contentComponent = `import React, {Component} from 'react';\n\nimport './${componentDirName}.css';\n\nexport default class ${componentName} extends Component {\n	constructor(props) {\n		super(props);\n	}\n\n	render() {\n		return (\n			<>\n\n			</>\n		)\n	}\n}`;
				
				const componentPath = `${dir}\\${componentDirName}`;

				fs.mkdirSync(componentPath, { recursive: true });

				console.log('Создана директория');

				fs.writeFile(path.join(componentPath, `${componentDirName}.js`), contentComponent, err => {
					if (err) {
						console.error(err);
						return vscode.window.showErrorMessage("Failed to create React component");
					}
					//vscode.window.showInformationMessage(`React component created`);
				});
			    fs.writeFile(path.join(componentPath, `${componentDirName}.css`), '', err => {
					if (err) {
						console.error(err);
						return vscode.window.showErrorMessage("Failed to create React component");
					}
					//vscode.window.showInformationMessage(`React component created`);
				});
				fs.writeFile(path.join(componentPath, `index.js`), contentIndex, err => {
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
