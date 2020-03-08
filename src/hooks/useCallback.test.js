import {render} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';
import React from 'react';

test('useCallback - 基本测试', () => {
  const setNative = new Set();
  const setMy = new Set();
  const result = render(({useHooks, useState, useLayoutEffect, useCallback}, log, mode) => {
    const App = useHooks(function Form() {
      const [a, setA] = useState(0);
      const [b, setB] = useState(0);

      const callback = useCallback(() => {}, [a]);
      mode === 'myHooks' ? setMy.add(callback) : setNative.add(callback);
      mode === 'myHooks' ? log(setMy.size) : log(setNative.size);

      return (
        <>
          {a} {b}
          <button data-testid="a+1" onClick={() => setA(pre => pre + 1)}>a+1</button>
          <button data-testid="b+1" onClick={() => setB(pre => pre + 1)}>b+1</button>
        </>
      );
    });

    return App;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'a+1'));
    fireEvent.click(getByTestId(container, 'b+1'));
    fireEvent.click(getByTestId(container, 'b+1'));
    fireEvent.click(getByTestId(container, 'a+1'));
  });
  result.comparison();
});
