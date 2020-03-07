import React, {Fragment} from 'react';
import {render} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';

test('useState - 综合行为测试', () => {
  const result = render(({useHooks, useState}) => {
    const Counter = useHooks(({init, name}) => {
      const [count, setCount] = useState(init || 0);
      return <div>
        count: <span data-testid={name + 'Number'}>{count}</span>
        <button
          data-testid={name + 'SetCount'}
          onClick={() => {
            setCount(count + 1);
            setCount(count + 1);
          }}
        >+1
        </button>
        <button data-testid={name + 'SetCountFunc'} onClick={() => setCount(preCount => preCount - 1)}>-1</button>
      </div>;
    });
    const App = useHooks(() => {
      const [isShow, onSwitch] = useState(true);
      return (
        <div className="App">
          {
            isShow &&
            <Fragment>
              <Counter name="counter1" init={0}/>
              <Counter name="counter2" init={() => 100}/>
            </Fragment>
          }
          <button data-testid="switch" onClick={() => onSwitch(!isShow)}>switch</button>
        </div>
      );
    });
    return App;
  });

  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'counter1SetCount'));
    fireEvent.click(getByTestId(container, 'counter2SetCount'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'counter1SetCount'));
    fireEvent.click(getByTestId(container, 'counter2SetCount'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'counter1SetCountFunc'));
    fireEvent.click(getByTestId(container, 'counter2SetCountFunc'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'switch'));
  });
  result.comparison();
});

test('useState - 跳过state更新：https://react.docschina.org/docs/hooks-reference.html#bailing-out-of-a-state-update', (done) => {
  const result = render(({useHooks, useState}, log, mode) => {
    const Counter = useHooks(() => {
      const [count, setCount] = useState(0);
      if (mode === 'myHooks') log(1); else log(1);
      return <div>
        当前值: <span>{count}</span><br/>
        <button data-testid="+1" onClick={() => setCount(count + 1)}>+1</button>
        <button data-testid="-1" onClick={() => setCount(preCount => preCount - 1)}>-1</button>
        <button data-testid="=0" onClick={() => setCount(0)}>reset</button>
      </div>;
    });
    return Counter;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '-1'));
    fireEvent.click(getByTestId(container, '=0'));
    fireEvent.click(getByTestId(container, '=0'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '-1'));
    fireEvent.click(getByTestId(container, '=0'));
    fireEvent.click(getByTestId(container, '=0'));
    fireEvent.click(getByTestId(container, '=0'));
    fireEvent.click(getByTestId(container, '-1'));
    fireEvent.click(getByTestId(container, '=0'));
  });
  setTimeout(() => {
    result.comparison();
    done();
  }, 0);
});

test('useState - 调用顺序发生变化1', () => {
  const result = render(({useHooks, useState}, log, mode) => {
    const Counter = useHooks(() => {
      const [count, setCount] = useState(0);
      if (count > 2) {
        try {
          const [count2, setCount2] = useState(0);
        } catch (e) {
          log('error');
        }
      }
      return <button data-testid='+1' onClick={() => setCount(count + 1)}>+1</button>;
    });
    return Counter;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
  });
  result.comparison();
});

test('useState - 调用顺序发生变化2', () => {
  const result = render(({useHooks, useState}, log, mode) => {
    const Counter = useHooks(() => {
      const [count, setCount] = useState(0);
      if (count < 3) {
        const [count2, setCount2] = useState(0);
      }
      return <button data-testid='+1' onClick={() => setCount(count + 1)}>+1</button>;
    });
    
    class App extends React.Component {
      componentDidCatch(error, errorInfo) {
        log('eee');
      }

      render() {
        return <Counter/>
      }
    }
    return App;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
  });
  result.comparison();
});
