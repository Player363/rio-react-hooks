import React from 'react';
import {render} from '../__test__/testUtils';
import {fireEvent, getByTestId} from '@testing-library/react';

test('useEffect - 基本测试', (done) => {
  const result = render(({useHooks, useState, useEffect}, log, mode) => {
    const Counter = useHooks(() => {
      const [count, setCount] = useState(0);
      const [count2, setCount2] = useState(10);
      log('render', count, count2);
      useEffect((...args) => {
        log('执行effect函数', args, count, count2);
        return () => {
          log('注销effect函数', args, count, count2);
        };
      });
      return <div>
        当前值: <span id="count">{count} - {count2}</span><br/>
        <button data-testid="+1" onClick={() => {
          setCount(count + 1);
          setCount2(count2 + 10);
        }}>+1
        </button>
      </div>;
    });
    return Counter;
  });
  result.action((container) => {
    for (let i = 0; i < 5; i++) {
      fireEvent.click(getByTestId(container, '+1'));
    }
  });
  setTimeout(() => {
    result.comparison();
    done();
  }, 0);
});

test('useEffect - 清理注销', async (done) => {
  const result = render(({useHooks, useState, useEffect}, log, mode) => {
    const Counter = useHooks(() => {
      const [count, setCount] = useState(0);
      log('render', count);
      useEffect((...args) => {
        log('执行effect函数', args, count);
        return () => {
          log('注销effect函数', args, count);
        };
      });
      return <div>
        当前值: <span id="count">{count}</span><br/>
        <button data-testid="+1" onClick={() => setCount(count + 1)}>+1
        </button>
      </div>;
    });

    const App = useHooks(() => {
      const [isShow, switchShow] = useState(true);

      return <div>
        counter: <br/>
        {isShow && <Counter/>}
        <button data-testid="switch" onClick={() => switchShow(v => !v)}>switch</button>
      </div>;
    });

    return App;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, 'switch'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'switch'));
    fireEvent.click(getByTestId(container, '+1'));
    fireEvent.click(getByTestId(container, '+1'));
  });
  result.comparison();
  done();
});

test('useEffect - 依赖跳过触发', async (done) => {
  const result = render(({useHooks, useState, useEffect}, log, mode) => {
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
      useEffect(() => {
        log('执行effectB', countA, countB);
        return () => {
          log('注销effectB', countA, countB);
        };
      }, [countB]);

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

  result.action((container) => {
    fireEvent.click(getByTestId(container, '=0'));
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'B+1'));
    fireEvent.click(getByTestId(container, '=0'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'B+1'));
    fireEvent.click(getByTestId(container, 'B+1'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'B+1'));
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'switch'));
    fireEvent.click(getByTestId(container, 'switch'));
  });
  result.comparison();
  done();
});

test('useEffect - 调用顺序发生变化', () => {
  const result = render(({useHooks, useState, useEffect}, log, mode) => {
    const Counter = useHooks(() => {
      const [countA, setCountA] = useState(0);
      const [countB, setCountB] = useState(10);

      useEffect(() => {
        log('执行effectA', countA, countB);
      }, [countA]);
      if (countA < 2) {
        useEffect(() => {
          log('执行effectB', countA, countB);
        }, [countB]);
      }

      return <div>
        当前值: <span id="count">{countA} - {countB}</span><br/>
        <button data-testid="A+1" onClick={() => setCountA(countA + 1)}>A+1</button>
        <button data-testid="B+1" onClick={() => setCountB(countB + 1)}>B+1</button>
      </div>;
    });

    class App extends React.Component {
      state = {
        show: true
      };

      componentDidCatch(error, errorInfo) {
        this.setState({show: false});
      }

      render() {
        return <div>
          {this.state.show && <Counter/>}
          <button data-testid='show' onClick={() => this.setState({show: true})}>switch</button>
        </div>;
      }
    }

    return App;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'B+1'));
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'A+1'));
  });
  result.comparison();
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'show'));
    fireEvent.click(getByTestId(container, 'A+1'));
    fireEvent.click(getByTestId(container, 'B+1'));
  });
  result.comparison();
});

test('useEffect - 依赖个数变化', () => {
  const result = render(({useHooks, useState, useEffect}, log, mode) => {
    const App = useHooks(() => {
      const [count, setCount] = useState(0);
      log('render', count);
      useEffect((...args) => {
        log('执行effect函数', args, count);
      }, count >= 2 ? [3, 3] : [count]);
      return <div>
        当前值: <span id="count">{count}</span><br/>
        <button data-testid="C+1" onClick={() => setCount(count + 1)}>+1
        </button>
      </div>;
    });

    return App;
  });
  result.action((container) => {
    fireEvent.click(getByTestId(container, 'C+1'));
    fireEvent.click(getByTestId(container, 'C+1'));
    fireEvent.click(getByTestId(container, 'C+1'));
    fireEvent.click(getByTestId(container, 'C+1'));
  });
  result.comparison();
});
