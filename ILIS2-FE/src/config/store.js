import ajax from "@common/ajax";
import api from "@common/api";
import qs from 'qs';

// 页面权限store
const store = {
    state: {
        // 页面权限
        userFunctionTreeJson: "",
        // 页面功能权限
        userFunction: ""
    },
    getters: {
        getUserFunctionTreeJson(state){
            return state.userFunctionTreeJson;
        }
    },
    mutations:{
        getUserFunctionTreeJson(state ,data){
            state.userFunctionTreeJson = data;
        },
        getUserFunction(state ,data){
            state.userFunction = data;
        }
    },
    actions:{
        // 获取用户页面权限
        getUserFunctionTreeJson(context){
            return new Promise((resolve, reject)=>{
                ajax({
                    url: api.common.getUserFunctionTreeJson,
                    method: "POST",
                    data: {
                        functionType: 0
                    }
                }).then(res => {
                    context.commit("getUserFunctionTreeJson", res.obj);
                    resolve(res);
                }).catch(error => {
                    reject(error);
                    console.log(error, "error")
                });
             });
        },
        // 获取用户页面功能权限
        getUserFunction(context, functionCode){
            return new Promise((resolve, reject)=>{
                let data = qs.stringify({ functionCode });
                ajax({
                    url: api.common.getUserFunctionByCode,
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data
                }).then(res => {
                    context.commit("getUserFunction", res.obj);
                    resolve(res);
                }).catch(error => {
                    reject(error);
                    console.log(error, "error")
                });
            });
        }
    }
}

export default store;