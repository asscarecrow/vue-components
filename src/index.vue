<template>
<div class="wrap">
    <a href="https://github.com/MorePainMoreGain/vue-components" target="_blank">github 源码地址</a>
<h2>first: drawdown select</h2>
	   sex：<app-select
            :list='list1'
            v-model="sigleVal"
            @on-change="singleChange"
        ></app-select>
        interest:<app-select
            :list='list2'
            :multiple=true
            v-model="multiVal"
            @on-change="multiChange"
        ></app-select>
    <ul>
       <li> result: </li>
       <li> your sex is: {{singleSelect}}</li>
       <li> your interest is: {{multiTxt}}</li>
    </ul>

<h2>second: layer component</h2>
    <a class='btn btn-default' @click='layerShow=true'>组件弹窗</a>
    <app-layer 
        title='提示'
        v-model='layerShow'
        @onYes = 'layerOk'
        @onCancel = 'layerCancel'
    ><div slot='cont'>
        请选择您的性别：<app-select :list='list1'></app-select>
    </div>
    </app-layer>
</div>

</template>

<script>
const appSelect = r => require.ensure([], () => r(require("components/appSelect")), 'app');

  	export default {
        components:{
           appSelect
        },
    	data(){
            return {
                list1:[
                    {text:"man",value:1},
                    {text:"women",value:2}
                ],
                list2:[
                    {text:"swing",value:1},
                    {text:"sing",value:2},
                    {text:"dancing",value:3},
                    {text:"game",value:4},
                    {text:"move",value:5}
                ],
                singleSelect:"",
                multiSelect:"",
                multiVal:"",
                sigleVal:2,
                layerShow:false,
                
            }
        },
        computed:{
            multiTxt(){
                var multi=[],data=this.multiVal;
                if(typeof data==='object'){
                    multi = data.map(d=>{
                        return d.text;
                    });
                }
                return multi.join(",");
            },
        },
        methods:{
            singleChange(data){
                if(typeof data==="object"){
                    this.singleSelect = data.text;
                }
            },
            multiChange(data){
                this.multiSelect = data;
            },
            layerOk(){
                this.layerShow=false;
                this.$layer.msg({
                    cont:'哈哈你点击了确定'
                });
            },
            layerCancel(){
                this.$layer.alert({
                    title:'警告',
                    cont:'您点击了取消哦!!',
                    onCancel:function(){
                        //alert('好吧');
                        this.$layer.alert({cont:'好吧'});
                    }
                })
            }
            
        }
  	}

</script>
<style>
.wrap {padding: 30px 20px;}
.wrap .css-select {vertical-align: middle;}
</style>

