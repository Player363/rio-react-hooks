import React from 'react';
import {render, sleep} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';

test('useReducer - 基本渲染 + 跳过dispatch更新', async () => {
  const result = render(({useHooks, useReducer}, log) => {
    function reducer(state, action) {
      log('reducer', state, action);
      switch (action) {
        case 'increment':
          return state + 1;
        case 'decrement':
          return state - 1;
        case 'reset':
          return 0;
        default:
          return state;
      }
    }

    const Counter = useHooks(function () {
      const [state, dispatch] = useReducer(reducer, 1);
      const [state2, dispatch2] = useReducer(reducer, 2);
      const [state3, dispatch3] = useReducer(reducer, 3);
      log('render：', state, state2, state3);
      return (
        <>
          Count: {state}
          <button data-testid="count1-1" onClick={() => dispatch('decrement')}>-</button>
          <button data-testid="count1+1" onClick={() => dispatch('increment')}>+</button>
          <button data-testid="count1=0" onClick={() => dispatch('reset')}>0</button>
          <br/>
          Count: {state2}
          <button data-testid="count2-1" onClick={() => dispatch2('decrement')}>-</button>
          <button data-testid="count2+1" onClick={() => dispatch2('increment')}>+</button>
          <button data-testid="count2=0" onClick={() => dispatch2('reset')}>0</button>
          <br/>
          Count: {state3}
          <button data-testid="count3-1" onClick={() => dispatch3('decrement')}>-</button>
          <button data-testid="count3+1" onClick={() => dispatch3('increment')+dispatch2('increment')}>+</button>
          <button data-testid="count3=0" onClick={() => dispatch3('reset')}>0</button>
        </>
      );
    });

    return Counter;
  });

  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'count1+1'));
    fireEvent.click(getByTestId(container, 'count2+1'));
    fireEvent.click(getByTestId(container, 'count3+1'));
    fireEvent.click(getByTestId(container, 'count2-1'));
    fireEvent.click(getByTestId(container, 'count2-1'));
  });
  result.comparison();
  // 跳过更新测试
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count2=0'));
    fireEvent.click(getByTestId(container, 'count3=0'));
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count2=0'));
    fireEvent.click(getByTestId(container, 'count3=0'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'count1+1'));
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count1=0'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'count2+1'));
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count1=0'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'count2-1'));
    fireEvent.click(getByTestId(container, 'count2=0'));
    fireEvent.click(getByTestId(container, 'count2=0'));
    fireEvent.click(getByTestId(container, 'count2=0'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count2=0'));
    fireEvent.click(getByTestId(container, 'count3=0'));
    fireEvent.click(getByTestId(container, 'count3+1'));
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count2-1'));
    fireEvent.click(getByTestId(container, 'count1=0'));
    fireEvent.click(getByTestId(container, 'count1=0'));
  });
});
