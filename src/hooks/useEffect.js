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
  const allEffect = currentComponent.registeredCursor['effect']?.arr;

  if (!allEffect) return;

  const layoutEffectArr = [];
  const effectArr = [];
  allEffect.forEach(v => v.isLayoutEffect ? layoutEffectArr.push(v) : effectArr.push(v));

  if (lifeCycle === DidUnmount) {
    allEffect.forEach(item => item.destroyFunc && item.destroyFunc());
  } else {
    layoutEffectArr.forEach(item => dependentChange(item.dependent, item.oldDependent) && item.destroyFunc && item.destroyFunc());
    layoutEffectArr.forEach(item => dependentChange(item.dependent, item.oldDependent) && (item.destroyFunc = item.effectFunc()));
    idleCallback(() => {
      effectArr.forEach(item => dependentChange(item.dependent, item.oldDependent) && item.destroyFunc && item.destroyFunc());
      effectArr.forEach(item => dependentChange(item.dependent, item.oldDependent) && (item.destroyFunc = item.effectFunc()));
    });
  }
}

export {
  useEffect,
  useLayoutEffect,
  runEffect,
};
