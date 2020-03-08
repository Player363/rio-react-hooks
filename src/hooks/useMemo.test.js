import React, {Fragment} from 'react';
import {render} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';

test('useMemo - 测试1', () => {
  const result = render(({useHooks, useState, useMemo}, log) => {
    const App = useHooks(function () {
      const [a, setA] = useState(1);
      const [b, setB] = useState(1);
      const resultB = () => {
        log(a, b);
        return b + 'AAAAAAA';
      };
      const valueB = useMemo(resultB, a >= 3 ? undefined : [b]);
      log(a, valueB);
      return (
        <>
          <button data-testid="a+1" onClick={() => setA(a + 1)}>a+1</button>
          <button data-testid="b+1" onClick={() => setB(b + 1)}>b+1</button>
          <p>
            {a} - {valueB}
          </p>
        </>
      );
    });
    return App;
  });

  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'a+1'));
    fireEvent.click(getByTestId(container, 'b+1'));
    fireEvent.click(getByTestId(container, 'a+1'));
    fireEvent.click(getByTestId(container, 'b+1'));
  });
  result.comparison();
});

test('useMemo - 测试2', () => {
  const result = render(({useHooks, useState, useMemo}, log) => {
    const App = useHooks(function () {
      const [a, setA] = useState(0);
      const [b, setB] = useState(2);

      const resultB = () => {
        log(a, b);
        return b + 'AAAAAAA';
      };
      const valueB = useMemo(resultB, a >= 3 ? [b, b] : [b]);
      log(a, valueB);

      return (
        <>
          <button data-testid="a+1" onClick={() => setA(a + 1)}>a+1</button>
          <button data-testid="b+1" onClick={() => setB(b + 1)}>b+1</button>
          <p>
            {a} - {valueB}
          </p>
        </>
      );
    });
    return App;
  });

  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'a+1'));
    fireEvent.click(getByTestId(container, 'a+1'));
    fireEvent.click(getByTestId(container, 'b+1'));
    fireEvent.click(getByTestId(container, 'b+1'));
  });
  result.comparison();
});
