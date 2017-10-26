
/* 
 存放跨组件数据
*/
import {$ajax,$session} from 'asset/js/utils';
export default {
    state:{
        usrInfo:'',//用户信息
        appInfo:'',//应用信息
        appMarker:{2:[],3:[],4:[]},//开通机构应用时可选的企业与机构信息
        unClaim:'',//认领列表
        markerInfo:{type:'',id:''},//记录当前进入环球号的类型和id
        eidtActivity:'',  //记录当前要编辑的活动
        hasShowAuth:0// 是否已经显示过认证信息了
    },
    getters:{
        //相当于store的计算属性
        /* upState(state){
            var state = state;
        } */
        marker(state){
            //记录当前进入环球号的资料,从usrInfo 拿可以确保是最新的数据
            var info = state.markerInfo,
                usrInfo = state.usrInfo,
                marker='';
                if(info.id===''){
                    var seinfo = $session.get('markerInfo');
                    if(!!seinfo){
                        info = seinfo;
                    }
                }
                if(info.id!==''&&usrInfo!==''){
                    var res =  usrInfo.company.manager[info.id];
                    if(!!res){
                        marker =res;
                        $session.set('marker',info);
                    }

                }
                return marker;
        },
        markerType(state){//机构类型
            var info = state.markerInfo;
            if(info.id===''){
                var seinfo = $session.get('markerInfo');
                if(!!seinfo){
                    info = seinfo;
                }
            }
            var text ;
            if(info!==''){
                switch(info.type){
                    case '2':
                        text= '企业';
                        break;
                    case '3':
                        text= '产业园';
                        break;
                    case '4':
                        text= '协会';
                        break;
                    default:
                        text= '企业'

                }
                return text;
                    
            }else {
                return ''
            }
        },
        organization(state){//管理的企业与机构
            var organization = {2:[],3:[]}
            if(state.usrInfo!==''){
                var manager = state.usrInfo.company.manager;
                if(manager&&typeof manager ==='object'){
                    Object.keys(manager).forEach((id)=>{
                        var type = manager[id].type;
                        if(type==2){
                            organization[2].push(manager[id]);
                        }else{
                            organization[3].push(manager[id]);
                        }
                        
                    })
                }
            }
            return organization;
        },
        joinOrg(state){// 加入的企业与机构
            var joinOrg = {2:[],3:[]}
            if(state.usrInfo!==''){
                var joins = state.usrInfo.company.join;
                if(joins&&typeof joins === 'object'){
                    Object.keys(joins).forEach((id)=>{
                        var type = joins[id].type;
                        if(type==2){
                            joinOrg[2].push(joins[id]);
                        }else{
                            joinOrg[3].push(joins[id]);
                        }
                    })
                } 
            }
            return joinOrg;
        },
        appAuth(state,getters){// 管理的机构号的应用权限计算
            var app = {
                hasActive:false
            },
            usrId,
            applist,
            usrInfo = state.usrInfo,
            marker = getters.marker;
            if(state.usrInfo!==''){
                if(marker!==''){
                    applist = state.usrInfo.application[marker.id];//应用权限列表
                    if(Object.prototype.toString.call(applist)==='[object Array]'){
                        if(applist.includes('01598a642801f66e44')){//活动应用的id
                            app.hasActive = true;
                        }
                       /*  applist.forEach(item=>{
                            switch(item){
                                case '01598a642801f66e44'://活动应用的id
                                    app.hasActive = true;
                                    break;
                                default:
                                    //app.hasActive=false;
                                    return;
                            }
                        }) */

                    }
                }
            }
            return app;
        },
        perAuth(state,getters){//用户具有的应用权限
            var app = {
                hasActive:false,
                hasRoom:false
            },
            usrId,
            applist,
            usrInfo = state.usrInfo;
            if(usrInfo!==''){
                applist = state.usrInfo.application[usrInfo.id];//应用权限列表
                if(Object.prototype.toString.call(applist)==='[object Array]'){
                    if(applist.includes('01598a642801f66e44')){//活动应用的id
                        app.hasActive = true;
                    }
                    if(applist.includes('0159e09d8a03ab1064')){//商务室应用的id
                        app.hasRoom = true;
                    }
                    

                }
                
            }
            return app;
        },
        homepage(state){                    
            var homepage={
                per:'/home/Article/indexPer?id=',   //个人主页跳转链接
                com:'/home/Article/indexCom?id=',   //企业主页跳转链接
                org:'/home/Article/indexAsso?id=',   //机构主页跳转链接
                active:'/home/active/detail?id=',     //活动跳转
                pay:'/home/order/pay?id='    //支付页面跳转
            }
            return homepage;
        }

       
    },
    mutations:{
        //mutations 只能是同步事务
        // 变更store 中的状态的唯一方法是提交 mutation
        m_usrInfo(state,info){
            state.usrInfo=info;
            $session.set('usrInfo',info);
            
        },
        m_appInfo(state,info) {
            state.appInfo = info;
            $session.set('appInfo',info);
            
        },
        m_appMarker(state,info) {
            state.appMarker = info;
            $session.set('appMarker',info);
            
        },
        m_claim(state,info){
            state.unClaim = info;
            $session.set('unClaim',info);
            
        },
        m_markerInfo(state,info){
            state.markerInfo = info;
            $session.set('markerInfo',info)
        },
        m_eidtActivity(state,info){
            state.eidtActivity = info;
            $session.set('eidtActivity',info);
        },
        m_hasShowAuth(state,info){
            state.hasShowAuth = info;
        },
    },
    actions:{
        //actions 提交的是mutations
        

    },
    strict: process.env.NODE_ENV !== 'production'

}