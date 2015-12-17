import { setAccessor } from '../util/accessor';
import eventMap from '../util/event-map';
import realNodeMap from '../util/real-node-map';

function createElement (el) {
  const realNode = document.createElement(el.tagName);
  const attributes = el.attributes;
  const events = el.events;
  const eventHandlers = eventMap(realNode);
  const children = el.childNodes;

  if (attributes) {
    const attributesLen = attributes.length;
    for (let a = 0; a < attributesLen; a++) {
      const attr = attributes[a];
      setAccessor(realNode, attr.name, attr.value);
    }
  }

  if (events) {
    for (let name in events) {
      realNode.addEventListener(name, eventHandlers[name] = events[name]);
    }
  }

  if (children) {
    const content = realNode.content || realNode;
    const docfrag = document.createDocumentFragment();
    const childrenLen = children.length;

    for (let a = 0; a < childrenLen; a++) {
      const ch = children[a];
      ch && docfrag.appendChild(render(ch));
    }

    if (content.appendChild) {
      content.appendChild(docfrag);
    }
  }

  return realNode;
}

function createText (el) {
  return document.createTextNode(el.textContent);
}

export default function render (el) {
  if (el instanceof Node) {
    return el;
  }
  const realNode = el.tagName ? createElement(el) : createText(el);
  realNodeMap.set(el, realNode);
  return realNode;
}
