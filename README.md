# vite-ts-2022

## 报错

## 1.安装vue3
### 下载最新的vue-cli
```
yarn global add @vue/cli@next
```
### 安装vue3
```
vue create vue3-2020-init
```
### 升级vue3
进入vue3-2020-init文件夹
```
vue upgrade --next
```
## 2.新建vue.config
```
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 输出文件目录
  outputDir: 'dist',
  // 静态资源目录 (js, css, img, fonts)
  assetsDir: 'assets',
  // 指定生成的 index.html 的输出路径
  indexPath: 'index.html',
  // lintOnSave：{ type:Boolean default:true } 是否使用 eslint
  lintOnSave: true,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果不需要生产时的源映射，那么将此设置为 false 可以加速生产构建
  productionSourceMap: false,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  transpileDependencies: [],
  devServer: {
    disableHostCheck: true,
    port: '', // 端口号
    host: '',
    https: false,
    open: true, // 配置自动启动浏览器
    overlay: { // 浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    compress: true,
    hot: true  //热加载
    // 配置跨域处理
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     ws: true,
    //     changeOrigin: true
    //   }
    // }
  },
}
```
## 3.安装包
### 3-1.stylus
不用配置
```
npm i -D stylus stylus-loader
```

### 3-2.pug
不用配置
```
npm i -D pug-plain-loader pug
```

### 3-3. vw布局
#### 下包
```
npm i -D postcss-loader postcss-px-to-viewport
```
##### 在vue.config中配置
新建postcss.config
```
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: "px",	// 需要转换的单位，默认为"px"
      viewportWidth: 1920,   // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      // viewportHeight:667,// 视窗的高度，对应的是我们设计稿的高度
      unitPrecision: 3,		// 单位转换后保留的精度
      propList: [		// 能转化为vw的属性列表
        "*"
      ],
      viewportUnit: "vw",		// 希望使用的视口单位
      fontViewportUnit: "vw",		// 字体使用的视口单位
      selectorBlackList: [],	// 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
      minPixelValue: 1,		// 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
      mediaQuery: false,		// 媒体查询里的单位是否需要转换单位
      replace: true,		// 是否直接更换属性值，而不添加备用属性
      exclude: /(\/|\\)(node_modules)(\/|\\)/,		// 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
    }
  }
}
```

### 3-4.配置axios
vue3不适用把axios绑定到原型链，在src下创建utils文件夹
#### 新建httpTool
```
import axios from "axios";
import webConfig from "./webConfig";

class HttpAxios {
  constructor () {
  }
  
  axiosGet(url, params) {
    // 设置token
    // axios.defaults.headers.common["Authorization"] = "token " + localStorage.getItem("token");
    
    // 配置接口地址
    url = webConfig.apiPath + url;
    
    // 返回一个promise的get请求
    return axios
      .get(url, params)
      .then(res => {
        return Promise.resolve(res.data);
      })
      .catch(ERR => {
        // alert(ERR);
        console.log("接口报错", ERR);
      });
  }
  
  axiosPost(url, params) {
    // 设置token
    // axios.defaults.headers.common["Authorization"] = "token " + localStorage.getItem("token");
    
    // 配置接口地址
    url = webConfig.apiPath + url;
    
    // 返回一个promise的post请求
    return axios
      .post(url, params)
      .then(res => {
        return Promise.resolve(res.data);
      })
      .catch(ERR => {
        // alert(ERR);
        console.log("接口报错", ERR);
      });
  }
}

export default new HttpAxios()

```
#### 新建webConfig
```
let api;
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  // 生产环境api接口地址
  api = {
    apiURL: "/",
    publicPath: "/",
    apiPath: "/",
    staticPath: "/"
  };
} else if (process.env.NODE_ENV === "development") {
  // 开发环境
  api = {
    apiURL: "/",
    publicPath: "/",
    apiPath: "/",
    staticPath: "/"
  };
}

const config = {
  api: api,
  publicPath: api.publicPath,
  staticPath: api.staticPath,
  apiPath: api.apiPath
};

export default config;

```
#### 在main.js中使用
```
import { createApp } from 'vue'
import App from './App.vue'

// 绑定axios到Vue原型链
import HttpAxios from './utils/httpTool'

const app = createApp(App);

// 绑定
app.config.globalProperties.$Http = HttpAxios;
app.mount('#app');

```

### 3-5.配置element
### 1.下包
第一种 `vue add element-plus`

第二种`npm install element-plus --save`/ 推荐用第二种

### 2.新建element.js
```

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import locale from 'element-plus/lib/locale/lang/zh-cn'

export default (app) => {
  app.use(ElementPlus, {locale})
}

```
### 3.在main.js中导入
```
import installElementPlus from './plugins/element'
installElementPlus(app);
```

### 3-6 配置vuex
#### 1.下包
`vue add vue-next` 或者 `npm install vuex@next --save`

#### 2.配置
在src下新建store文件夹，并建立index文件
```
import { createStore } from 'vuex'

const store = createStore({
  state: {
    count: 0
  },
  getters: {
    count: state => state.count,
  },
  mutations: {
    increment (state) {
      state.count++;
      console.log(store.state.count)
    }
  },
  actions: {
  },
  modules: {
  }
});

export default store
```
在main文件中导入
```
// vuex
import store from './store/index';
app.use(store);
```
#### 3.使用
这边页面是分离的，所以js和html放在两个文件里面
```
import { useStore } from "vuex";
import { computed } from 'vue'

export default {
  data () {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    clickUp() {
      this.increment()
    }
  },
  components: {},
  setup() {
    // store
    const store = useStore ();
    return {
      // 定义一个 mutation
      increment: () => store.commit('increment'),
      // 在 computed 函数中定义一个 getter
      double: computed(() => store.getters.count)
    }
  }
};
```
在html中使用
```
<template>
  <div>
    <span class="test">VueX4测试用例{{double}}</span>
    <el-button type="primary" @click="clickUp">vuex按钮</el-button>
  </div>
</template>

<script src="./control.js"></script>
```

#### 3.配置
```
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import store from '../store/index'
// 构建我们的页面路由配置，可以看到，这里和原来的写法并无二致。
const routes = [
  {
    path: '/',
    component: HelloWorld
  },
  {
    path: '/vuex',
    component: () => import('@/views/vuex_page/index.vue'),
  }
];

const router = createRouter({
  // 使用 hash 模式构建路由（ url中带 # 号的那种)
  // history: createWebHashHistory(),
  // 使用 history 模式构建路由 （ url 中没有 # 号，但生产环境需要特殊配置）
  history: createWebHistory(),
  routes
});

// 路由守卫-方式一
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) {
//     // 当前组件需要登录权限
//     if (localStorage.getItem("token")) {
//       // 有权限
//       if (to.path === "/login") {
//         //登录状态下 访问login.vue页面 会跳到homepage.vue
//         next({ path: "/homepage" });
//       } else {
//         next();
//       }
//     } else {
//       // 没有权限 ,访问任何页面。都会进入到 登录页
//       console.log("进入1");
//       if (to.path === "/login") {
//         // 如果是登录页面的话，直接next() -->解决注销后的循环执行bug
//         console.log("进入2");
//         next();
//       } else {
//         // 否则 跳转到登录页面
//         console.log("进入3");
//         next({ path: "/" });
//       }
//     }
//   } else {
//     // 不需要
//     next();
//   }
// });

// 路由守卫-方式二
// router.beforeEach( async (to, from, next) => {
//   console.log('before路由', to);
//
//   let hasLogin = localStorage.getItem("Flag")
//
//   if (hasLogin) {
//     if (store.state.menuList.length === 0) {
//
//       // 进入到这一步用户已经登录过，但是又刷新了浏览器，导致路由清空了,所以要重新请求路由
//       // 请求数据列表
//       let resCode = await store.dispatch('getCompanyList')
//       if (resCode !== 200) {
//         return
//       }
//
//       // 请求路由列表
//       let res = await store.dispatch('getMenuList')
//       // code 不为200 时候，说明路由接口报错，需要重新登录
//       if (res !== 200) {
//         localStorage.clear();
//         MessageBox({
//           title: '警告',
//           message: '导航配置问题，请联系管理员',
//           callback: action => {
//             localStorage.clear();
//             next({path: '/login', replace: true })
//           }
//         })
//       } else {
//         // router.addRoutes是异步的，所以把全局的跳转 *也动态添加了，同时使用 next({ ...to, replace: true })重新载入
//         next({...to, replace: true })
//       }
//
//
//     }
//     // 已经登录过访问的是login，跳转至home
//     if (to.name === 'Login') {
//       next({
//         path: recursiveRouter(store.state.menuList[0]),
//       })
//     } else {
//       // 当匹配不到路由，则判断进入路由第一个页面
//       if (to.name === 'error') {
//         let path = recursiveRouter(store.state.menuList[0]);
//         next({
//           path: path
//         })
//       } else {
//         next()
//       }
//     }
//   } else {
//     console.log('to', to);
//     // 没有登录想访问其他页面，跳转至
//     if (to.name !== 'Login') {
//       next({
//         path: '/login',
//       })
//     } else {
//       next()
//     }
//   }
//   // next()
// });
//
// // 递归路由
// let recursiveRouter = (data) => {
//   if (data.children && data.children.length > 0) {
//     return recursiveRouter(data.children[0])
//   } else {
//     return data.path
//   }
// };

export default router
```

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
