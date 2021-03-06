const idleCallback = (() => {
  /* istanbul ignore next */
  if (typeof requestIdleCallback !== 'undefined') return fn => requestIdleCallback(fn);

  return fn => fn();
})();

export function dependentChange(dependent, oldDependent) {
  return (
    dependent == null ||
    oldDependent == null ||
    dependent.length !== oldDependent.length ||
    dependent.some((v, i) => !Object.is(v, oldDependent[i]))
  );
}

export function memoDependentChange(dependent, oldDependent) {
  return (
    dependent == null ||
    oldDependent == null ||
    dependent.some((v, i) => !Object.is(v, oldDependent[i]))
  );
}

export {
  idleCallback
};
