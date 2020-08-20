const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


function firstSymbolIsLetter(str) {
	return str[0].match(/[a-zA-Z]/i);
}

let defaultDir = 'src/components',
	addCSS = true,
	addConstructor = false,
	componentType = 'class',
	openAfterCreate = true,
	language = 'en',
	componentNameStyle = {
		styleInExplorer: 'camel',
		bigFirstLetterInExplorer: false,
		styleInCode: 'camel',
		bigFirstLetterInCode: true 
	}

	const inputComponentNamePlaceholder = {
		en: 'Enter the name of the component in Latin, separating the words with a space',
		ru: 'Введите название компонента на латинице разделяя слова пробелом'
	}
	const wrongComponentNameError = {
		en: 'Wrong component name. Component name must start with a letter',
		ru: 'Неверное имя компонента. Имя компонента должно начинаться с буквы'
	}
	const failedToCreateComponent = {
		en: 'Failed to create React component',
		ru: 'Ошибка создания компонента'
	}
	const errorText = {
		en: 'Error',
		ru: 'Ошибка'
	}
	const reactComponent = {
		en: 'React component',
		ru: 'React компонент'
	}
	const createdIn = {
		en: 'created in',
		ru: 'создан в'
	}
	const directoryDidNotChousen = {
		en: `Directory did't chosen`,
		ru: 'Директория не выбрана'
	}
	const failedtToCreateConfig = {
		en: 'Failed to create default config',
		ru: 'Ошибка создания файла конфигурации'
	}

const projectDir = vscode.workspace.workspaceFolders[0].uri.path.toString().split(':')[1];
const VSCodeConfigFilePath = path.join(projectDir, `.vscode/create-react-component.json`);

function readConfig() {
	jsonParse(
		fs.readFileSync(path.join(projectDir, `.vscode/create-react-component.json`), 'utf8')
	); 
}

function jsonParse(json) {
	const config = JSON.parse(json);
	console.log(config);
	defaultDir = config.defaultDir || 'src/components';
	addCSS = (config.addCSS != undefined) ? config.addCSS : true;
	addConstructor = (config.addConstructor != undefined) ? config.addConstructor : false;
	componentType = (config.componentType == 'function') ? 'function' : 'class';
	openAfterCreate = (config.openAfterCreate != undefined) ? config.openAfterCreate : true;
	language = (config.addCSS == undefined || config.language != 'ru') ? 'en' : 'ru';
	componentNameStyle.styleInExplorer = (
		config.componentNameStyle.styleInExplorer == undefined &&
		config.componentNameStyle.styleInExplorer != 'snake' &&
		config.componentNameStyle.styleInExplorer != 'kebab'
	) ? 'camel' : config.componentNameStyle.styleInExplorer;
	console.log('config.componentNameStyle.styleInExplorer=' + config.componentNameStyle.styleInExplorer);
	console.log('componentNameStyle.styleInExplorer=' + componentNameStyle.styleInExplorer);
	componentNameStyle.styleInCode = (
		config.componentNameStyle.styleInCode == undefined &&
		config.componentNameStyle.styleInCode != 'snake' &&
		config.componentNameStyle.istyleInCode != 'kebab'
	) ? 'camel' : config.componentNameStyle.styleInCode;
	componentNameStyle.bigFirstLetterInExplorer = (config.componentNameStyle.bigFirstLetterInExplorer != undefined) ? config.componentNameStyle.bigFirstLetterInExplorer : false;
	componentNameStyle.bigFirstLetterInCode = (config.componentNameStyle.bigFirstLetterInCode != undefined) ? config.componentNameStyle.bigFirstLetterInCode : true;
}

function textStyle(text, style = 'camel', firstLetterBig = true) {
	const splitedText = text.toLowerCase().split(' ');
	let newText = '';
	style = style.toLowerCase();
	if (style == 'camel') {
		splitedText.forEach((word, i) => {
			if (i == 0 && !firstLetterBig) {
				newText += word;
			} else {
				newText += word[0].toUpperCase() + word.slice(1);
			}
		});
	} else if (style == 'snake') {
		splitedText.forEach((word, i) => {
			if (i == 0) {
				if (firstLetterBig) {
					newText = word[0].toUpperCase() + word.slice(1);
				} else {
					newText = word;
				}
			} else {
				newText += '_' + word;
			}
		});
	} else if (style == 'kebab') {
		splitedText.forEach((word, i) => {
			if (i == 0) {
				if (firstLetterBig) {
					newText = word[0].toUpperCase() + word.slice(1);
				} else {
					newText = word;
				}
			} else {
				newText += '-' + word;
			}
		});
	} else {
		splitedText.forEach((word, i) => {
			if (i == 0 && firstLetterBig) {
				newText += word[0].toUpperCase() + word.slice(1);
			} else {
				newText += word;
			}
		});
	}
	return newText;
}

function createComponent(dir) {
	readConfig();
	vscode.window.showInputBox({
		placeHolder: inputComponentNamePlaceholder[language]
	}).then((input) => {

		if (!firstSymbolIsLetter(input)) {
			vscode.window.showErrorMessage(wrongComponentNameError[language]);
		} else {
			const componentName = textStyle(input, componentNameStyle.styleInCode, componentNameStyle.bigFirstLetterInCode);
			// const splitedInput = input.toLowerCase().split(' ');
			// let componentName = '';
			// splitedInput.forEach(word => {
			// 	componentName += word[0].toUpperCase() + word.slice(1);
			// });
			const componentDirName = textStyle(input, componentNameStyle.styleInExplorer, componentNameStyle.bigFirstLetterInExplorer);

			//const componentDirName = componentName[0].toLowerCase() + componentName.slice(1);

			const CSSCommand = addCSS ? `import './${componentDirName}.css';\n\n` : '';
			const constructorCommand = addConstructor ? `	constructor(props) {\n		super(props);\n	}\n\n` : '';
			
			const contentIndex = `import ${componentName} from './${componentDirName}';\nexport default ${componentName};`;
			
			const contentComponent = {
				class: `import React, {Component} from 'react';\n\n${CSSCommand}export default class ${componentName} extends Component {\n${constructorCommand}	render() {\n		return (\n			<>\n\n			</>\n		)\n	}\n}`,
				function: `import React from 'react';\n\n${CSSCommand}function ${componentName} () {\n	return (\n		<>\n\n		</>\n	);\n}\n\nexport default ${componentName}`
			}
			
			const componentPath = path.join(dir, componentDirName);

			fs.mkdirSync(componentPath, { recursive: true });

			fs.writeFile(path.join(componentPath, `${componentDirName}.js`), contentComponent[componentType], err => {
				if (err) {
					return vscode.window.showErrorMessage(`${failedToCreateComponent[language]}. ${errorText[language]} ${err}`);
				}
			});
			if (addCSS) {
				fs.writeFile(path.join(componentPath, `${componentDirName}.css`), '', err => {
					if (err) {
						return vscode.window.showErrorMessage(`${failedToCreateComponent[language]}. ${errorText[language]} ${err}`);
					}
				});
			}
			fs.writeFile(path.join(componentPath, `index.js`), contentIndex, err => {
				if (err) {
					return vscode.window.showErrorMessage(`${failedToCreateComponent[language]}. ${errorText[language]} ${err}`);
				}
			});
			
			vscode.window.showInformationMessage(`${reactComponent[language]} "${input}" ${createdIn[language]} ${componentPath}`);
		
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
			return vscode.window.showErrorMessage(`${failedToCreateComponent[language]}. ${directoryDidNotChousen[language]}`);
		}
		createComponent(dir);
	}

	const createDefaultConfig = () => {
		const contentConfig = `{\n	"defaultDir": "src/components",\n	"componentType": "class",\n	"openAfterCreate": true,\n	"addCSS": true,\n	"addConstructor": false,\n	"language": "en",\n	"componentNameStyle": {\n		"styleInExplorer": "camel",\n		"bigFirstLetterInExplorer": false,\n		"styleInCode": "camel",\n		"bigFirstLetterInCode": true\n	}\n}`;

		fs.mkdirSync(path.join(projectDir, `.vscode`), { recursive: true });

		fs.writeFile(VSCodeConfigFilePath, contentConfig, err => {
			if (err) {
				return vscode.window.showErrorMessage(`${failedtToCreateConfig[language]}. ${errorText}: ${err}`);
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
	

	// context.subscriptions.push(create);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
