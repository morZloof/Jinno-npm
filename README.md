# Jinno-npm

Jinno is a development environment for UI components. It allows you to browse a component library, view the different states of each component.

# NPM
npm install --save jinno

# Usage 
```
Import React from 'react'
Import ReactDOM from 'react-dom'
Import Jinno, {JinnoInit} from 'jinno'

const MyComponent = ()=>{ return <span>exalmpe</span>}

JinnoInit(React,ReactDOM)//Jinno use your React version
Jinno(MyComponent,'[component id]')//Choose an Id from your component
```

# Options

### Component Id
Choose your components id so Jinno will always know which props to connect for this function 
```
Jinno(MyComponent,[component id])
```

### Component props
Send the default props of the component
```
Jinno(MyComponent,[component id],{myprops:1})
```