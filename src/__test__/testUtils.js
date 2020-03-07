import React from 'react';
import * as myHooks from '../index';
import assert from 'assert';
import {render as reactRender} from '@testing-library/react';

const prettier = require('prettier');

React.useHooks = fn => fn;

let isMyHooks = true;

const Hooks = {
  get useState() {
    return isMyHooks ? myHooks.useState : React.useState;
  },
  get useEffect() {
    return isMyHooks ? myHooks.useEffect : React.useEffect;
  },
  get useLayoutEffect() {
    return isMyHooks ? myHooks.useLayoutEffect : React.useLayoutEffect;
  },
  get useHooks() {
    return isMyHooks ? myHooks.useHooks : React.useHooks;
  }
};

export function render(fn) {
  const myOutPut = [];
  const nativeOutPut = [];

  isMyHooks = true;
  const App = fn(Hooks, (...args) => myOutPut.push(JSON.stringify([...args])), 'myHooks');
  const myHooksApp = reactRender(<App/>);
  isMyHooks = false;
  const NativeApp = fn(Hooks, (...args) => nativeOutPut.push(JSON.stringify([...args])), 'nativeHooks');
  const nativeHooksApp = reactRender(<NativeApp/>);

  return {
    comparison() {
      assert.equal(
        prettier.format(myHooksApp.container.innerHTML, {parser: 'html'}),
        prettier.format(nativeHooksApp.container.innerHTML, {parser: 'html'}),
      );
      assert.equal(
        prettier.format(JSON.stringify(myOutPut), {parser: 'babel'}),
        prettier.format(JSON.stringify(nativeOutPut), {parser: 'babel'}),
      );
    },
    action(fn) {
      fn(myHooksApp.container);
      fn(nativeHooksApp.container);
    },
  };
}

export function sleep(time) {
  return new Promise(v => {
    setTimeout(v, time);
  });
}
