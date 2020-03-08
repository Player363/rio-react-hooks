import RenderContext from '../RenderContext';

function useReducer(reducerFunc, initialState, initFunc) {
  return RenderContext.currentContext.cursors('reducer', (initialized, reducerIndex, reducerArr, currentComponent) => {
    if (!initialized) {
      if (initFunc !== undefined) initialState = initFunc(initialState);

      reducerArr[reducerIndex] = {
        lastRenderedReducer: reducerFunc,
        prevRenderedState: initialState,
        lastRenderedState: initialState,
        dispatch(action) {
          const {lastRenderedState, lastRenderedReducer} = reducerArr[reducerIndex];

          const nextState = lastRenderedReducer(lastRenderedState, action);

          // 跳过更新，所有当前state跟上次一样 ==>
          let skipRenderFlag = reducerArr
            .filter(({lastRenderedState, prevRenderedState}, i) => {
              let flat = Object.is(lastRenderedState, prevRenderedState);
              if (i !== reducerIndex) reducerArr[i].prevRenderedState = lastRenderedState;
              return flat;
            })
            .length === reducerArr.length;
          // ==> 并且当前的state跟本次更新后一样
          skipRenderFlag = skipRenderFlag && Object.is(nextState, lastRenderedState);

          if (skipRenderFlag) return;

          reducerArr[reducerIndex].prevRenderedState = lastRenderedState;
          reducerArr[reducerIndex].lastRenderedState = nextState;
          currentComponent.forceUpdate();
        }
      };
    } else {
      reducerArr[reducerIndex].lastRenderedReducer = reducerFunc;
    }

    return [reducerArr[reducerIndex].lastRenderedState, reducerArr[reducerIndex].dispatch];
  });
}

export {
  useReducer
};
