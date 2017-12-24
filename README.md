
> an set of vue components,include vue-select,vue-layer and so on

## 一、 drowdown select
#### Feature
* very simple
* sigle select and multiple select support

#### Basic Usage
download the file,clone the `appSelect.vue`  from the folder `src/components/`,then import it in your project.

```html
<app-select
    :list='list2'
    :multiple=true
    v-model="multiVal"
    @on-change="multiChange"
></app-select>
```

## 二、 layer
#### Feature
* simple 
* support called both by vue components and instance.

#### Basic Usage
The best to using is to extend the Vue prototype and components.

```javascript
import appLayer from 'components/layer';
// first: extend Vue
Vue.use({
    install:function(Vue,option){
        Vue.prototype.$layer = appLayer;
        Vue.component('appLayer',appLayer);
    }
    
});
```
So it can be called both prototype function and Instance. 
```html
<template>
    <app-layer 
        title='提示'
        v-model='layerShow'
        @onYes = 'layerOk'
        @onCancel = 'layerCancel'
    ><div slot='cont'>
        请选择您的性别：<app-select :list='list1'></app-select>
    </div>
    </app-layer>
</template>
```
```javascript
this.$layer.msg({
    cont:'哈哈你点击了确定'
});
```
and the detail you can read the [readme](src/components/layer/README.md) in path  `components/layer`.

## 三、directives
collecting some useful directives

#### 3.1 clickousize
get the response when user click outsize the DOM.

**usage**
```javascript
// step1
import {clickoutsize} from 'asset/js/directives';

// step2
export default {
    directives:{clickoutsize},
    methods: {
        outsize() {
          // ... 
        }
    }
}
// step3
<div id='mydom' v-clickoutsize='outsize' ></div>
```

