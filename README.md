# rio-react-hooks

模拟实现React Hooks API。

已经实现的功能
- useState
- useEffect
- useLayoutEffect
- useContext
- useReducer
- useRef
- useMemo
- useCallback
- useImperativeHandle

### 使用示例

```
npm i rio-react-hooks
```

useState示例
```javascript
import React from 'react';
import {useHooks, useState} from 'rio-react-hooks'

const Counter = useHooks(() => {
  const [count, setCount] = useState(0);
  return <div>
    count: <span>{count}</span>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <button onClick={() => setCount(preCount => preCount - 1)}>-1</button>
  </div>;
});
const App = useHooks(() => {
  const [isShow, onSwitch] = useState(true);
  return (
    <div className="App">
      {
        isShow &&
        <Counter init={0}/>
      }
      <button onClick={() => onSwitch(!isShow)}>switch</button>
    </div>
  );
});
```

useImperativeHandle/useRef示例
```javascript
import React, {forwardRef} from 'react';
import {useHooks, useRef, useImperativeHandle} from 'rio-react-hooks';

const FancyInput = forwardRef(useHooks(function (props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef}/>;
}));

const App = useHooks(function Form() {
  const ref = useRef();
  return (
    <>
      <FancyInput ref={ref}/>
      <button onClick={() => ref.current.focus()}>focus</button>
    </>
  );
});
```

---

### 学习/参考资料

> [React Hooks 分享](https://github.com/OverWatcherX/ReactHooksPractice) - bramblex

> [Typescript 实现](https://github.com/bramblex/react-hooks) - bramblex

> [hooks 文档](https://react.docschina.org/docs/hooks-reference.html)
