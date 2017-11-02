/* 
    此文件用来存放工具类方法集合
    调用例子：this.$ajax({});
*/



/* *
封装fetch API 请求数据
**参数解析

{url : '', data : {},type : 'POST', method : 'fetch',callback:true,errorback:true}
1. url 地址
2. data 上传的数据
3. type 提交的方式
4. method 使用的ajax方法，默认是fetch API
5. callback,errorback 默认 true ，会调用默认的成功和失败回调函数
6.isLoading 是否显示loading禁用页面

*调用
$ajax({
    url:'index/getLoginUser',
})
.then(function(){
    //相当于成功回调，可有可无
})
.catch(function(res){
    //相当于失败回调，必须的；
}) 

后端返回json {code:'000',msg:'',data:''}
code解释：000 成功 | 001 失败 | 002 未登录
*/
import $layer from 'components/layer';

var $ajax = (opt) => {
    
    
    var defaults = {url : '', data : {},type : 'POST', method : 'fetch',callback:true,errorback:true,isLoading:true};
    var back_success = function(res){
        if(res.message!=null){
            $layer.msg({cont:res.message});
        }
    };
    var back_unlogin = function (res) {
        //未登录拦截并抓取当前url信息传递给登录跳转
        var host = location.hostname;
        var path = location.pathname;
        var port = location.port;
        var protocol = location.protocol;
        var hash = window.location.hash;
        var url = protocol + '//' + host;
        if(port!=80){
            url = url + ":" + port;
        }
        url = url + path + hash;
        window.location.href = protocol + '//' + host +'/home/login?goto=' + encodeURIComponent(url);
    };
    var back_error =function(res){
        if(res.message!=null){
            $layer.alert({cont:res.message});
        }
    };
    //请求完成，成功失败都有可能
    function back_complete(){
        $layer.closeAll('loading');
    }


    /* 
    根据后端的数据要求：除了id以外的其他字段都要用data字段封装,解析json数据
    */
    var parseObject =function (data,new_obj=[],new_name){
        var $this = this;
        function parseName(name,i){
            var n_data_name;
            if(/^data\[.*\]$/.test(name)) {
                n_data_name = name+`[${i}]`;
            }else {
                n_data_name = `data[${i}]`;
            }
            return n_data_name;
        }
        Object.keys(data).forEach(function(i){
            if(i=='id'&&new_name===undefined) {
                new_obj.id = data.id;
                var id_val = encodeURIComponent(i) + "=" +encodeURIComponent( data[i] == null ? "" : data[i] );
                new_obj.push(id_val);
            }else {
                var now_name = parseName(new_name,i);
                if(data[i]===null) {
                    return;
                }
                else if(Object.prototype.toString.call(data[i])==='[object Array]'){
                    //如果是字符串数组就直接解析
                    //对象数组就再解析一级
                    
                    data[i].forEach(function(arr,index){
                        var arr_name = now_name+`[${index}]`;
                        
                        if(typeof arr ==='object'){
                            return parseObject(arr,new_obj,arr_name);
            
                        }else {
                            var now_val = encodeURIComponent(arr_name) + "=" +encodeURIComponent( arr == null ? "" : arr );
                            new_obj.push(now_val);
                        }
                    })
                    
                }
                else if(data[i]!==null&&typeof(data[i]) ==='object'){
                    return parseObject(data[i],new_obj,now_name);
                }
                else {
                    var now_val = encodeURIComponent(now_name) + "=" +encodeURIComponent( data[i] == null ? "" : data[i] );
                    new_obj.push(now_val);
                }
            }
        });
        //return new_obj;
        return new_obj.join('&');
    }
   
    //GET 请求的数据跟post请求的数据不一样的处理
    var parseGetObject =function (data,new_obj=[],new_name){
        var $this = this;
        function parseName(name,i){
            var n_data_name;
            
            if(/\[.*\]$/.test(name)) {
                n_data_name = name+`[${i}]`;
            }else {
                n_data_name = i;
            }
            return n_data_name;
        }
        Object.keys(data).forEach(function(i){
            if(i=='id'&&new_name===undefined) {
                new_obj.id = data.id;
                var id_val = encodeURIComponent(i) + "=" +encodeURIComponent( data[i] == null ? "" : data[i] );
                new_obj.push(id_val);
            }else {
                var now_name = parseName(new_name,i);
                
                if(data[i]===null) {
                    return;
                }
                else if(Object.prototype.toString.call(data[i])==='[object Array]'){
                    //如果是字符串数组就直接解析
                    //对象数组就再解析一级
                    
                    data[i].forEach(function(arr,index){
                        var arr_name = now_name+`[${index}]`;
                        
                        if(typeof arr ==='object'){
                            return parseGetObject(arr,new_obj,arr_name);
            
                        }else {
                            var now_val = encodeURIComponent(arr_name) + "=" +encodeURIComponent( arr == null ? "" : arr );
                            new_obj.push(now_val);
                        }
                    })
                    
                }
                else if(data[i]!==null&&typeof(data[i]) ==='object'){
                    return parseGetObject(data[i],new_obj,now_name);
                }
                else {
                    var now_val = encodeURIComponent(now_name) + "=" +encodeURIComponent( data[i] == null ? "" : data[i] );
                    new_obj.push(now_val);
                }
            }
        });
        //return new_obj;
        return new_obj.join('&');
    }
  
    return new Promise((resolve,reject)=>{
        Object.keys(defaults).forEach(key=>{
            if(opt[key]==null) {
                opt[key]=defaults[key];
            }
        })
            
        var type = opt.type.toUpperCase();
        var url =  opt.url;
        var data = opt.data;
        var method = opt.method;
        var callback = opt.callback;
        var errorback = opt.errorback;
        var getData,sendData;
        var loading = opt.isLoading;
        var timestamp = new Date().getTime();
        if(loading) {
            //是否发送请求前添加loading层
            $layer.load();
        }
        if (type == 'GET') {
            getData = parseGetObject(data);
            url = url+`?t=${timestamp}`;
            if(getData!==''){
                url = url+`&${getData}`;
            }
        }else {
            sendData =  parseObject(data);
        }
        if (window.fetch && method == 'fetch') {
            let requestConfig = {
                credentials: 'include',
                method: type,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                mode: "cors",
                cache: "force-cache"
            }
            if (type == 'POST') {
                Object.defineProperty(requestConfig, 'body', {
                    value: sendData
                })
            }

            
            fetch(url, requestConfig)
            .then((res)=>{
                if(res.ok) {
                    return res.json();
                }
                throw new Error('网络状态不通，不 OK');
                
            })
            .then((res_json)=>{
                
                back_complete(res_json)
                
                if(res_json.code==='000') {
                    if (callback) {
                        back_success(res_json);
                    }
                    resolve(res_json);
                }else if(res_json.code==='003'){
                    back_unlogin();
                }else{
                    if(errorback) {
                        back_error(res_json);
                    }
                    reject(res_json);
                }
                
            })
            .catch((res)=>{
            //
            back_complete();
                back_error({message:'服务器繁忙，请稍后重试'});
                reject('服务器繁忙，请稍后重试');
                throw new Error(Object.prototype.toString.call(res));
                
                
            })
        } else {
            
                let requestObj;
                if (window.XMLHttpRequest) {
                    requestObj = new XMLHttpRequest();
                } else {
                    requestObj = new ActiveXObject;
                }
               
                
                requestObj.open(type, url, true);
                requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                requestObj.send(sendData);
                requestObj.onreadystatechange = () => {
                    if (requestObj.readyState == 4) {
                        back_complete();
                        if (requestObj.status == 200) {
                            try{
                                let res_json =  JSON.parse(requestObj.response)
                                if(res_json.code==='000'){
                                    if(callback) {
                                        back_success(res_json);
                                    }
                                    resolve(res_json);
                                }else{
                                    if(errorback) {
                                        back_error(res_json);
                                    }
                                    reject(res_json);
                                }
                            }catch(e){//捕获后端异常返回
                                back_error({message:'服务器繁忙，请稍后重试'});
                                reject('服务器繁忙，请稍后重试');
                            }
                            
                        } else {
                            back_error({message:'服务器繁忙，请稍后重试'});
                            reject('服务器繁忙，请稍后重试');
                        }
                    }
                }
        }
    });
    
}

/* cookie 操作 */
//cookie
var $cookie = {
    getObj:function() {
        var ck = document.cookie;
        var obj = {};
        if(ck!=""){


            var ck_array = ck.split(";");
            var ck_json = ck_array.map(function(e){
                var arry = e.split("=");
                obj[arry[0].trim()]=arry[1].trim();
                return obj;
            });
        }
        return obj;
    },set:function(name, value,options) {
        var defaults = {
            path: null,
            domain: null,//默认是当前域，
            hour:null //过期时间
        };
        var opt = Object.assign({},defaults,options)
        var exist = this.getObj().name;
        var expire = new Date();
        expire.setDate(expire.getHours() + opt.hour);//默认是会话cookie
        if(exist=="undefined") {
            document.cookie = name + '=' + value + ';expires=' + expire.toGMTString() + ';path=' + opt.path ;
        }else {
            this.del(name);
            document.cookie = name + '=' + value + ';expires=' + expire.toGMTString() + ';path=' + opt.path ;
        }

    },del:function(name) {
        var exist = this.getObj().name;
        if(exist!="undefined") {
            var clear = new Date();
            clear.setTime(clear.getTime()-1000);
            document.cookie = name + '= 5 ;expires=' + clear.toGMTString();
        }
    }
};

/**
 * 本地存储，优先使用 sessionStorage
 * 在sessionSorage ，会话存储中相当好用，但是本地存储不能跟cookie相比，因为ie不兼容localStorage
 * session 存储使用了encode编码
 * by djh
 * $session.get(name);
 * $session.set(name,value);
 * $session.remove(name)
 * 
 * 
 * */
var $session = (function () {
    var api               = {},
        win               = window,
        doc               = win.document,
        localStorageName  = 'localStorage',
        globalStorageName = 'globalStorage',
        sessionStorageName= 'sessionStorage',
        storage;

    api.set    = function (key, value) {};
    api.get    = function (key)        {};
    api.remove = function (key)        {};
    api.clear  = function ()           {};

    function setVal(val){
        var vall = JSON.stringify(val);
        return encodeURIComponent(vall);
    }
    function getVal(val){
        var vall = decodeURIComponent(val);
        return JSON.parse(vall);
    }
    if(sessionStorageName in win && win[sessionStorageName]){
        storage    = win[sessionStorageName];
        api.set    = function (key, val) {var vall = setVal(val);storage.setItem(key, vall)};
        api.get    = function (key)      {var vall = storage.getItem(key);return getVal(vall);};
        api.remove = function (key)      {storage.removeItem(key)};
        api.clear  = function()          {storage.clear()};

    } else if (localStorageName in win && win[localStorageName]) {
        storage    = win[localStorageName];
        api.set    = function (key, val) {var vall = setVal(val);storage.setItem(key, vall)};
        api.get    = function (key)      {var vall = storage.getItem(key) ;return getVal(vall);};
        api.remove = function (key)      { storage.removeItem(key) };
        api.clear  = function ()         { storage.clear() };

    } else if (globalStorageName in win && win[globalStorageName]) {
        storage    = win[globalStorageName][win.location.hostname];
        api.set    = function (key, val) {var vall = setVal(val); storage[key] = vall };
        api.get    = function (key)      {var vall = storage[key] && storage[key].value ; return getVal(vall) };
        api.remove = function (key)      { delete storage[key] };
        api.clear  = function ()         { for (var key in storage ) { delete storage[key] } };

    } else if (doc.documentElement.addBehavior) {
        function getStorage() {
            if (storage) { return storage }
            storage = doc.body.appendChild(doc.createElement('div'));
            storage.style.display = 'none';
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }
        api.set = function (key, val) {
            var storage = getStorage();
            var vall = setVal(val);
            storage.setAttribute(key, vall);
            storage.save(localStorageName);
        };
        api.get = function (key) {
            var storage = getStorage();
            var vall = storage.getAttribute(key);
            return getVal(vall);;
        };
        api.remove = function (key) {
            var storage = getStorage();
            storage.removeAttribute(key);
            storage.save(localStorageName);
        };
        api.clear = function () {
            var storage = getStorage();
            var attributes = storage.XMLDocument.documentElement.attributes;
            storage.load(localStorageName);
            for (var i=0, attr; attr = attributes[i]; i++) {
                storage.removeAttribute(attr.name);
            }
            storage.save(localStorageName);
        }
    }
    return api;
})();

export {$cookie,$ajax,$session};