let mySDKComponents = [];

function generateSession() {
  return "jinno" + Math.random().toString(36).substr(2, 9);
}

export default function Jinno(component, id, props = {}, properties = {}) {
  if (!id && component && component.name) {
    id = component.name;
  } else if (!id || !component || (!component.name && !id)) {
    console.error(
      "You have to add id to Jinno, example: Jinno(myComponent,'[myComponentId:string]')"
    );
    return;
  }

  let componentElementId = generateSession();

  mySDKComponents.push({
    typeId: id,
    elementId: componentElementId,
    Component: component,
  });

  const params = {
    clientId: id,
    title: component && component.name ? component.name : "",
    injectComponentId: componentElementId,
    props: props ? JSON.stringify(props) : null,
  };

  if (properties && properties.title) {
    params.title = properties.title;
  }

  if (properties && properties.width) {
    params.width = properties.width;
  }

  if (properties && properties.height) {
    params.height = properties.height;
  }

  setTimeout(() => {
    let detail = { clientId: id, params };
    var event = new CustomEvent("saveComponent", {
      detail: detail,
    });
    document.dispatchEvent(event);
  }, 1000);
}

const RenderComponent = (id, props) => {
  let findComponent = mySDKComponents.find((comp) => {
    return comp.elementId === id;
  });

  if (findComponent && findComponent.Component) {
    let Component = findComponent.Component;
    ReactDOM.render(
      React.createElement(Component, props, null),
      document.getElementById(id)
    );
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

var React;
var ReactDOM;
var RenderOnInit = [];
export function JinnoInit(ReactNpm, ReactDOMNpm) {
  React = ReactNpm;
  ReactDOM = ReactDOMNpm;

  RenderOnInit.map((item) => {
    RenderComponent(item.id, item.props);
  });
  RenderOnInit = [];
}