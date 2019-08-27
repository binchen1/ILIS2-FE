// 递归获取所有页面id
function getAllIds(treeData){
    let ids = [];
    treeData.map(item=>{
        if(item.subFunctions && item.subFunctions.length !=0){
            ids = ids.concat(getAllIds(item.subFunctions));
        }else{
            ids.push(item.id);
        }
    });
    return ids;
}

export default function pageAuth(to, from, next, store){
    let { id, functionCode } = to.meta,
        { userFunctionTreeJson, userFunction } = store.state;
        
    // 判断页面是否有权限控制
    if(id){
        if(!userFunctionTreeJson){
            store.dispatch('getUserFunctionTreeJson').then(res => {
                let data = res.obj || [];
                if(getAllIds(data, id).indexOf(id) != -1){
                    // if(userFunction)
                    store.dispatch('getUserFunction', functionCode).then(() => {
                        next();
                    });
                }else{
                    next({ path: '/noAuth' })
                }
            })
        }else {
            (getAllIds(userFunctionTreeJson, id).indexOf(id) != -1) ? 
                next():
                next({ path: '/noAuth' });
        }
    }else {
        next()
    }
}