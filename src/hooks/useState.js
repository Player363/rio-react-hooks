import RenderContext from '../RenderContext';

/**
 * @returns {[any, function]}
 */
function useState(initialValue) {
  return RenderContext.currentContext.cursors('state', (isInit, stateIndex, stateArr, currentComponent) => {
    if (!isInit) {
      // 初始化，可以传入函数
      let value = typeof initialValue === 'function' ? initialValue() : initialValue;
      let setValue = nextValue => {
        const {value: currentValue, prevValue} = stateArr[stateIndex];

        nextValue = typeof nextValue === 'function'
          ? nextValue(currentValue)
          : nextValue;

        // 如果nextValue跟当前的value值一样，并且当前value跟上一次value一样 => 跳过更新
        if (Object.is(nextValue, currentValue) && Object.is(prevValue, currentValue)) return;

        stateArr[stateIndex].prevValue = currentValue;
        stateArr[stateIndex].value = nextValue;
        currentComponent.forceUpdate();
      };
      stateArr[stateIndex] = {value, setValue, prevValue: value};
    }

    return [stateArr[stateIndex].value, stateArr[stateIndex].setValue];
  });
}

export {
  useState
};
