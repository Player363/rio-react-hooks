import React from 'react';
import {render} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';

test('useRef - 基本测试1', () => {
  const result = render(({useHooks, useRef}, log) => {
    const App = useHooks(function TextInputWithFocusButton() {
      const inputEl = useRef(null);
      const onButtonClick = () => log(inputEl.current.value);
      return (
        <>
          <input ref={inputEl} type="text" value="xxxxx"/>
          <button data-testid='click' onClick={onButtonClick}>Focus the input</button>
        </>
      );
    });

    return App;
  });

  result.action((container) => {
    fireEvent.click(getByTestId(container, 'click'));
  });
  result.comparison();
});

test('useRef - 基本测试2', () => {
  const result = render(({useHooks, useState, useLayoutEffect, useRef}, log) => {
    const App = useHooks(function Form() {
      const [text, updateText] = useState('');
      const textRef = useRef();

      useLayoutEffect(() => {
        textRef.current = text; // 将 text 写入到 ref
      });
      log(textRef.current);

      return (
        <>
          <input data-testid="input" value={text} onChange={e => updateText(e.target.value)}/>
        </>
      );
    });

    return App;
  });

  result.comparison();
  result.action((container) => {
    fireEvent.change(getByTestId(container, 'input'), {target: {value: '1'}});
    fireEvent.change(getByTestId(container, 'input'), {target: {value: '11'}});
    fireEvent.change(getByTestId(container, 'input'), {target: {value: '111'}});
    fireEvent.change(getByTestId(container, 'input'), {target: {value: '1111'}});
  });
  result.comparison();
});
