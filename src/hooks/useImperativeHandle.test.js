import React, {forwardRef} from 'react';
import {render} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';

test('useImperativeHandle - useRef', () => {
  const result = render(({useHooks, useState, useRef, useImperativeHandle}, log, mode) => {
    const FancyInput = forwardRef(useHooks(function (props, ref) {
      const [count, setCount] = useState(1);
      const [show, setShow] = useState(true);
      useImperativeHandle(ref, () => ({
        aaaaa: () => {}
      }));
      log(ref.current && Object.keys(ref.current));
      return <div>
        {count}
        <button data-testid="show" onClick={() => setShow(!show)}>show</button>
        <button data-testid="1" onClick={() => setCount(count + 1)}>+1</button>
        {show &&  <FancyInput2 ref={ref}/>}
      </div>;
    }));
    const FancyInput2 = forwardRef(useHooks(function (props, ref) {
      const [count, setCount] = useState(1);
      useImperativeHandle(ref, () => ({
        xxxxx: () => {}
      }));
      log(ref.current && Object.keys(ref.current));
      return <div>
        {count}
        <button data-testid="2" onClick={() => setCount(count + 1)}>+1</button>
      </div>;
    }));

    const App = useHooks(function Form() {
      const ref = useRef();
      const [show, setShow] = useState(true);

      return (
        <>
          <button data-testid="father-show" onClick={() => setShow(!show)}>show</button>
          <button data-testid="click" onClick={() => { log(ref.current && Object.keys(ref.current)); }}>click</button>
          {show && <FancyInput ref={ref}/>}
        </>
      );
    });

    return App;
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'click'));
    fireEvent.click(getByTestId(container, '1'));
    fireEvent.click(getByTestId(container, 'click'));
    fireEvent.click(getByTestId(container, '2'));
    fireEvent.click(getByTestId(container, 'click'));
    fireEvent.click(getByTestId(container, 'show'));
    fireEvent.click(getByTestId(container, 'click'));
    fireEvent.click(getByTestId(container, 'show'));
    fireEvent.click(getByTestId(container, 'click'));
    fireEvent.click(getByTestId(container, 'father-show'));
    fireEvent.click(getByTestId(container, 'click'));
    fireEvent.click(getByTestId(container, 'father-show'));
    fireEvent.click(getByTestId(container, 'click'));
  });
  result.comparison();
});

test('useImperativeHandle - function ref', () => {
  const result = render(({useHooks, useState, useRef, useImperativeHandle}, log, mode) => {
    const FancyInput = forwardRef(useHooks(function (props, ref) {
      const [count, setCount] = useState(1);
      useImperativeHandle(ref, () => 'aaaa', [count]);
      return <div>
        {count}
        <button data-testid="1" onClick={() => setCount(count + 1)}>+1</button>
      </div>;
    }));

    const App = useHooks(function Form() {
      const [show, setShow] = useState(true);

      return (
        <>
          <button data-testid="show" onClick={() => setShow(!show)}>show</button>
          {show && <FancyInput ref={v => log(v)}/>}
        </>
      );
    });
    return App;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'show'));
    fireEvent.click(getByTestId(container, 'show'));
    fireEvent.click(getByTestId(container, '1'));
    fireEvent.click(getByTestId(container, 'show'));
  });
  result.comparison();
});

