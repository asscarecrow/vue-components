<template>
<section :class='mainClass'  v-show='visible'  @mousemove="move" @mouseup="moveEnd" >
    <div class='layer-shadow'  v-if='shadow'></div>
        
        <article class='layer-main' :id="'layerMain-' + id">
            <div class='layer-head' v-if="showHead" @mousedown="moveStart">
                <slot name='title'>
                    <h2 class='title' v-if="title" v-html='title'></h2>
                </slot>
            </div>
            <div class='close-btn' v-if="showCloseBtn" @click='close'></div>
            <slot>
                <div class='layer-body' >
                    <slot name='cont'><div class='layer-cont' v-html='cont'></div></slot>
                </div>
            </slot>
            <div class='layer-foot' v-if='showFoot'>
                <slot name='btns'>
                <a class='btn-0 layer-btn' href='javascript:;' @click='ok' v-if='btns' v-text='btns[0]'>确定</a>
                <a class='btn-1 layer-btn' href='javascript:;' @click='cancel' v-if='btns[1]' v-text='btns[1]'>取消</a>
                </slot>
            </div>
        </article>
</section>
</template>

<script>
export default {
    props:{
        showHead:{
            type:Boolean,
            default: true
        },
        showFoot:{
            type:Boolean,
            default: true
        },
        showCloseBtn:{
            type:Boolean,
            default: true
        },
        title:{
            type:[String,Boolean],
            default:false
        },
        cont:{
            type:String,
            default:''
        },
        area:{//宽高
            type:[String,Array],
            default:'auto'
        },
        btns:{
            type:Array,
            default:function(){ return ['确定','取消']}
        },
        type:{
            type:String,
            default:'alert'//[msg,alert,page,info]
        },
        value:{
            type:Boolean,
            default:false// 弹窗是否打开,async
        },
        shadow:{
            type:Boolean,
            default: true // 是否需要遮罩层
        },
        
        time:{
            type:Number,
            default:null
        },
    },
    data(){
        return {
            id:0,
            visible: this.value,

            offset:"auto",
            moveLeft: 0, //左移的距离
            moveTop: 0, //上移的距离
            ismove: false
        }
    },
    computed:{
        mainStyle(){
            //防止撑爆浏览器应该设置最大最小宽度
             //获取浏览器宽高，设置layer的位置
            //没有在document中dom的高度好像比较难获取
            
            var win = [window.outerWidth,window.outerHeight];
            var top = win[0]/2;
            var left = win[1]/2;
            var style =`left:${left}px;`;
            if(Array.isArray(this.area)){
                style += `width:${this.area[0]};height: ${this.area[1]}`;
            }else if(this.area =='auto'){
                return style;
            }else if(typeof this.area =='string'){
                style += `width:${this.area};}`;
            }
            
            return style;
        },
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

    },
    watch:{
        value (val) {
            this.visible = val;
        }
    },
   
    methods:{
       
        close(){
            this.visible = false;
            this.$emit('input', false);
        },
        ok(){
            //this.visible=false;
            this.$emit('onYes');
        },
        cancel(){
            this.close();
            this.$emit('onCancel');
        },


        /**
         * 鼠标拖动弹窗
         * @param  {[type]} event   [description]
         * @return {[type]}         [description]
         */
        moveStart(event) {
            this.offset = this.offset == 'auto' ? [] : this.offset;
            
            let oLayer = document.getElementById("layerMain-" + this.id);
            if (this.offset.length == 0) {
                this.offset.push(oLayer.offsetLeft);
                this.offset.push(oLayer.offsetTop);
                this.offset.push(0);
            }
            if (this.offset.length == 2) {
                this.offset.push(0);
            }
            this.offset[0] = (oLayer.offsetLeft);
            this.offset[1] = (oLayer.offsetTop);

            this.moveLeft = event.clientX;
            this.moveTop = event.clientY;
            this.ismove = true;
        },
        /**
         * 拖动弹窗
         * @param  {[type]} event  [description]
         * @return {[type]}        [description]
         */
        move(event) {
            if (this.ismove) {
                let oLayer = document.getElementById("layerMain-" + this.id);
                oLayer.style.left = this.offset[0] + (event.clientX - this.moveLeft) + "px";
                oLayer.style.top = this.offset[1] + (event.clientY - this.moveTop) + "px";
            }
        },
        moveEnd(event) {
            this.ismove = false;
        },

    }

}
</script>

<style lang='scss'>
.app-layer {
    position: fixed;top:0;left:0;width: 100%;height: 100%;z-index:9999;
    .layer-shadow {position:absolute;top:0;left:0;right:0;bottom:0;width: 100%;height: 100%;background: rgba(0,0,0,0.3);z-index: 9999;}
    .layer-head {min-height: 22px;margin-bottom: 20px;cursor: move;
        .title {padding: 5px 0 15px;font-size: 18px;color: #101010;border-bottom: 1px solid #f0f0f0;}
    }
    .close-btn {position:absolute;top:8px;right:8px; width: 20px;height: 20px;cursor: pointer;
        &:before,
        &:after {content:'';position: absolute;top:43%;left:1px;display: inline-block;width: 18px;height:3px;background: #f0f0f0;}
        &:before {transform: rotate(45deg);}
        &:after {position: absolute;transform:rotate(-45deg);}
    }
    .layer-cont {padding: 10px 0;font-size: 16px;color: #101010;}
    .layer-foot {padding: 30px 0 35px;text-align: center;
        .layer-btn {display: inline-block;padding: 5px 20px;margin: 0 5px;min-width: 120px;border-radius: 3px;text-align: center;font-size: 14px;}
        .btn-0 {background: #2c81ff;color: #fff;border: 2px solid #2c81ff;cursor: pointer;}
        .btn-1 {color: #101010;border: 2px solid #ddd;cursor: pointer;}
    }

    
}
.layer-page {
    .layer-main{position:absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);min-width: 360px;max-width:90%; padding: 10px 20px;border-radius: 4px;background: #fff;z-index: 10000;}
    .layer-cont {text-align: center;}
}


.layer-dialog {
    .layer-main {position:absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);min-width: 160px;z-index: 10000;}
    &.layer-msg {
        .layer-main {padding: 2px 25px;border-radius: 4px;background: rgba(0,0,0,0.6);}
        .layer-cont {color: #fff;text-align: center;}
    }
    &.layer-preview {
        .close-btn {top: -5px;right: -5px;border-radius: 50%;background: #999;}
        .layer-head {min-height:auto;margin-bottom: 0;}
        .layer-main {padding: 5px;border-radius: 4px;background: rgba(0,0,0,0.1);}
        .layer-cont {padding: 0;color: #fff;}
    }
    &.layer-loading{
        .layer-cont{width: 60px;height: 24px;background: url(loading-0.gif) no-repeat;}
    }
}

</style>
