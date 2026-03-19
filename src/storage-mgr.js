function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function store(list) {
  const data = [];
  list.forEach(item => {
    if (typeof item === "string") {
      data.push(item);
    } else data.push(item.toJSON);
  });
  return JSON.stringify(data);
}