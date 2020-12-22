<template>
  <div class="Forgot">
    <!-- 顶部栏 -->
    <van-nav-bar>
      <template #left>
        <div class="top-left">
          <div class="logo"></div>
          <div class="top-left-text">众口尝</div>
        </div>
      </template>
      <template #right>
        <div class="top-right" @click="you">游客进入</div>
      </template>
    </van-nav-bar>
    <!-- 内容 -->
    <div class="main">
      <h1>忘记密码</h1>
      <p class="lg-title">forgot Password</p>
    </div>
    <div class="user">
      <van-form>
        <van-field
          v-model="userPassWord.phone"
          name="手机号"
          label="手机号"
          placeholder="你的手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userPassWord.password"
          :type="isEyeusername ? 'username' : 'password'"
          name="密码"
          label="新密码"
          placeholder="6-16位以字母开头的新密码"
          autocomplete="off"
          :right-icon="isEyeusername ? 'eye-o' : 'closed-eye'"
          @click-right-icon="togget"
        />

        <van-field
          v-model="userPassWord.email"
          name="邮箱"
          label="邮箱"
          placeholder="请输入你的邮箱"
          autocomplete="off"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              @click="verification"
              :disabled="disabled"
              >{{ timeovertext }}</van-button
            >
          </template>
        </van-field>

        <van-field
          v-model="userPassWord.yan"
          name="验证码"
          label="验证码"
          placeholder="请输入你的邮箱验证码"
          autocomplete="off"
        />
        <div style="margin: 35px 16px 0">
          <van-button round block type="default" @click="showPopup">
            修改为新密码
          </van-button>
        </div>
        <div class="nowlogin">
          <van-button round block type="default" size="mini" @click="gologin">
            已有密码，立即登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import "../assets/css/forgot.less";
import { form, password, phone, email } from "../assets/js/form";
import { checkValidCode } from "../api/forgot";

export default {
  name: "Forgot",
  data() {
    return {
      userPassWord: {
        phone: "",
        password: "",
        email: "",
        yan: "",
      },
      // 登录的eye show and hide or password and username
      isEyeusername: false,
      //验证时间，
      timeovertext: "发送验证码",
      disabled: false,
    };
  },

  methods: {
    togget() {
      this.isEyeusername = !this.isEyeusername;
    },

    async showPopup() {
      let o = {
        phone: form.phone(this.userPassWord.phone),
        password: form.password(this.userPassWord.password),
        email: form.email(this.userPassWord.email),
      };
      let isFt = form.valid(o);

      if (!isFt) {
        return;
      }

      if (this.userPassWord.yan == "") {
        return this.$toast("您的验证码为空");
      }

      // 验证邮箱验证码是否正确
      let too = false;

      //发起请求
      let res = await checkValidCode(this.userPassWord.yan);
      if (result.data.code == "K001") {
        //关闭加载提示
        this.$toast.clear();
        too = true;
      } else if (result.data.code == "K002") {
        this.$toast("您的验证码错误");
        //关闭加载提示
        this.$toast.clear();
      } else {
        //  关闭加载提示
        this.$toast.clear();
      }
      // this.axios({
      //   method: "POST",
      //   url: "/checkValidCode",
      //   data: data,
      // })
      //   .then((result) => {

      //     //关闭加载提示
      //     this.$toast.clear();
      //     if (result.data.code == "K001") {
      //       too = true;
      //     } else if (result.data.code == "K002") {
      //       this.$toast("您的验证码错误");
      //     }
      //   })
      //   .catch((err) => {

      //   });

      if (too) {
        //启动加载提示
        this.$toast.loading({
          //文本提示
          message: "加载中...",
          //禁止穿透点击
          forbidClick: true,
          //提示时间, 0: 没有时间限制
          duration: 0,
        });
        let userupdata = {
          phone: this.userPassWord.phone,
          password: this.userPassWord.password,
        };
        //发起请求
        let res2 = await retrievePassword(userupdata);
        //关闭加载提示
        this.$toast.clear();
        // //发起请求
        // this.axios({
        //   method: "POST",
        //   url: "/retrievePassword",
        //   data: userupdata,
        // })
        //   .then((result) => {
        //     //
        //     //关闭加载提示
        //     this.$toast.clear();
        //   })
        //   .catch((err) => {});
      }
    },
    //已有账号
    gologin() {
      this.$router.push({ name: "Login" });
    },
    //游客进入
    you() {
      this.$router.push({ name: "Home" });
    },
    //获取验证码
    verification() {
      let k = {
        email: form.email(this.userPassWord.email),
      };

      let isFt = form.valid(k);
      if (!isFt) {
        return;
      }

      let timer = null;
      let num = 90;
      clearInterval(timer);
      timer = setInterval(() => {
        this.disabled = true;
        if (num < 10) {
          num = "0" + num;
        }
        this.timeovertext = `${num}秒后重新发送验证码`;

        if (num < 1) {
          this.disabled = false;
          this.timeovertext = `发送验证码`;
          clearInterval(timer);
        }
        num--;
      }, 1000);

      if (isFt) {
        let forgotdata = {
          appkey: this.appkey,
          email: this.userPassWord.eMail,
        };

        //发起请求
        this.axios({
          method: "POST",
          url: "/emailValidCode",
          data: forgotdata,
        })
          .then((result) => {})
          .catch((err) => {});
      }
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
</style>

