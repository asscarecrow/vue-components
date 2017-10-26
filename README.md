
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


