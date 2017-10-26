/**
 @description: a select component for vue,support single select and multiple select
 @author:djh
 props:
list -- required
v-model -- required
width --not required
multiple -- not required

* */
<template>
<div class='css-select' :class='{dropdown: dropdown}' v-clickoutsize='outsize' :style='{minWidth:width}'>
    <div class='siggle' v-if='!multiple'>
    <div class='css-select_chosen' @click='dropdown=!dropdown' @blur='dropdown=!dropdown'>
       <!--  <p class='text' v-text='chosen.text' :class='{hasValue:value!==chosen.value}'></p> -->
         <p class='text' v-text='chosen.text' :class='{hasValue:value!==chosen.value}'></p> 
        <i class='angle'></i>    
    </div>
    <transition name='fadeIn'>
    <ul class='css-select_list'  v-show='dropdown' :style="{top:h+'px'}">
         <li  v-for='(l,i) in comList' :key='i' :class='{selected: l.value === chosen.value}' @click='select(l)'>{{l.text}}</li> 
    </ul>
    </transition>   
    </div>
    <div v-else class='multiple'>
        <div class='css-select_chosen' :style='{width:chosenWidth}'>
            <a class='add-btn' @click='dropdown=true'></a>
            <div class='tag' v-for='(tag,i) in chosen' :key='i'>
                <span class='t'>{{tag.text}}</span>
                <i class='close' @click='removeTag(tag)'></i>
            </div>
            
        </div>
        <transition name='fadeIn'>
            <ul class='css-select_list'  v-show='dropdown' :style="{top:h+'px'}">
                <li  v-for='(l,i) in comList' :key='i' :class='{selected:l.state==1}'  @click='selectTag(l)'>{{l.text}}</li> 
            </ul>
        </transition> 
    </div>
</div>
</template>

<script>
/* 

    支持默认选中
    支持默认显示项
    失去焦点隐藏下拉框
    支持多选 multiple
 */
import {clickoutsize} from 'asset/js/directives';
export default {
    directives:{clickoutsize},
    props:{
        list:{
            type:Array,
            default:[]
        },
        value:{
            type:[String,Object,Number,Array],
            default:''
        },
        width:{
            type:String,
            default:''
        },
        multiple:{//多选， 任意或者具体的值
            type:[Boolean,Number],
            default:false
        }
    },
    data(){
        return {
            chosen:[],
            dropdown:false,
            h:''
        }
    },
    computed:{
        comList(){
            var list = this.list,
                multiple = this.multiple,
                val = this.value,
                new_list;
            if(list===undefined||list===null||list===''||list.length===0){
                new_list = [{text:'',value:'',state:0}];
            }else if(multiple){
            //多选，给每个选项添加一个state方便处理选中状态
                if(val.length>0){
                    new_list = list.map(li=>{
                        li.state=-1;
                        val.forEach(v=>{
                            if(v.value ==li.value){
                                li.state=1;
                                return false;
                            }
                        });
                        return li;
                        
                    });
                }else {
                    new_list = list.map(li=>{
                        li.state=-1;
                        return li;
                    });
                }
                
            }else {
                new_list = list;
            }
            return new_list;
        },
        chosenWidth(){
            var w = this.width,nw;
            if(w!==""){
                nw = parseInt(w.replace('px',''));
                nw -=40;
                return `${nw}px`;
            }
            return "";
            
        }
      
    },
    watch:{
        value(){
            this.setChosen();
            
        },
        list(){
            this.setChosen();
        }
    },
    updated(){
        //设置高度
        this.h = this.$el.clientHeight;   
    },
    mounted(){
        this.setChosen();
    },
    methods:{
        setChosen(){
            var _this = this,
                val = this.value,
                chosenList=[];
            if(this.multiple){
               
                if(val===''||Object.prototype.toString.call(val)!=='[object Array]') {
                    return false;
                }else {
                    
                    this.chosen = val;
                }
            }else {
               
                this.chosen = this.comList[0];
                if(val==='') {
                    return false;
                }else if(typeof val == "string" || typeof val == "number"){
                    this.comList.forEach(item=>{
                        if(item.value == val){
                            _this.chosen = item;
                            return false;
                        }
                    });
                }else {
                    this.chosen = this.value;
                }
            }
            
        },
        select(obj){
            this.chosen = obj;
            this.dropdown=false;
            this.$emit('on-change',obj);
            this.$emit('input',obj);
        },
        removeTag(tag){
            var state = tag.state,
                chosen = this.chosen,
                newChosen;
            state=-state;
            tag.state = state;
            //移除
            newChosen = chosen.filter(cho=>{
                return tag.value!=cho.value;
            });
            this.$emit('on-change',newChosen);
            this.$emit('input',newChosen);
        },
        selectTag(tag){
            var state = tag.state,
                chosen = this.chosen,
                multiple = this.multiple,
                newChosen=[];
                state=-state;
                tag.state = state;
                if(state==-1){
                    //移除
                    newChosen = chosen.filter(cho=>{
                        return tag.value!=cho.value;
                    });
                    this.$emit('on-change',newChosen);
                    this.$emit('input',newChosen);
                }else if(multiple===true||(typeof multiple ==='number'&& multiple-chosen.length>0)){
                    //添加
                    newChosen = chosen;
                    newChosen.push(tag);
                    this.$emit('on-change',newChosen);
                    this.$emit('input',newChosen);
                }
                
        },
        outsize(e){
            this.dropdown=false;
        }
    }

}
</script>

<style lang='scss'>

@keyframes SlideUpIn {
 0% {
  opacity:0;
  transform-origin:0 0;
  transform:scaleY(.8)
 }
 to {
  opacity:1;
  transform-origin:0 0;
  transform:scaleY(1)
 }
}
@keyframes SlideUpOut {
 0% {
  opacity:1;
  transform-origin:0 0;
  transform:scaleY(1)
 }
 to {
  opacity:0;
  transform-origin:0 0;
  transform:scaleY(.8)
 }
}


.fadeIn-enter-active{
  animation: SlideUpIn 0.2s;
}
 .fadeIn-leave-active   {
  animation: SlideUpOut 0.2s;
}

.css-select{position: relative;display: inline-block;
    .css-select_chosen {position: relative;padding: 4px 30px 3px 10px;border: 1px solid #ececec;color: #999;
        .hasValue {color: #666;}
        .angle {position: absolute;right: 5px;top: 10px;width: 0;height:0;border-width: 8px 6px;border-style: solid;border-color: #d9d9d9 transparent transparent transparent;}
    }
    .css-select_list {position: absolute;top: 0;left: 0;width: 100%;z-index: 9999;margin: 5px 0;padding: 5px 0;max-height: 200px;overflow: auto;box-shadow: 0 1px 8px rgba(154,154,154,0.5);background: #fff;
        li {padding: 7px 16px;font-size: 12px;color: #666;
            &:hover {background: #f3f3f3;}
            &.selected:hover,
            &.selected {background: rgba(45,140,240,.7);color: #fff;}
        }
    }
    &.dropdown {
        .css-select_chosen {border-color:rgba(45,140,240,.9); box-shadow: 0 1px 8px rgba(45,140,240,.5);}
    }
}
.css-select .multiple {
    .css-select_chosen {min-width: 150px;min-height: 29px;padding-bottom:0;
        &:after {content:'';display: block;height:1px;clear:both;}
        .add-btn{position: absolute;right: 0;top:0;width:35px;height: 33px;background:url('~asset/img/cross.png') no-repeat center;background-color:#f8f8f8;cursor: pointer;}
    }
    .tag {position: relative;float:left;height: 22px;line-height: 22px;margin-right: 4px;margin-bottom: 4px;padding: 0 16px 0 8px;border: 1px solid #e9eaec;border-radius: 3px;background: #f7f7f7;font-size: 12px;vertical-align: middle;opacity: 1;overflow: hidden;cursor: pointer;
        .t {color: #495060;}
        .close {position: absolute;right:4px;top: 1px;width: 10px;height: 20px;cursor: pointer;
            &:before,
            &:after {content:'';position: absolute;top:43%;left:1px;display: inline-block;width: 9px;height:1px;background: #666;}
            &:before {transform: rotate(45deg);}
            &:after {position: absolute;transform:rotate(-45deg);}
        }
    }
    .css-select_list {
        li{
            &.selected {position: relative;color:rgba(45,140,240,.7);background-color: #fff;
                &:after {content:'';position: absolute;right: 15px;top: 14px;width: 8px;height: 2px;
                border-color: transparent transparent rgba(45,140,240,.7) rgba(45,140,240,.7); border-style: solid;border-width: 1px;
                transform:rotate(-45deg);
                }            
             }
        }
    }
    
}

</style>
