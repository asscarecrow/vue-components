
import Vue from 'vue';
import index from './index.vue';
import common from 'asset/scss/common.scss';

import appLayer from 'components/layer';
import {$ajax,$session} from 'asset/js/utils';

// 拓展Vue
Vue.use({
    install:function(Vue,option){
        Vue.prototype.$ajax = $ajax;
        Vue.prototype.$session = $session;
        Vue.prototype.$layer = appLayer;//实例调用
        Vue.component('appLayer',appLayer);//组件式调用
    }
    
});

var vm = new Vue({
    render: h => h(index)
}).$mount("#app");


