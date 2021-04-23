export const debounce = (fn, delay) => {
  let timeout;

  return () => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn();
    }, delay);
  };
};
