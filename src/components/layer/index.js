/* 
layer 全局插件

所有参数都是非必填的


type: alert,confirm,info
btns:['确定'，‘取消’]；
onYes:确定回调
onCancel:取消回调

*/
import Vue from 'vue';
import appLayer from './appLayer';

appLayer.newInstance = props =>{
    const _props = props || {};
    const Instance = new Vue({
        data: Object.assign({}, {
            id:0,
            title: null,
            showHead: true,
            showFoot:true,
            showCloseBtn:true,
            time:null,
            btns:['确定','取消'],
            area:'auto',
            shadow:true,
            type:'',
        }, _props),
        computed:{
            mainClass(){
                //父层的class
                var type = this.type,
                    cla;

                if(type=='msg'||type=='loading'|| type=='preview'){
                    cla =`app-layer layer-dialog layer-${type}`;
                }else {
                    cla = `app-layer layer-page layer-${type}`;
                }
                return cla;
            },
            mainStyle(){
                //获取浏览器宽高，设置layer的位置
               //没有在document中dom的高度好像比较难获取
               
               var win = [window.outerWidth,window.outerHeight];
               var top = win[1]/2;
               var left = win[0]/2;
               var style =`left:${left}px`;
               if(Array.isArray(this.area)){
                   style += `width:${this.area[0]};height: ${this.area[1]}`;
               }else if(this.area =='auto'){
                   return style;
               }else if(typeof this.area =='string'){
                   style += `width:${this.area};}`;
               }
               
               return style;
           }
        },
        render(h){
            let closebtn_render=null,title_render=null,cont_render,foot_render=null,btns_render=[],$this= this;
            if(this.render){
                cont_render = h('div', {
                    attrs: {
                        class: `layer-cont`
                    }
                }, [this.render(h)]);
            }else {
                cont_render = h('div', {
                    attrs: {
                        class: `layer-cont`
                    }
                }, [
                    h('div', {
                        domProps: {
                            innerHTML: this.cont
                        }
                    })
                ]);
            }

            //closebtn
            if(this.showCloseBtn){
                closebtn_render = h('div', {
                    attrs: {
                        class: 'close-btn'
                    },
                    on:{
                        click:this.close
                    }
                });
            }
            //构造btns
            function btn(option){
                
                var def = {type:0,text:'确定',handle:$this.yes};
                var opt = Object.assign({},def,option)
                return h('a',{
                    attrs:{
                        class:`layer-btn btn-${opt.type}`
                    },
                    domProps: {
                        innerHTML:opt.text
                    },
                    on: {
                        click: opt.handle
                    },
                });
            }
            switch(this.type){
                case 'msg':
                    btns_render = null;
                    break;
                case 'info':
                    btns_render.push(btn({text:this.btns[0],type:1,handle:$this.cancel}));
                    break;
                case 'confirm':
                    btns_render.push(btn({text:this.btns[0],type:0,handle:$this.yes}));
                    btns_render.push(btn({text:this.btns[1],type:1,handle:$this.cancel}));
                    break;
                case 'alert':
                    btns_render.push(btn({text:this.btns[0],type:1,handle:$this.cancel}));
                    break;
                default:
                    btns_render.push(btn({text:this.btns[0],type:0,handle:$this.yes}));
                    btns_render.push(btn({text:this.btns[1],type:1,handle:$this.cancel}));  
            }

            if(this.showFoot){
                foot_render =  h('div', {
                    attrs: {
                        class: 'layer-foot'
                    }
                }, btns_render)
            }
            return h(appLayer, {
                props: {
                    component:false,
                    area: this.area,
                    showHead:this.showHead,
                    showFoot:false,
                    title:this.title,
                    showCloseBtn:false,
                    shadow:this.shadow

                },
                attrs:{
                    id:`layer-${this.id}`,
                    class: this.mainClass,
                },
                domProps: {
                    value: this.visible
                },
                on: {
                    input: (status) => {
                        this.visible = status;
                    }
                },
                
            }, 
            [
                closebtn_render,
                cont_render,
                foot_render
            ]
            );
            //end render
        },
        methods: {
            close(){
                this.visible = false;
                this.remove();
                this.$emit('input', false);
                this.onClose();
            },
            yes(){
                this.close();
                this.onYes();
            },
            cancel(){
                this.close();
                this.onCancel();
            },
            remove () {
                var id = this.id;
                this.destroy(id);
            },
            destroy (id) {
                try {
                    var elId = 'layer-'+id;
                    var ele = document.getElementById(elId);
                    document.body.removeChild(ele);
                
                }catch(e){

                }
                this.onRemove();
            },
            onRemove(){},
            onYes(){},
            onCancel(){},
            onClose() { }
        }
    })
    // end new Vue
    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const layer = Instance.$children[0];

    //注册实例方法
    return {
        show(props){
            Object.keys(props).forEach(item=>{
                layer.$parent[item]=props[item];
            })
            layer.visible = true;
            //有时间的话触发关闭
            if(layer.$parent.time!=null) {
                setTimeout(()=>{
                    layer.$parent.close();
                },layer.$parent.time);
            }
        },
        close(){
            layer.$parent.close();
        }
    }
   
}
function splitData(props) {
    var data ={},method={};
    Object.keys(props).forEach((item)=>{
        
        if(typeof props[item] ==='function'){
            method[item]=props[item];
        }else {
            data[item]=props[item];
        }
    })
    return [data,method]
}

let layerInstance;
var layerId =0;

/* 
实例化只能传一个参数props 进来，怎么将一个参数区分开来传
传递给组件的props: showFoot,title:null,area;传递给组件的prop可以通过实例的data获取
传递给实例的data: title,type,btns,showFoot,cont
传递给实例的method：onYes,onCancel
*/

/* 通过实例id去关闭某一个弹层，通过class关闭某一类弹层 */
function layerInit(props){
    var data = splitData(props);
    data[0].id = layerId;
    layerInstance = layerInstance || appLayer.newInstance(data[0]);//传递实例参数和组件参数
    data[1].onRemove = function () {
        layerInstance = null;//释放内存
    };
    layerInstance.show(data[1]);//修改实例的个别参数
    layerId++;
    return data[0].id;
    //return Vue;
}

appLayer.load=function(props={}){
    
    props.type='loading';
    props.showHead=false;
    props.showFoot=false;
    props.shadow = false;
    props.showCloseBtn = false;
    return layerInit(props);
    
}
appLayer.msg=function(props={}){
    
    props.type='msg';
    props.showHead=false;
    props.showFoot=false;
    props.shadow = false;
    props.showCloseBtn = false;
    if(!('time' in props)){
        props.time= 2000;
    }
    return layerInit(props);
    
}
appLayer.preview=function(props={}){
    
    props.type='preview';
    props.showFoot=false;
    props.shadow = false;
    return layerInit(props);
}
appLayer.info=function(props={}){
    
    props.type='info';
    if(!('btns' in props)){
        props.btns= ['我知道了'];
    }
    return layerInit(props);
    
}
appLayer.alert = function(props={}){
    props.type='alert';
    return layerInit(props);
}
appLayer.confirm = function(props={}){
    props.type='confirm';
    props.showHead=true;    
    return layerInit(props);
}
//注册全局关闭方法；根据id关闭
appLayer.close=function(id){
    var theLayer;
    if(typeof id ==='string'){
        theLayer = document.getElementById(`#layer-${id}`);
        document.body.removeChild(theLayer);
    }
}
//根据type来关闭
appLayer.closeAll = function(type){
    if(type===undefined) {
        var list = document.querySelectorAll('.app-layer');

       
        for(var i=0,len=list.length;i<len;i++){

            list[i].parentNode.removeChild(list[i]);
           /*  if(list[i].parentNode==='body'){
                document.body.removeChild(list[i]);
            } */
        }

    }else {
        var list = document.querySelectorAll(`.layer-${type}`);
        for(var i=0,len=list.length;i<len;i++){
            document.body.removeChild(list[i]);
        }
    }
    layerInstance=null;
}


export default appLayer