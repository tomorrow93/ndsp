// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import {delCookie, getCookie, setCookie} from '@/assets/js/cookie.js'

//国际化
import VeeValidate,{Validator} from 'vee-validate';
//import zh_CN from 'vee-validate/dist/locale/zh_CN.js'  //中文表单验证
import zh_EN from 'vee-validate/dist/locale/zh_EN.js'  //英文表单验证
import VueI18n from 'vue-i18n';

//bootstrap
import '@/assets/js/jquery.min.js'
import '@/assets/js/bootstrap.min.js'
import '@/assets/js/common.js'

//element-UI
import ElementUI, {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' //英文

Vue.use(ElementUI, { locale })

Vue.use(VueI18n)
axios.defaults.baseURL = 'http://218.17.186.161:8104' //服务器
// axios.defaults.baseURL = 'http://127.0.0.1:8104' //本地
//axios.defaults.baseURL = 'http://test.mobikok.com:9214' //小雷

// http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
    config => {
        if (getCookie('token')) { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.Authorization = getCookie('token');
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    //这里写清除token的代码
                    setCookie('token', '');
                    router.replace({
                        path: 'login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        } //登录成功后跳入浏览的当前页面
                    })
                    break;
                case 403:
                    //此角色没有权限
                    Message({
                        message: 'no permission access',
                        type: 'error',
                        duration: 1800
                    });
                    break;
            }
        }
        return Promise.reject(error.response.data)
    });

//修改原型链
Vue.prototype.$axios=axios

//中英文处理
const i18n = new VueI18n({
    locale: 'English', //设置当前语言
    messages:{
        'English': require('./common/English.js'),  //英文
        'Chinese': require('./common/Chinese.js'),  //中文
    }
})

//表单验证国际化处理
const vee_i18n = new VueI18n({
  locale: 'zh_EN',
})
Vue.use(VeeValidate, {
    vee_i18n,
    i18nRootKey: 'validation',
    locale: 'zh_EN',
    dictionary: {
        zh_EN
    }
});
Vue.config.productionTip = false

//自定义验证规则
this.validator = new Validator({});
Validator.extend('number', {
    validate: value => {
        return !/[^\d^\.]+/g.test(value)
    }
});
Validator.extend('website', {
    validate: value => {
        var match = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
        return match.test(value);
    }
});


new Vue({
  el: '#app',
  router,
  i18n,
  vee_i18n,
  components: {App},
  template: '<App/>'
})
