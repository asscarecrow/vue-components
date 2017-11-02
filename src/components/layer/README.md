## vue2.0 的弹窗组件，包含组件式调用和若干可以方便调用的实例

### 组件式调用
```
<app-layer 
    title='提示'
    v-model='layerShow'
    @onYes = 'layerOk'
>
    <div slot='cont'><app-select :list='appOrg'></app-select></div>
</app-layer>
```
#### 支持的props属性
| Property      | Type          | Default  | Description |
| ------------- |:-------------:| -------:|------------:|
|type|String|alert|弹窗类型；包含msg,alert,info,page|
|showHead|Boolean|true|显示头，包含title与关闭按钮|
|showFoot|Boolean|true|显示脚，包含btns|
|btns|Array|['确定','取消']|按钮|
|area|[String,Array]|auto|弹窗的宽高|
|cont|String||主要的显示内容，也可以传slot自定义|
|value|Boolean|false|控制弹窗打开关闭|
|shadow|Boolean|true|遮罩层控制|
|time|Number|null|弹窗关闭的时间|

#### 支持的回调事件
| name          |argument       | Description |
| ------------- |:-------------:|------------:|
|onYes|null|确定按钮回调|
|onCancel|null|取消按钮回调|


### 实例调用
为了方便各个场景的使用，特地写了多个常用的实例，实例也是基于app-layer 组件，但是预设了参数，使得我们少传，或者不传参数，也能达到我们的效果
`[]` 里面的参数表示实例可传的参数
`onYes` 确定回调
`onCancel` 取消回调
1. load 
`this.$layer.load()`
2. msg 
`this.$layer.msg({[cont,time]})`
time: 默认是2000
3. preview 用于图片预览
`this.$layer.preview([cont])`
4. info
`this.$layer.info([title,cont,btns,shadow,onCancel])`
5. alert
`this.$layer.alert([title,cont,btns,shadow,onCancel])`
6. confirm
`this.$layer.confirm([title,cont,btns,shadow,onYes,onCancel])`
7. close 
根据id关闭layer
```
var id = this.$layer.confirm();
this.$layer.close(id);
```
8. closeAll([type]) 
如果有type则根据type关闭某一类layer;
`this.$layer.closeAll('loading')`;

## TODO
1. 关闭一类弹窗时同时打开这一类弹窗。(done)


