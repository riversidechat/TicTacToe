/***
 * @returns Returns the element Id if provided
 */
function CreateElement(type, attributes, path)
{
  const parent = document.querySelector(path);
  const el = document.createElement(type);
  for(var attribute in attributes)
  {
    el.setAttribute(attribute, attributes[attribute]);
  }
  parent.appendChild(el);
  return "#" + attributes["id"];
}

function RandomInt(min, max) { return Math.round(Math.random() * (max - min) + min); }
function RandomFloat(min, max) { return Math.random() * (max - min) + min; }