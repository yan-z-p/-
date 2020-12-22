<template>
  <div class="personal">
    <div class="personal-top">
      <van-nav-bar
        title="个人资料"
        left-text="返回"
        left-arrow
        @click-left="back"
      />
    </div>
    <BgBox>
      <div class="personal-content">
        <div class="user clearf">
          <div class="userion-left fl">头像</div>
          <div class="userion-right fr">
            <img :src="myData.userImg" />
          </div>
        </div>
        <div class="user clearf">
          <van-field
            v-model="myData.userId"
            label="用户id"
            input-align="right"
            readonly
          />
        </div>
        <div class="user clearf">
          <van-field
            v-model="myData.phone"
            label="手机号"
            input-align="right"
            readonly
          />
        </div>
        <div class="user clearf">
          <van-field
            v-model="userInfo.nickName"
            label="昵称"
            @blur="changeName(userInfo.nickName)"
            input-align="right"
            @focus="qingn(userInfo)"
          />
        </div>
        <div class="desc clearf">
          <van-field
            v-model="userInfo.desc"
            rows="2"
            autosize
            label="个性签名："
            type="textarea"
            maxlength="25"
            placeholder=""
            show-word-limit
            @blur="formatter(userInfo.desc)"
            @focus="qing(userInfo)"
          />
        </div>
      </div>
    </BgBox>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
import { mapState } from "vuex";
import { updateNickName, updateDesc } from "../api/my";
export default {
  name: "Personal",
  components: {
    BgBox,
  },
  data() {
    return {
      // 用户名副本
      nickName: "",
      // 个性签名副本
      desc: "",
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //修改昵称
    async changeName(nickName) {
      if (this.myData.nickName == "") {
        this.$store.commit("setuser", { key: "nickName", val: this.nickName });
        return this.$toast("您的用户名为空");
      }
      if (nickName.length > 16) {
        this.$store.commit("setuser", { key: "nickName", val: this.nickName });
        return this.$toast(`您的用户名已超过16字节`);
      }
      let res = await updateNickName(nickName);
      if (res.data.code == "C001") {
        this.$store.commit("setuser", { key: "nickName", val: nickName });
        this.$toast("修改用户名成功");
      } else {
        this.$store.commit("setuser", { key: "nickName", val: this.nickName });
        this.$toast("修改用户名失败");
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
    qing(userInfo) {
      this.desc = userInfo.desc;
      // // mydata.desc=''
      this.$store.commit("setuser", { key: "desc", val: "" });
    },
    qingn(userInfo) {
      this.nickName = userInfo.nickName;
      // // mydata.desc=''
      this.$store.commit("setuser", { key: "nickName", val: "" });
    },
  },
  computed: {
    ...mapState(["userInfo", "isLogin", "myData"]),
  },
};
</script>

<style lang="less" scoped>
.personal {
  background-color: #f5f5f5;
  min-height: 100%;
  .personal-content {
    padding: 10px;
  }
  .user {
    font-size: 14px;
    height: 55px;
    line-height: 55px;
    border-bottom: 1px #ddd solid;
  }
  .userion-right {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #666;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .van-cell {
    padding: 0;
    line-height: 55px;
  }
  /deep/.van-field__control {
    color: #999;
  }
  .desc {
    /deep/.van-cell {
      border: 1px solid #ddd;
      border-top: none;
    }
  }
}
</style>