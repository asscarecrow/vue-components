<template>
<div class="wrap">
    <a href="">github 源码地址</a>
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
            }
        }
  	}

</script>
<style>
.wrap {padding: 30px 20px;}
.wrap .css-select {vertical-align: middle;}
</style>

