import React from 'react';
import RenderContext from './RenderContext';
import {orderError} from './utils/error';
import {runEffect} from './hooks/useEffect';
import {DidMount, DidUnmount, DidUpdate} from './Const';

class HooksClass extends React.Component {
  state = {
    error: false
  };
  renderFunction = () => { };
  firstRender = true;
  registeredCursor = {};

  componentDidMount() {
    runEffect.call(this, DidMount);
  }

  componentDidUpdate() {
    runEffect.call(this, DidUpdate);
  }

  componentWillUnmount() {
    runEffect.call(this, DidUnmount);
  }

  componentDidCatch() {
    this.setState({error: true});
  }

  /* --------------∽-★-∽--- 我是华丽的分割线 ---∽-★-∽-------------- */
  cursors(key, cb) {
    if (!this.registeredCursor[key]) this.registeredCursor[key] = {index: 0, arr: []};

    const {firstRender} = this;
    const {arr, index} = this.registeredCursor[key];

    // 非首次渲染，下标溢出
    if (!firstRender && index >= arr.length) {
      orderError();
    }

    // 是否已经初始化
    const isInit = arr.length > index;
    const result = cb(isInit, index, arr, this);
    this.registeredCursor[key].index++;
    return result;
  }

  cursorsIndexCheck() {
    if (this.firstRender) return;
    for (let key in this.registeredCursor) {
      const cursor = this.registeredCursor[key];
      if (cursor.index !== cursor.arr.length) orderError();
    }
  }

  cursorsResetIndex() {
    for (let key in this.registeredCursor) {
      const cursor = this.registeredCursor[key];
      cursor.index = 0;
    }
  }

  /* --------------∽-★-∽--- 我是华丽的分割线 ---∽-★-∽-------------- */
  render() {
    if (this.state.error) return <div/>;

    this.cursorsResetIndex();
    RenderContext.push(this);
    const renderResult = this.renderFunction(this.props);  // 渲染结果
    RenderContext.pop();
    this.cursorsIndexCheck();
    this.firstRender = false;

    return renderResult;
  }
}

function useHooks(renderFunction) {
  return class extends HooksClass {
    constructor(props) {
      super(props);
      this.renderFunction = renderFunction;
    }
  };
}

export {
  useHooks
};
