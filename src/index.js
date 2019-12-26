let src = require("./component/dep.js")
console.log(src)
require("./assese/css/index.css")

import watcher from './component/watcher.js'
// 实现watch
console.log("实现watch")
// let a = {
//     _b: 7,
//     // get b() {
//     //     alert('获取')
//     //     return this._b
//     // },
//     // set b(x) {
//     //     alert("设置")
//     //     return this._b = x
//     // }

// }

// Object.defineProperty(a, 'b', {
//     get: function () {
//         alert('获取')
//         return this._b
//     },
//     set: function (x) {
//         alert("设置")
//         return this._b = x
//     }
// })
// // a.b = 10
// console.log(a.b)


let vm = new watcher({
    data: {
        a: 0,
        b: 10
    },
    watch: {
        a(newVal, oldVal) {
            console.log('newVal:' + newVal);
            console.log('oldVal:' + oldVal);
            document.getElementById("h3").innerHTML = newVal
        }
    }
    // watch: {
    //     a: {
    //         handler(newVal,oldVal) {
    //         console.log('newVal:' + newVal);
    //         console.log('oldVal:' + oldVal);
    //         document.getElementById("h3").innerHTML = newVal
    //         },
    //         immediate:true
    //     }
    // }
})

// document.getElementById("h3").onclick = function () {
//     if(vm.a===1){
//         vm.a = 999

//     }else{
//         vm.a = 1

//     }
// }
// console.log(vm.a)
import Vue from 'vue'
import app from './app.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter) //使用VueRouter
//创建路由实例
import routerConfig from "./routerConfig"
const router = new VueRouter(routerConfig);
Vue.$router = router;
import $common from './assese/js/common.js'//common独立打包引入
Vue.prototype.$common = $common;


// Vue.prototype.$ = $;

// console.log($)
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
// new Vue({
//     el:'#app', 
//     mode: 'history',
// 	//使用箭头函数自动创建对象
// 	//render:function(create){create(App)} //这是es5的写法
// 	//es6的写法:箭头函数的意思就是goes to:左边是参数,右边是表达式
//     render: h => h(app),
//     router
// });

new Vue({
    el: '#app',
    mode: 'history',
    // store, // 把 store 对象提供给“store”选项，这可以把store的实例注入所有的子组件
    render: h => h(app),
    router,
  })

