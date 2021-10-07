import React from "react";
import ReactDOM from "react-dom";
import { checkIfToStartHotReload, JinnoInit } from "./JinnoHotReload";

let mySDKComponents = [];

function generateSession() {
  return "jinno" + Math.random().toString(36).substr(2, 9);
}
document.addEventListener("getAllComponents", function (e) {
  mySDKComponents.forEach((item) => {
    let detail = { clientId: item.typeId, params: item.params };
    var event = new CustomEvent("saveComponent", {
      detail: detail,
    });
    document.dispatchEvent(event);
  });
});

export function getMySDKComponents() {
  return mySDKComponents;
}

export default function Jinno(
  component,
  forwardModule,
  id,
  props = {},
  properties = {}
) {
  if (!id && component && component.name) {
    id = component.name;
  } else if (!id || !component || (!component.name && !id)) {
    console.error(
      "You have to add id to Jinno, example: Jinno(myComponent,null,'[myComponentId:string]')"
    );
  }

  let findComponent = mySDKComponents.find((comp) => comp.typeId === id);

  if (findComponent) {
    findComponent.forwardModule = forwardModule; // update the new module
    findComponent.Component = component; // update the new component
    if (findComponent.params) {
      findComponent.params.props = props; // update the new props
    }

    checkIfToStartHotReload(id);
    //if we already added this component
    return;
  }

  try {
    id = id.replace(/[^A-Z0-9]/gi, "");
    id = id.charAt(0).toUpperCase() + id.slice(1);
  } catch (e) {
    console.error("Id is invalid, plaese use only chars and numbers");
  }

  let componentElementId = generateSession();

  const computedStyle = window.getComputedStyle(document.body);

  props.hiddenStyle = {
    direction: computedStyle["direction"],
    boxSizing: computedStyle["box-sizing"],
    textAlign: computedStyle["text-align"],
  };

  const params = {
    clientId: id,
    title: component && component.name ? component.name : "",
    injectComponentId: componentElementId,
    props: props ? JSON.stringify(props) : null,
  };

  let data = {
    typeId: id,
    elementId: componentElementId,
    Component: component,
    forwardModule,
    params,
  };

  mySDKComponents.push(data);

  if (properties && properties.title) {
    params.title = properties.title;
  }

  if (properties && properties.width) {
    params.width = properties.width;
  }

  if (properties && properties.height) {
    params.height = properties.height;
  }

  // let classComponent = new JinnoComponent(data);
  // mySDKComponentsClass.push(classComponent)

  let detail = { clientId: id, params };
  var event = new CustomEvent("saveComponent", {
    detail: detail,
  });
  document.dispatchEvent(event);

  checkIfToStartHotReload(id);
}

const RenderComponent = (id, props) => {
  let findComponent = mySDKComponents.find((comp) => {
    return comp.elementId === id;
  });

  if (findComponent && findComponent.Component) {
    let Component = findComponent.Component;
    let element = document.getElementById(id);
    if (element) {
      // ReactDOM.render(
      //   <span style={props.hiddenStyle ? props.hiddenStyle : {}}>
      //     {React.createElement(Component, props, null)}
      //   </span>,
      //   element
      // );
      ReactDOM.render(React.createElement(Component, props, null), element);
    }
  }
};

document.addEventListener(
  "sendDataToJino",
  function (e) {
    //listener on changed nodeId
    if (e && e.detail && e.detail.function === "RenderComponent") {
      let data = e.detail ? e.detail.data : {};
      let props = data && data.props ? data.props : {};
      if (typeof props === "string") {
        try {
          props = JSON.parse(props);
        } catch (e) {}
      }
      let id = data && data.id ? data.id : {};

      if (React && ReactDOM) {
        RenderComponent(id, props);
      } else {
        RenderOnInit.push({ id, props });
      }
    }
  },
  false
);

// var React;
// var ReactDOM;
var RenderOnInit = [];
export function JinnoInitReact(ReactNpm, ReactDOMNpm) {
  React = ReactNpm;
  ReactDOM = ReactDOMNpm;

  RenderOnInit.map((item) => {
    RenderComponent(item.id, item.props);
  });
  RenderOnInit = [];
}

export const showJinno = () => {
  let scriptLink = "https://jinno-sdk.s3.amazonaws.com/sdk.js";
  var script = document.createElement("script");
  script.src = scriptLink;

  document.head.appendChild(script);
};

export { JinnoInit };
