import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// 自动导入组件
import AutoImport from 'unplugin-auto-import/vite'
// 自动注册组件
import Components from 'unplugin-vue-components/vite'
// 按需导入element组件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 为不支持原生ESM的传统浏览器提供支持
import legacy from '@vitejs/plugin-legacy';
// 引入 svg 文件来使用，就像使用 Vue组件
import svgLoader from 'vite-svg-loader'
// https://icones.js.org/ 优秀的图标库
import Icons from 'unplugin-icons/vite'
// 自动按需引入图标库
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    AutoImport({
      dts: './src/auto-imports.d.ts',
      imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: './src/components.d.ts',
      // imports 指定组件所在位置，默认为 src/components
      dirs: ['src/components/'],
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.mjs'],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true, // host设置为true才可以使用network的形式，以ip访问项目
    port: 8080, // 端口号
    open: true, // 自动打开浏览器
    cors: true, // 跨域设置允许
    hmr:true, // 热加载
    strictPort: false, // 设为true端口已占用直接退出, false 尝试下一个可用端口
    // 接口代理
    proxy: {
      '/api': {
        // 本地 8000 前端代码的接口 代理到 8888 的服务端口
        target: 'http://localhost:8888/',
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace('/api/', '/'),
      },
    },
  },
  build: {
    // 打包大小超过2000kb警告
    chunkSizeWarningLimit: 2000,
    // 压缩混淆，esbuild 比 terser 快 20-40 倍，压缩率只差 1%-2%
    minify: 'esbuild',
    // 在生产环境移除console.log
    terserOptions: {
      compress: {
        drop_console: false,// 不注释console
        pure_funcs: ['console.log', 'console.info'],// 移除这两种cons日志
        drop_debugger: true, // 注释debugger
      },
    },
    assetsDir: 'static/assets',
    // 静态资源打包到dist下的不同目录
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
