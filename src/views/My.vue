<template>
  <div class="my">
    <!-- 照片 -->
    <div class="my-box">
      <img :src="myData.userBg" />
      <van-uploader :after-read="afterRead"  v-if='isLogin'/>
    </div>
    <div class="my-info">
      <div class="info-top clearf">
        <div class="my-img fl">
          <img :src="myData.userImg" />
          <!-- <div style="width:80px; height:80px; position:absolute; top:0;"> -->
          <van-uploader :after-read="userImgupdata" v-if='isLogin' />
          <!-- </div> -->
        </div>
        <div class="my-title fl">
          <p class="my-name">{{ myData.nickName }}</p>
          <!-- <p class="p-s">{{myData.desc==''? "编写我的个性签名":myData.desc}}</p> -->
          <div class="p-s fl">
            <van-field v-model="myData.desc" @blur="formatter" right-icon="edit" v-if='isLogin' @focus='qing'/>
          </div>
        </div>
      </div>

      <!--  -->
      <div class="cell">
        <van-cell
          :title="item.title"
          is-link
          v-for="(item, index) in setData"
          :key="index"
          @click="goset(item.name)"
        />
        <div class="sign-out-button">
          <van-button type="primary" block round @click="LogOut" color="#2566ca"
            >{{isLogin?'退出登录':"马上登录"}}</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/my.less";
export default {
  name: "my",
  data() {
    return {
      myData: {},
      tokenString: "",
      setData: [
        { title: "个人资料", name: "Personal" },
        { title: "我的订单", name: "Order" },
        { title: "我的收藏", name: "Collection" },
        { title: "管理地址", name: "Address" },
        { title: "安全中心", name: "Security" },
      ],
      // 是否登录
      isLogin:false
    };
  },
  created() {
    this.getmyData();
  },
  methods: {
    //我的背景
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      

      let fileType = file.file.type.split("/")[1];
      let fileSize = file.file.size / 1024 / 1024;

      
      
      let type = ["png", "jepg",'jpg'];
      // data:image/png;base64,
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      
      if (type.indexOf(fileType) === -1) {
        this.$toast(`请上传${type.join("、")}类型文件`);
        return;
      }
      if (fileSize > 1) {
        this.$toast(`请上传小于1M的文件`);
        return;
      }else if(type.indexOf('png')>-1){
          if(fileSize>=0.7){
            this.$toast(`png仅支持700k以下的图片`);
          }
      }
      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          
           if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          if (result.data.code == "I001") {
            this.$toast(result.data.msg);
            this.getmyData();
          }
        })
        .catch((err) => {
          
        });
    },
    // 头像
    userImgupdata(file) {
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
      }else if(type.indexOf('png')>-1){
          if(fileSize>=0.7){
            this.$toast(`png仅支持700k以下的图片`);
          }
      }
      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          
           if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          if (result.data.code == "H001") {
            this.$toast(result.data.msg);
            this.getmyData();
          }
        })
        .catch((err) => {
          
        });
    },
    //个性签名
    formatter(value) {
       if(this.myData.desc==""){
          this.myData.desc='编写我的个性签名'
            return this.$toast('您的个性签名为空')
        }
      

      if (this.myData.length > 25) {
        return this.$toast(`您的个性签名已超过25字节`);
      }
      this.axios({
        method: "POST",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          desc: this.myData.desc,
        },
      })
        .then((result) => {
           if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          
          if(result.data.code=='D001'){
            // 
            this.$toast("修改个性签名成功")
          }
        })
        .catch((err) => {
          
        });
      // return value.replace(/\d/g, '');
    },

    //获取我的信息
    getmyData() {
      //获取tokenString
      this.tokenString = localStorage.getItem("__tk");

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          tokenString: this.tokenString,
          appkey: this.appkey,
        },
      })
        .then((result) => {
          
          
          if (result.data.code == "A001") {
            if(result.data.result[0].desc=='undefined'|result.data.result[0].desc==''){
                result.data.result[0].desc= "编写我的个性签名";
            }
            this.isLogin=true
            this.myData = result.data.result[0];
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 内容跳转
    goset(name) {
      this.$router.push({ name: name });
    },
    LogOut() {
      if(!this.isLogin){
        return this.$router.push({name:'Login'})
      }
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否退出登录",
          beforeClose: this.beforeClose,
          confirmButtonColor: "#2566CA",
        })
        .then(() => {
          this.$router.push({ name: "Login" });
          this.axios({
            method: "POST",
            url: "/logout",
            data: {
              appkey: this.appkey,
              tokenString: this.tokenString,
            },
          })
            .then((result) => {
              
              if (result.data.code == "F001") {
                // this.$toast(result.data.msg)
              }
            })
            .catch((err) => {
              
            });
        })
        .catch(() => {
          this.$toast("取消操作");
        });
    },
    qing(){
      this.myData.desc=''
    }
  },
};
</script>

<style>
</style>