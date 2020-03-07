import React from 'react';
import * as myHooks from '../index';
import assert from 'assert';
import {render as reactRender} from '@testing-library/react';

const prettier = require('prettier');

React.useHooks = fn => fn;

let isMyHooks = true;

const Hooks = new Proxy({}, {
  get(target, key) {
    return isMyHooks ? myHooks[key] : React[key];
  }
});

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
