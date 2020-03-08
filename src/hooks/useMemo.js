import RenderContext from '../RenderContext';
import {memoDependentChange} from '../utils/functions';

function useMemo(comFunc, dependent) {
  return RenderContext.currentContext.cursors('memo', (initialized, memoIndex, memoArr) => {
    if (!initialized) {
      memoArr[memoIndex] = {
        value: comFunc(),
        dependent,
      };
    } else {
      if (memoDependentChange(memoArr[memoIndex].dependent, dependent)) {
        memoArr[memoIndex].dependent = dependent;
        memoArr[memoIndex].value = comFunc();
      }
    }

    return memoArr[memoIndex].value;
  });
}

export {
  useMemo
};
