/***
 * 官方网站的打包运行入口，等同于我们平时写的main.js（vue项目默认是main.js）
 * ***/
import Vue from 'vue';
import entry from './app';
import VueRouter from 'vue-router';
// 这里配置了alias别名，所以可以写main/index.js，具体alias配置见build/config.js
import Element from 'main/index.js';
// 可以让web上的代码能高亮显示
import hljs from 'highlight.js';
// 引入路由配置
import routes from './route.config';
// 封装的官网相关的组件
import demoBlock from './components/demo-block';
import MainFooter from './components/footer';
import MainHeader from './components/header';
import SideNav from './components/side-nav';
import FooterNav from './components/footer-nav';
// 官网首页的多语言配置
import title from './i18n/title';

// 引入所有的样式
import 'packages/theme-chalk/src/index.scss';

import './demo-styles/index.scss';
import './assets/styles/common.css';
import './assets/styles/fonts/style.css';
// 引入所有的icon
import icon from './icon.json';

Vue.use(Element);
Vue.use(VueRouter);
Vue.component('demo-block', demoBlock);
Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
Vue.component('side-nav', SideNav);
Vue.component('footer-nav', FooterNav);

const globalEle = new Vue({
  data: { $isEle: false } // 是否 ele 用户
});

Vue.mixin({
  computed: {
    $isEle: {
      get: () => (globalEle.$data.$isEle),
      set: (data) => {globalEle.$data.$isEle = data;}
    }
  }
});

Vue.prototype.$icon = icon; // Icon 列表页用

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

router.afterEach(route => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });
  const data = title[route.meta.lang];
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'Element';
  // 谷歌的分析工具，详细引入脚本的信息见index.tpl
  ga('send', 'event', 'PageView', route.name);
});

new Vue({ // eslint-disable-line
  ...entry,
  router
}).$mount('#app');
