// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function firstSymbolIsLetter(str) {
	return str[0].match(/[a-zA-Z]/i);
}

let defaultDir = 'src/components',
	addCSS = true,
	addConstructor = false,
	componentType = 'class',
	openAfterCreate = true;

const projectDir = vscode.workspace.workspaceFolders[0].uri.path.toString().split(':')[1];
const VSCodeConfigFilePath = path.join(projectDir, `.vscode/create-react-component.json`);

function readConfig() {
	jsonParse(
		fs.readFileSync(path.join(projectDir, `.vscode/create-react-component.json`), 'utf8')
	); 
}

function jsonParse(json) {
	const config = JSON.parse(json);
	defaultDir = config.defaultDir || 'src/components';
	addCSS = (config.addCSS != undefined) ? config.addCSS : true;
	addConstructor = (config.addConstructor != undefined) ? config.addConstructor : false;
	componentType = (config.componentType == 'function') ? 'function' : 'class';
	openAfterCreate = (config.openAfterCreate != undefined) ? config.openAfterCreate : true;
}

function createComponent(dir) {
	vscode.window.showInputBox({
		placeHolder: 'Enter the name of the component in Latin, separating the words with a space'
	}).then((input) => {

		if (!firstSymbolIsLetter(input)) {
			vscode.window.showErrorMessage(`Wrong component name. Component name must start with a letter`);
		} else {
			readConfig();
			const splitedInput = input.toLowerCase().split(' ');
			let componentName = '';
			splitedInput.forEach(word => {
				componentName += word[0].toUpperCase() + word.slice(1);
			});

			const componentDirName = componentName[0].toLowerCase() + componentName.slice(1);

			const CSSCommand = addCSS ? `import './${componentDirName}.css';\n\n` : '';
			const constructorCommand = addConstructor ? `	constructor(props) {\n		super(props);\n	}\n\n` : '';
			
			const contentIndex = 
			`import ${componentName} from './${componentDirName}';\nexport default ${componentName};`;
			
			const contentComponent = {
				class: `import React, {Component} from 'react';\n\n${CSSCommand}export default class ${componentName} extends Component {\n${constructorCommand}	render() {\n		return (\n			<>\n\n			</>\n		)\n	}\n}`,
				function: `import React, {Component} from 'react';\n\n${CSSCommand}function ${componentName} () {\n	return (\n		<>\n\n		</>\n	);\n}\n\nexport default ${componentName}`
			}
			
			const componentPath = `${dir}\\${componentDirName}`;

			fs.mkdirSync(componentPath, { recursive: true });

			fs.writeFile(path.join(componentPath, `${componentDirName}.js`), contentComponent[componentType], err => {
				if (err) {
					console.error(err);
					return vscode.window.showErrorMessage(`Failed to create React component. Error: ${err}`);
				}
				//vscode.window.showInformationMessage(`React component created`);
			});
			if (addCSS) {
				fs.writeFile(path.join(componentPath, `${componentDirName}.css`), '', err => {
					if (err) {
						return vscode.window.showErrorMessage(`Failed to create React component. Error: ${err}`);
					}
					//vscode.window.showInformationMessage(`React component created`);
				});
			}
			fs.writeFile(path.join(componentPath, `index.js`), contentIndex, err => {
				if (err) {
					return vscode.window.showErrorMessage(`Failed to create React component. Error: ${err}`);
				}
				//vscode.window.showInformationMessage(`React component created`);
			});
			
			vscode.window.showInformationMessage(`React component "${input}" created in ${componentPath}`);
		
			if (openAfterCreate) {
				let uri = vscode.Uri.file(path.join(componentPath, `${componentDirName}.js`));
				vscode.commands.executeCommand('vscode.open', uri);
			}
		}
	});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const createDefault = () => {
		let dir = path.join(projectDir, defaultDir);
		createComponent(dir);
	}

	const createHere = (e) => {
		let dir;
		if (e != undefined) {
			if (fs.lstatSync(e.fsPath).isDirectory()) {
				dir = e.fsPath + '\\';
			} else {
				dir = path.dirname(e.fsPath);
			}
		} else {
			return vscode.window.showErrorMessage(`Failed to create React component. Directory did't chosen`);
		}
		createComponent(dir);
	}

	const createDefaultConfig = () => {
		const contentConfig = `{\n	"defaultDir": "src/components",\n	"componentType": "class",\n	"openAfterCreate": true\n	"addCSS": true,\n	"addConstructor": false\n}`;

		fs.mkdirSync(path.join(projectDir, `.vscode`), { recursive: true });

		fs.writeFile(VSCodeConfigFilePath, contentConfig, err => {
			if (err) {
				return vscode.window.showErrorMessage(`Failed to create default config. Error: ${err}`);
			}
		});
		let uri = vscode.Uri.file(VSCodeConfigFilePath);
		vscode.commands.executeCommand('vscode.open', uri);
	}

	const openConfig = () => {
		fs.exists(VSCodeConfigFilePath, (exists) => {
			if (exists) {
				let uri = vscode.Uri.file(VSCodeConfigFilePath);
				vscode.commands.executeCommand('vscode.open', uri);
			} else {
				createDefaultConfig();
			}
		})
	}

	const commands = [
		{ command: 'create', func: createDefault},
		{ command: 'createhere', func: createHere},
		{ command: 'createdefaultconfig', func: createDefaultConfig},
		{ command: 'openconfig', func: openConfig}
	];

	commands.forEach((item) => {
		vscode.commands.registerCommand(`create-react-component.${item.command}`, item.func)
	})
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// let create = vscode.commands.registerCommand('create-react-component.create', 
	// 	function (e) {
	// 		let dir;
	// 		if (e != undefined) {
	// 			if (fs.lstatSync(e.fsPath).isDirectory()) {
	// 				dir = e.fsPath + '\\';
	// 			} else {
	// 				dir = path.dirname(e.fsPath);
	// 			}
	// 		} else {
	// 			dir = path.join(projectDir, defaultDir);
	// 		}
	// 		createComponent(dir);
	// 	}
	// );

	// context.subscriptions.push(create);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
