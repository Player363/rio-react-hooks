/**
 * 每当一个useHooks的组件执行render函数时，把当前useHooks组件压入栈内。
 * 在render函数中使用useState时，取栈顶元素就是当前的useHooks的组件。
 */

class RenderContext {
  renderStack = [];

  push(item) {
    this.renderStack.push(item);
  }

  pop() {
    this.renderStack.pop();
  }

  get currentContext() {
    return this.renderStack[this.renderStack.length - 1];
  }
}

export default new RenderContext();
