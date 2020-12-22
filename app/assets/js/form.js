import Vue from 'vue'

//导入提示组件
import { Toast } from 'vant'

//注册提示组件
Vue.use(Toast)

//表单验证模块
class ValidForm {

    constructor() {}

  //验证表单方法
    valid(o) {
    //o: 表单验证数据， object
    // 
    // 

    for (let key in o) {
        if (!o[key].reg.test(o[key].value)) {
        //提示错误信息
        Toast(o[key].msg);
        //表单验证不通过
        return false;
        }
    }

    //表单验证通过
    return true;
    }
    
    phone(phone){
      return {
        value:phone,
        msg:'你的号码格式不正确',
        reg:/^1[3-9]\d{9}$/
      }
    }
    password(password){
      return {
        value:password,
        msg:'你的密码格式不正确',
        reg:/^[A-Za-z]\w{5,15}$/
      }
    }
    nickName(nickName){
      return {
        value:nickName,
        msg:'你的昵称格式不正确',
        reg:/^[\w\u4e00-\u9fa5]{1,10}$/
      }
    }
    email(email){
      return {
        value:email,
        msg: "你的邮箱格式不正确",
        reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,       
      }
    }
    //图片验证
    validImg(file){
      let fileType = file.file.type.split("/")[1];
      let fileSize = file.file.size / 1024 / 1024;

      let type = ["png", "jepg"];
      // data:image/png;base64,
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      if (type.indexOf(fileType) === -1) {
        this.$toast(`请上传${type.join("、")}类型文件`);
        return;
      }
      if (fileSize > 1) {
        this.$toast(`请上传小于1M的文件`);
        return;
      } else if (type.indexOf("png") > -1) {
        if (fileSize >= 0.7) {
          this.$toast(`png仅支持700k以下的图片`);
        }
      }

      return{
        fileType,
        base64
      }
    }

    // 订单处理
    setorder(data){
      //数据分类
      let orderData = {};
      let arr = [];
      data.map((v) => {
        //数据未存在
        let o = {};
        let isre = false;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].oid == v.oid) {
            isre = true;
            arr[i].count += v.count;
            arr[i].shopper += v.count * v.price;
            arr[i].data.push(v);
            break;
          }
        }
        //初始化
        if (!isre) {
          o.oid = v.oid;
          o.time = v.createdAt;
          o.count = v.count;
          o.shopper = v.count * v.price;
          o.status = v.status;
          o.oid = v.oid;
          o.data = [v];
          isre = false;
        }
        if (Object.keys(o).length !== 0) {
          arr.push(o);
        }
      });

      return arr.reverse();
    }
    


}

//导出表单验证模块实例
export const form = new ValidForm();