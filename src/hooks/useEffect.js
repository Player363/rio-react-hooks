import {dependentChange, idleCallback} from '../utils/functions';
import {DidUnmount} from '../Const';
import RenderContext from '../RenderContext';

function _useEffect(isLayoutEffect, func, dependent) {
  return RenderContext.currentContext.cursors('effect', (initialized, effectIndex, effectArr) => {
    if (!initialized) {
      let effectFunc = func;
      let destroyFunc = null;
      effectArr[effectIndex] = {
        isLayoutEffect,
        effectFunc,
        dependent,
        destroyFunc,
        oldDependent: null
      };
    } else {
      effectArr[effectIndex].effectFunc = func;

      const _dependent = effectArr[effectIndex].dependent;
      if (dependent && _dependent && dependent.length !== _dependent.length) {
        console.warn(`前一次与后一次传递的依赖不一致！\n\n之前：${JSON.stringify(_dependent)}\n现在：${JSON.stringify(dependent)}`);
        effectArr[effectIndex].oldDependent = effectArr[effectIndex].dependent;
      } else {
        effectArr[effectIndex].oldDependent = effectArr[effectIndex].dependent;
        effectArr[effectIndex].dependent = dependent;
      }
    }
  });
}

function useEffect(func, dependent) {
  _useEffect(false, func, dependent);
}

function useLayoutEffect(func, dependent) {
  _useEffect(true, func, dependent);
}

function runEffect(lifeCycle) {
  const currentComponent = this;

  if (currentComponent.registeredCursor['effect']) {
    currentComponent.registeredCursor['effect'].arr.forEach(item => {
      const fn = () => {
        if (lifeCycle === DidUnmount) {
          return item.destroyFunc && item.destroyFunc();
        }

        if (dependentChange(item.dependent, item.oldDependent)) {
          item.destroyFunc && item.destroyFunc();
          const destroyFunc = item.effectFunc();
          item.destroyFunc = destroyFunc;
        }
      };

      if (item.isLayoutEffect) {
        fn();
      } else {
        idleCallback(fn);
      }
    });
  }
}

export {
  useEffect,
  useLayoutEffect,
  runEffect,
};
