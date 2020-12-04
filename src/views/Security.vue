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
import { form } from "../assets/js/form";
import BgBox from "../components/BgBox.vue";

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
      if (!this.tokenString) {
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
        password: {
          value: this.newPassword,
          msg: "你的密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
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
            this.axios({
              method: "POST",
              url: "/updatePassword",
              data: {
                appkey: this.appkey,
                tokenString: this.tokenString,
                password: this.newPassword,
                oldPassword: this.oldPassword,
              },
            })
              .then((result) => {
                if (result.data.code == 700) {
                  //token检验无效,则跳到登录页面
                  this.$toast("token检验无效");
                  return this.$router.push({ name: "Login" });
                }

                if (result.data.code == "E003") {
                  this.$toast("旧密码不正确，请从新输入");
                  this.newPassword = "";
                } else if (result.data.code == "E001") {
                  this.$toast(result.data.msg);
                  this.show = false;
                }
              })
              .catch((err) => {
                
              });
          }
        })
        .catch(() => {
          this.$toast("取消操作");
        });
    },
    // 注销
    CancelAccount() {
      if (!this.tokenString) {
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
          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString: this.tokenString,
            },
          })
            .then((result) => {
              if (result.data.code == 700) {
                //token检验无效,则跳到登录页面
                this.$toast("token检验无效");
                return this.$router.push({ name: "Login" });
              }
              if (result.data.code == "F001") {
                this.$toast(result.data.msg);

                this.$router.push({ name: "Login" });
              }
            })
            .catch((err) => {
              
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