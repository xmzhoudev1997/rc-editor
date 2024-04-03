import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: '',
  themeConfig: {
    name: 'rc-editor',
  },
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/rc-editor/dist/',
  hash: true,
  history: {type: 'hash',},
});
