import {render} from '../__test__/testUtils';
import React from 'react';
import {fireEvent, getByTestId} from '@testing-library/react';

test('综合测试 - useEffect & useLayoutEffect', () => {
  const result = render(({useHooks, useState, useLayoutEffect, useEffect}, log, mode) => {
    const Counter = useHooks(() => {
      const [countA, setCountA] = useState(0);
      const [countB, setCountB] = useState(10);

      log('render', countA, countB);

      useEffect(() => {
        log('执行effectA', countA, countB);
        return () => {
          log('注销effectA', countA, countB);
        };
      }, [countA]);
      useLayoutEffect(() => {
        log('执行effectAB', countA, countB);
        return () => {
          log('注销effectAB', countA, countB);
        };
      }, [countA, countB]);
      useEffect(() => {
        log('执行effectB', countA, countB);
        return () => {
          log('注销effectB', countA, countB);
        };
      }, [countB]);
      useLayoutEffect(() => {
        log('执行effectA2', countA, countB);
        return () => {
          log('注销effectA2', countA, countB);
        };
      }, [countA]);

      return <div>
        当前值: <span id="count">{countA} - {countB}</span><br/>
        <button data-testid="A+1" onClick={() => setCountA(countA + 1)}>A+1</button>
        <button data-testid="B+1" onClick={() => setCountB(countB + 1)}>B+1</button>
        <button data-testid="=0" onClick={() => setCountB(0) + setCountA(0)}>=0</button>
      </div>;
    });

    const App = useHooks(() => {
      const [isShow, switchShow] = useState(true);
      return <div>
        {isShow && <Counter/>}
        <button data-testid="switch" onClick={() => switchShow(v => !v)}>switch</button>
      </div>;
    });

    return App;
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, '=0'));
    fireEvent.click(getByTestId(container, 'B+1'));
    fireEvent.click(getByTestId(container, 'A+1'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'B+1'));
    fireEvent.click(getByTestId(container, 'switch'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'switch'));
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'B+1'));
  });
  result.comparison();
});
