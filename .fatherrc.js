export default {
  cjs: {
    type: 'rollup',
  },
  esm: {
    type: 'rollup',
  },
  runtimeHelpers: process.env.NODE_ENV === 'production',
  extraBabelPlugins: [
  ],
};
