export default {
    // 控制无权限的按钮隐藏
    btnAuth: {
      bind(el, binding, vnode) {
        let functioncode = el.getAttribute("functioncode"),
            data = binding.value;
            
        if(!data.find(item => item.functioncode == functioncode)){
          el.style.display = "none";
        }
      }
    }
  }