import RenderContext from '../RenderContext';

function useContext(contextObj) {
  return RenderContext.currentContext.cursors('context', (initialized, contextIndex, contextArr) => {
    if (!initialized) {
      contextArr[contextIndex] = {contextObj};
    }

    return contextArr[contextIndex].contextObj._currentValue;
  });
}

export {
  useContext
};
