<template>
  <div class="security">
    <div class="security-top">
      <van-nav-bar
        title="安全中心"
        left-text="返回"
        left-arrow
        @click-left="back"
      />
    </div>
    <BgBox>
      <div class="security-content">
        <van-cell title="修改密码" is-link @click="ChangePassword" />
        <van-cell title="注销账号" is-link @click="CancelAccount" />
        <!-- 底部弹出层 -->
        <van-popup
          v-model="show"
          position="bottom"
          :style="{ minHeight: '40%' }"
          closeable
        >
          <div class="cancelAccount">
            <van-form>
              <van-field
                v-model="oldPassword"
                :type="isOldPassword ? 'username' : 'password'"
                name="旧密码"
                label="旧密码："
                placeholder="请输入旧密码"
                autocomplete="off"
                :right-icon="isOldPassword ? 'eye-o' : 'closed-eye'"
                @click-right-icon="toOldPassword"
              />
              <van-field
                v-model="newPassword"
                :type="isNewPassWord ? 'username' : 'password'"
                name="新密码"
                label="新密码："
                placeholder="6-16位以字母开头的新密码"
                autocomplete="off"
                :right-icon="isNewPassWord ? 'eye-o' : 'closed-eye'"
                @click-right-icon="toNewPassword"
              />
            </van-form>
            <div class="chang-button">
              <van-button
                type="primary"
                block
                round
                @click="Change"
                color="#2566ca"
                >修改密码</van-button
              >
            </div>
          </div>
        </van-popup>
      </div>
    </BgBox>
  </div>
</template>

<script>
import { form, password } from "../assets/js/form";
import BgBox from "../components/BgBox.vue";
import { updatePassword,destroyAccount} from "../api/security.js";
import { getLocal } from "../utils/local";
// import {password} from '../assets/js/form.js';

export default {
  name: "Security",
  components: {
    BgBox,
  },
  data() {
    return {
      show: false,
      // 旧密码
      oldPassword: "",
      newPassword: "",
      isOldPassword: false,
      tokenString: "",

      isNewPassWord: false,
    };
  },
  created() {
    this.tokenString = localStorage.getItem("__tk");
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 修改密码
    ChangePassword() {
      this.show = true;
    },
    // 修改密码
    Change() {
      if (!getLocal()) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      if (this.oldPassword == "") {
        return this.$toast("请输入你的旧密码");
      } else if (this.newPassword == "") {
        return this.$toast("请输入你要修改的密码");
      }
      let o = {
        password: form.password(this.newPassword),
      };

      let isFt = form.valid(o);

      if (!isFt) {
        return;
      }

      this.$dialog
        .confirm({
          title: "修改密码",
          message: "是否修改密码",
          beforeClose: this.beforeClose,
          confirmButtonColor: "#2566CA",
        })
        .then(() => {
          if (isFt) {
            let data = {
              password: this.newPassword,
              oldPassword: this.oldPassword,
            };
            let res = Promise.all([updatePassword(data)]);

            res.then((result) => {
              console.log("password", result);
              if (result[0].data.code == "E003") {
                this.$toast("旧密码不正确，请从新输入");
                this.oldPassword = "";
              } else if (result[0].data.code == "E001") {
                this.$toast(result[0].data.msg);
                this.show = false;
              }
            });
          }
        })
        .catch(() => {
          this.$toast("取消操作");
        });
    },
    // 注销
    CancelAccount() {
      if (!!getLocal()) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "确认注销账号，一旦确认将无法恢复",
          beforeClose: this.beforeClose,
          confirmButtonColor: "#2566CA",
        })
        .then(() => {
          let res = Promise.all([destroyAccount(data)]);
          res.then((result) => {
            if (result[0].data.code == "F001") {
              this.$toast(result[0].data.msg);
              this.$router.push({ name: "Login" });
            }
          });
        })
        .catch(() => {
          this.$toast("取消操作");
        });
    },
    //密码框状态
    toOldPassword() {
      this.isOldPassword = !this.isOldPassword;
    },
    toNewPassword() {
      this.isNewPassWord = !this.isNewPassWord;
    },
  },
};
</script>

<style lang="less" scoped>
.security-content {
  padding-top: 10px;
}
.cancelAccount {
  padding-top: 55px;
}
.chang-button {
  margin-top: 30px;
}
</style>