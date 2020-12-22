<template>
  <div class="my">
    <!-- 照片 -->
    <div class="my-box">
      <img :src="userInfo.userBg" />
      <van-uploader :after-read="afterRead" v-if="isLogin" />
    </div>
    <div class="my-info">
      <div class="info-top clearf">
        <div class="my-img fl">
          <img :src="userInfo.userImg" />
          <!-- <div style="width:80px; height:80px; position:absolute; top:0;"> -->
          <van-uploader :after-read="userImgupdata" v-if="isLogin" />
          <!-- </div> -->
        </div>
        <div class="my-title fl">
          <p class="my-name">{{ userInfo.nickName }}</p>
          <!-- <p class="p-s">{{myData.desc==''? "编写我的个性签名":myData.desc}}</p> -->
          <div class="p-s fl">
            <van-field
              v-model="userInfo.desc"
              @blur="formatter(userInfo.desc)"
              right-icon="edit"
              v-if="isLogin"
              @focus="qing(userInfo)"
            />
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
          @click="goset(item.name, isLogin)"
        />
        <div class="sign-out-button">
          <van-button
            type="primary"
            block
            round
            @click="LogOut(isLogin)"
            color="#2566ca"
            >{{ isLogin ? "退出登录" : "马上登录" }}</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/my.less";
import {
  updateUserBg,
  updateAvatar,
  updateDesc,
  getmy,
  logout,
} from "../api/my";
import { mapState } from "vuex";
import { form } from "../assets/js/form";
import { removeLocal } from "../utils/local";
export default {
  name: "my",
  data() {
    return {
      setData: [
        { title: "个人资料", name: "Personal" },
        { title: "我的订单", name: "Order" },
        { title: "我的收藏", name: "Collection" },
        { title: "管理地址", name: "Address" },
        { title: "安全中心", name: "Security" },
      ],
      // 个性签名副本
      desc: "",
    };
  },
  methods: {
    //我的背景
    async afterRead(file) {
      let o = form.validImg(file);

      let data = {
        imgType: o.fileType,
        serverBase64Img: o.base64,
      };
      //背景上传
      let res = await updateUserBg(data);
      if (res.data.code == "I001") {
        this.$toast(res.data.msg);
        this.getmyData();
      } else {
        this.$toast("上传失败");
      }
    },
    // 头像
    async userImgupdata(file) {
      let o = form.validImg(file);
      let data = {
        imgType: o.fileType,
        serverBase64Img: o.base64,
      };
      //头像上传
      let res = await updateAvatar(data);
      if (res.data.code == "H001") {
        this.$toast(res.data.msg);
        this.getmyData();
      } else {
        this.$toast("上传失败");
      }
    },
    //个性签名
    async formatter(desc) {
      if (desc == "") {
        this.$store.commit("setuser", { key: "desc", val: this.desc });
        return this.$toast("您的个性签名为空");
      }
      if (desc.length > 25) {
        this.$store.commit("setuser", { key: "desc", val: this.desc });
        return this.$toast(`您的个性签名已超过25字节`);
      }
      // console.log(desc.length);
      let res = await updateDesc(desc);
      if (res.data.code == "D001") {
        this.$store.commit("setuser", { key: "desc", val: desc });
        this.$toast("修改个性签名成功");
      } else {
        this.$store.commit("setuser", { key: "desc", val: this.desc });
        this.$toast("修改个性签名失败");
      }
    },

    //获取我的信息
    async getmyData() {
      //获取我的信息
      let res2 = await getmy();
      if (res2.data.code == "A001") {
        if (res2.data.result[0].desc == "") {
          res2.data.result[0].desc = "编辑我的个性签名";
        }

        this.$store.commit("setuserInfoData", res2.data.result[0]);
      } else {
        // 未能请求成功提示错误
        this.$toast(res2.data.msg);
      }
    },
    // 内容跳转
    goset(name, isLogin) {
      if (!isLogin) {
        return this.$toast("请先登录");
      }
      this.$router.push({ name: name });
    },
    LogOut(isLogin) {
      if (!isLogin) {
        return this.$router.push({ name: "Login" });
      }

      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否退出登录",
          beforeClose: this.beforeClose,
          confirmButtonColor: "#2566CA",
        })
        .then(() => {
          // 退出登录
          // let res = await logout() //与提示框冲突
          let res = Promise.all([logout()]);
          res.then((result) => {
            if (result[0].data.code == "F001") {
              this.$store.commit("setisLoginStatus", false);
              this.$store.commit("setuserInfoData", "");
              removeLocal();
              this.$router.push({ name: "Login" });
            }
          });
        })
        .catch(() => {
          this.$toast("取消操作");
        });
    },
    qing(userInfo) {
      console.log(userInfo);
      this.desc = userInfo.desc;
      // // mydata.desc=''
      this.$store.commit("setuser", { key: "desc", val: "" });
    },
  },
  computed: {
    ...mapState(["userInfo", "isLogin"]),
  },
};
</script>
