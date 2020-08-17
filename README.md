# Create React component
![](https://img.shields.io/badge/release-v0.5.0-green)

Create React component in chosen in explorer path or default directory

New component include (can configurate):
- path \\ {componentName} \\ {componentName}.js (React file with import {componentName}.css)
- path \\ {componentName} \ index.js (React with import {componentName}.js)
- path \\ {componentName} \\ {componentName}.css (empty file)

To use component you just need to type like this:

```javascript
import {ComponentName} from './path/{componentName}';
```

Default config looks like this:
```javascript
{
	"defaultDir": "src/components",
	"componentType": "class",
	"openAfterCreate": true,
	"addCSS": true,
	"addConstructor": false,
	"language": "en",
	"componentNameStyle": {
		"styleInExplorer": "camel",
		"bigFirstLetterInExplorer": false,
		"styleInCode": "camel",
		"bigFirstLetterInCode": true
	}
}
```
Component styles can be: 
                    
``Style``  | `bigFirstLetter = true` | `bigFirstLetter = false`
------------- | ------------- | -------------
`camel`  | ReactComponentName | reactComponentName
`snake`  | React_component_name | react_component_name
`kebab`  | React-component-name | react-component-name

