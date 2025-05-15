export const getItem = (key) => {
  let value = window.localStorage.getItem(key);
  if (!value) return null;
  try {
    return typeof value === "object"? JSON.parse(value):value;
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(key, value);
};

export const removeItem = (key) => {
  window.localStorage.removeItem(key);
};
