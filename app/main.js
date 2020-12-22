import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
// import Vuex from 'vuex'
import store from './store'

import axios from "axios"
import VueAxios from "vue-axios"

import { 
  Button ,
  NavBar ,
  Form ,
  Field,
  Popup,
  Tabbar,
  TabbarItem  ,
  Search,
  Swipe,
  SwipeItem ,
  Lazyload ,
  Toast,
  Stepper,
  GoodsAction,
  GoodsActionIcon, 
  GoodsActionButton,
  Empty,
  SubmitBar,
  Card,
  Checkbox,
  SwipeCell,
  Cell,
  List,
  AddressEdit,
  AddressList,
  Dialog,
  Uploader,
  Tab,
  Tabs,
  Icon,
  Grid,
  GridItem,
  
  
} from 'vant';

Vue
    .use(Button)
    .use(NavBar)
    .use(Form)
    .use(Field)
    .use(Popup)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Search)
    .use(Swipe)
    .use(SwipeItem)
    .use(Lazyload)
    .use(Toast)
    .use(Stepper)
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton)
    .use(Empty)
    .use(SubmitBar)
    .use(Card)
    .use(Checkbox)
    .use(SwipeCell)
    .use(Cell)
    .use(List)
    .use(AddressEdit)
    .use(AddressList )
    .use(Dialog)
    .use(Uploader)
    .use(Tabs)
    .use(Tab)
    .use(Icon)
    .use(Grid)
    .use(GridItem)
    // .use(Vuex)
  

    
    
    

    //配置请求基础路径
axios.defaults.baseURL='http://www.kangliuyong.com:10002';

Vue.prototype.appkey='U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

// axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config =>{
  
  if (config.method == 'post') {

    //序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    //重新赋值config.data
    config.data = paramsString.slice(0, -1);

    // 

  }

  //必须返回config
  return config;
})


Vue.use(VueAxios,axios)
//小数点过滤器
Vue.filter("decimal",(v,n=2)=>{
  return v.toFixed(n)
})
//时间过滤器
Vue.filter('formatDate',(v,format)=>{

  let date = new Date(v);
  format=date.toLocaleString();
  return  format

})
  
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
