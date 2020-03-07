import React from 'react';
import {render} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';

test('useContext - 基本渲染', () => {
  const result = render(({useHooks, useContext}, log) => {
    const themes = {
      red: {background: 'red'},
      green: {background: 'green'},
      dark: {background: '#222222'}
    };

    const ThemeContext = React.createContext(themes.red);

    const App = useHooks(function () {
      const theme = useContext(ThemeContext);
      log(theme);

      return (
        <div>
          <ThemeContext.Consumer>
            {(theme) => (
              <button style={{background: theme.background}}>
                I am styled by theme context!
              </button>
            )}
          </ThemeContext.Consumer>
          <button style={{background: theme.background}}>
            I am styled by theme context!
          </button>
          <ThemeContext.Provider value={themes.dark}>
            <Toolbar/>
          </ThemeContext.Provider>
        </div>
      );
    });

    const Toolbar = useHooks(function () {
      const theme = useContext(ThemeContext);
      log(theme);

      return (
        <div>
          <ThemeContext.Consumer>
            {(theme) => (
              <button style={{background: theme.background}}>
                I am styled by theme context!
              </button>
            )}
          </ThemeContext.Consumer>
          <button style={{background: theme.background}}>
            I am styled by theme context!
          </button>
          <ThemeContext.Provider value={themes.green}>
            <ThemedButton/>
          </ThemeContext.Provider>
        </div>
      );
    });

    const ThemedButton = useHooks(function () {
      const theme = useContext(ThemeContext);
      log(theme);

      return (
        <div>
          <ThemeContext.Consumer>
            {(theme) => (
              <button style={{background: theme.background}}>
                I am styled by theme context!
              </button>
            )}
          </ThemeContext.Consumer>
          <button style={{background: theme.background}}>
            I am styled by theme context!
          </button>
        </div>
      );
    });

    return App;
  });

  result.comparison();
});

test('useContext - 嵌套渲染设置', () => {
  const result = render(({useHooks, useState, useContext}, log) => {
    const themes = {
      red: {background: 'red'},
      green: {background: 'green'},
      dark: {background: '#222222'}
    };

    const ThemeContext = React.createContext(themes.red);
    
    const App = useHooks(function ({deep = 1}) {
      const [isChecked, setChecked] = useState(false);
      const [nextColor, setNextColor] = useState('red');
      const theme = useContext(ThemeContext);

      log(isChecked, nextColor);

      return (
        <div>
          <ul>
            <li>
              <ThemeContext.Consumer>
                {(theme) => (
                  <button style={{background: theme.background}}>
                    I am styled by theme context!
                  </button>
                )}
              </ThemeContext.Consumer>
              <button style={{background: theme.background}}>
                I am styled by theme context!
              </button>
            </li>
            <li>
              显示下一层：
              <input
                data-testid={'showNext' + deep}
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            </li>
            {
              isChecked &&
              <li>下一层的颜色：
                <input checked={nextColor === 'red'} onChange={() => setNextColor('red')} type='radio' name={deep + 'radio'}
                       data-testid={deep + 'red'}/>red
                <input checked={nextColor === 'dark'} onChange={() => setNextColor('dark')} type='radio' name={deep + 'radio'}
                       data-testid={deep + 'dark'}/>dark
                <input checked={nextColor === 'green'} onChange={() => setNextColor('green')} type='radio' name={deep + 'radio'}
                       data-testid={deep + 'green'}/>green
              </li>
            }
            {
              isChecked &&
              <li>
                <ThemeContext.Provider value={themes[nextColor]}>
                  <App deep={deep + 1}/>
                </ThemeContext.Provider>
              </li>
            }
          </ul>
        </div>
      );
    });

    return App;
  });

  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'showNext1'));
    fireEvent.click(getByTestId(container, 'showNext2'));
    fireEvent.click(getByTestId(container, 'showNext3'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, '1dark'));
    fireEvent.click(getByTestId(container, '2green'));
    fireEvent.click(getByTestId(container, '3dark'));
    fireEvent.click(getByTestId(container, '3red'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'showNext1'));
    fireEvent.click(getByTestId(container, 'showNext1'));
    fireEvent.click(getByTestId(container, 'showNext2'));
  });
  result.comparison();
});
