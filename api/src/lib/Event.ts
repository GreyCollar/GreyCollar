// This will move to node-event-test-package
import { v4 as uuid } from "uuid";

const subscriptions = {};
const messages = new Map();

const colors = [
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray",
];

function typeColor(type) {
  const hash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const colorIndex = hash(type) % colors.length;
  return colors[colorIndex];
}

const subscribe = (...args) => {
  if (args.length < 2) {
    throw new Error("subscribe requires at least 2 arguments");
  }

  const callback = args.pop();
  const type = args.join(".");
  const id = uuid();

  console.debug("node-event", "subscribe", type, id);

  if (type === "__proto__" || type === "constructor" || type === "prototype") {
    throw new Error("Invalid subscription type");
  }
  if (!subscriptions[type]) {
    subscriptions[type] = {};
  }

  const registry = {
    id,
    type,
    callback,
    unsubscribe: () => {
      console.debug("node-event", "unsubscribe", type, id);
      delete subscriptions[type][id];

      if (Object.keys(subscriptions[type]).length === 0) {
        delete subscriptions[type];
      }
    },
  };

  subscriptions[type][id] = registry;

  return registry;
};

const publish = (...args) => {
  if (args.length < 2) {
    throw new Error("publish requires at least 2 arguments");
  }

  const payload = args.pop();
  const type = args.join(".");

  console.log("node-event", "publish", type, payload);
  messages.set(type, payload);

  if (type === "__proto__" || type === "constructor" || type === "prototype") {
    throw new Error("Invalid publish type");
  }
  Object.keys(subscriptions[type] || {}).forEach((key) => {
    const registry = subscriptions[type][key];

    setTimeout(() => {
      try {
        registry.callback(payload, registry);
      } catch (err) {
        console.error("node-event", "error", type, err);
      }
    }, 0);
  });
};

function last(type, init) {
  if (messages.has(type)) {
    return messages.get(type);
  } else {
    return init;
  }
}

export { subscribe, publish, messages, last };
