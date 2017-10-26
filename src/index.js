
import Vue from 'vue';
import index from './index.vue';
import common from 'asset/scss/common.scss';
var vm = new Vue({
    render: h => h(index)
}).$mount("#app");


