import React from 'react';
import RenderContext from '../RenderContext';

function useRef(initialValue) {
  return RenderContext.currentContext.cursors('ref', (initialized, refIndex, refArr) => {
    if (!initialized) {
      const ref = React.createRef();
      ref.current = initialValue;
      refArr[refIndex] = {ref};
    }

    return refArr[refIndex].ref;
  });
}

export {
  useRef
};
