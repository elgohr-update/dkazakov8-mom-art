/* eslint-disable no-param-reassign, init-declarations, no-bitwise, max-depth, no-continue,
   no-useless-escape */

/**
 * Modifications:
 * - added catcher for errors in functional components
 *
 */

const EMPTY_OBJ = {};
const ERROR_MSG =
  'a runtime error occured! Use Inferno in development environment to find the error.';
function isStringOrNumber(o) {
  const type = typeof o;
  return type === 'string' || type === 'number';
}
function isNullOrUndef(o) {
  return o === void 0 || o === null;
}
function isInvalid(o) {
  return o === null || o === false || o === true || o === void 0;
}
function isFunction(o) {
  return typeof o === 'function';
}
function isString(o) {
  return typeof o === 'string';
}
function isNumber(o) {
  return typeof o === 'number';
}
function isNull(o) {
  return o === null;
}
function throwError(message?: string) {
  if (!message) {
    message = ERROR_MSG;
  }
  throw new Error(`Inferno Error: ${message}`);
}
function combineFrom(first, second) {
  const out = {};
  if (first) {
    for (const key in first) {
      out[key] = first[key];
    }
  }
  if (second) {
    for (const key$1 in second) {
      out[key$1] = second[key$1];
    }
  }
  return out;
}

function renderStylesToString(styles) {
  if (isString(styles)) {
    return styles;
  } else {
    let renderedString = '';
    for (const styleName in styles) {
      const value = styles[styleName];
      if (isStringOrNumber(value)) {
        renderedString += `${styleName}:${value};`;
      }
    }
    return renderedString;
  }
}

const rxUnescaped = new RegExp(/["'&<>]/);
function escapeText(text) {
  /* Much faster when there is no unescaped characters */
  if (!rxUnescaped.test(text)) {
    return text;
  }
  let result = '';
  let escape = '';
  let start = 0;
  let i;
  for (i = 0; i < text.length; ++i) {
    switch (text.charCodeAt(i)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 39: // '
        escape = '&#039;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }
    if (i > start) {
      result += text.slice(start, i);
    }
    result += escape;
    start = i + 1;
  }
  return result + text.slice(start, i);
}
const ATTRIBUTE_NAME_START_CHAR =
  ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const ATTRIBUTE_NAME_CHAR = `${ATTRIBUTE_NAME_START_CHAR}\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
const VALID_ATTRIBUTE_NAME_REGEX = new RegExp(
  `^[${ATTRIBUTE_NAME_START_CHAR}][${ATTRIBUTE_NAME_CHAR}]*$`
);
const illegalAttributeNameCache = {};
const validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (validatedAttributeNameCache[attributeName] !== void 0) {
    return true;
  }
  if (illegalAttributeNameCache[attributeName] !== void 0) {
    return false;
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeNameCache[attributeName] = true;
  return false;
}
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
function createDerivedState(instance, nextProps, state) {
  if (instance.constructor.getDerivedStateFromProps) {
    return combineFrom(state, instance.constructor.getDerivedStateFromProps(nextProps, state));
  }
  return state;
}

function renderVNodeToString(vNode, parent, context) {
  const { flags } = vNode;
  const { type } = vNode;
  const props = vNode.props || EMPTY_OBJ;
  const { children } = vNode;
  if ((flags & 14) /* Component */ !== 0) {
    const isClass = flags & 4; /* ComponentClass */
    if (isClass) {
      const instance = new type(props, context);
      const hasNewAPI = Boolean(type.getDerivedStateFromProps);
      instance.$BS = false;
      instance.$SSR = true;
      let childContext;
      if (isFunction(instance.getChildContext)) {
        childContext = instance.getChildContext();
      }
      if (isNullOrUndef(childContext)) {
        childContext = context;
      } else {
        childContext = combineFrom(context, childContext);
      }
      if (instance.props === EMPTY_OBJ) {
        instance.props = props;
      }
      instance.context = context;
      if (!hasNewAPI && isFunction(instance.componentWillMount)) {
        instance.$BR = true;
        instance.componentWillMount();
        instance.$BR = false;
        const pending = instance.$PS;
        if (pending) {
          const { state } = instance;
          if (state === null) {
            instance.state = pending;
          } else {
            for (const key in pending) {
              state[key] = pending[key];
            }
          }
          instance.$PSS = false;
          instance.$PS = null;
        }
      }
      if (hasNewAPI) {
        instance.state = createDerivedState(instance, props, instance.state);
      }
      const renderOutput = instance.render(props, instance.state, instance.context);
      // In case render returns invalid stuff
      if (isInvalid(renderOutput)) {
        return '<!--!-->';
      }
      if (isString(renderOutput)) {
        return escapeText(renderOutput);
      }
      if (isNumber(renderOutput)) {
        return `${renderOutput}`;
      }
      return renderVNodeToString(renderOutput, vNode, childContext);
    } else {
      let renderOutput$1 = null;
      try {
        renderOutput$1 = type(props, context);
      } catch (e) {
        renderOutput$1 = `Error on render component ${type.name}: ${e.message}`;
      }

      if (isInvalid(renderOutput$1)) {
        return '<!--!-->';
      }
      if (isString(renderOutput$1)) {
        return escapeText(renderOutput$1);
      }
      if (isNumber(renderOutput$1)) {
        return `${renderOutput$1}`;
      }
      return renderVNodeToString(renderOutput$1, vNode, context);
    }
  } else if ((flags & 481) /* Element */ !== 0) {
    let renderedString = `<${type}`;
    let html;
    const isVoidElement = voidElements.has(type);
    const { className } = vNode;
    if (isString(className)) {
      renderedString += ` class="${escapeText(className)}"`;
    } else if (isNumber(className)) {
      renderedString += ` class="${className}"`;
    }
    if (!isNull(props)) {
      for (const prop in props) {
        const value = props[prop];
        switch (prop) {
          case 'dangerouslySetInnerHTML':
            html = value.__html;
            break;
          case 'style':
            if (!isNullOrUndef(props.style)) {
              renderedString += ` style="${renderStylesToString(props.style)}"`;
            }
            break;
          case 'children':
          case 'className':
            // Ignore
            break;
          case 'defaultValue':
            // Use default values if normal values are not present
            if (!props.value) {
              renderedString += ` value="${isString(value) ? escapeText(value) : value}"`;
            }
            break;
          case 'defaultChecked':
            // Use default values if normal values are not present
            if (!props.checked) {
              renderedString += ` checked="${value}"`;
            }
            break;
          default:
            if (isAttributeNameSafe(prop)) {
              if (isString(value)) {
                renderedString += ` ${prop}="${escapeText(value)}"`;
              } else if (isNumber(value)) {
                renderedString += ` ${prop}="${value}"`;
              } else if (value === true) {
                renderedString += ` ${prop}`;
              }
            }
            break;
        }
      }
      if (
        type === 'option' &&
        typeof props.value !== 'undefined' &&
        props.value === parent.props.value
      ) {
        // Parent value sets children value
        renderedString += ' selected';
      }
    }
    if (isVoidElement) {
      renderedString += '>';
    } else {
      renderedString += '>';
      const { childFlags } = vNode;
      if (childFlags === 2 /* HasVNodeChildren */) {
        renderedString += renderVNodeToString(children, vNode, context);
      } else if (childFlags & 12 /* MultipleChildren */) {
        for (let i = 0, len = children.length; i < len; ++i) {
          renderedString += renderVNodeToString(children[i], vNode, context);
        }
      } else if (childFlags === 16 /* HasTextChildren */) {
        renderedString += children === '' ? ' ' : escapeText(children);
      } else if (html) {
        renderedString += html;
      }
      if (!isVoidElement) {
        renderedString += `</${type}>`;
      }
    }
    if (String(type).match(/[\s\n\/='"\0<>]/)) {
      throw renderedString;
    }
    return renderedString;
  } else if ((flags & 16) /* Text */ !== 0) {
    return children === '' ? ' ' : escapeText(children);
  } else if ((flags & 8192) /* Fragment */ !== 0) {
    const childFlags$1 = vNode.childFlags;
    if (childFlags$1 === 2 /* HasVNodeChildren */) {
      return '<!--!-->';
    } else if (childFlags$1 & 12 /* MultipleChildren */) {
      let renderedString$1 = '';
      for (let i$1 = 0, len$1 = children.length; i$1 < len$1; ++i$1) {
        renderedString$1 += renderVNodeToString(children[i$1], vNode, context);
      }
      return renderedString$1;
    }
  } else {
    throwError();
  }
  return '';
}

export { renderVNodeToString as renderToString };
