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
            v-model="myData.nickName"
            label="昵称"
            @blur="changeName()"
            input-align="right"
             @focus='qingn'
          />
        </div>
        <div class="desc clearf">
          <van-field
            v-model="myData.desc"
            rows="2"
            autosize
            label="个性签名："
            type="textarea"
            maxlength="25"
            placeholder=""
            show-word-limit
            @blur="formatter(myData.desc)"
             @focus='qinge'
          />
        </div>
      </div>
    </BgBox>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
export default {
  name: "Personal",
  components: {
    BgBox,
  },
  data() {
    return {
      //个人资料
      myData: "",
      // 简介
      message: "",
      userId: "",
      phone: "",
      ckname: "",
    };
  },
  created() {
    this.tokenString = localStorage.getItem("__tk");
    this.getMyData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //个人信息
    getMyData() {
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          tokenString: this.tokenString,
          appkey: this.appkey,
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          
          if (result.data.code == "B001") {
            
            
            if(result.data.result[0].desc=='undefined'|result.data.result[0].desc==''){
                result.data.result[0].desc= "编写我的个性签名";
            }

            this.myData = result.data.result[0];
            // 
          }
        })
        .catch((err) => {
          
        });
    },
    //修改昵称
    changeName() {
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        if(this.myData.nickName==''){
            this.getMyData()
            return this.$toast('您的名称为空')
        }
        this.axios({
        method: "POST",
        url: "/updateNickName",
        data: {
          tokenString: this.tokenString,
          appkey: this.appkey,
          nickName:this.myData.nickName
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          
         if(result.data.code=='C001'){
             this.$toast(result.data.msg)
         }
        })
        .catch((err) => {
          
        });
    },
    //个性签名
     formatter() {
        if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      
      if(this.myData.desc==""){
          this.myData.desc='编写我的个性签名'
            return this.$toast('您的个性签名为空')
        }

      if (this.myData.desc.length > 25) {
        this.$toast(`您的个性签名已超过25字节`);
      }
      this.axios({
        method: "POST",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          desc: this.descText,
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          this.$toast(result.data.msg)
          if(result.data.code=='D001'){
            this.$toast("修改个性签名成功")
          }
        })
        .catch((err) => {
          
        });
      // return value.replace(/\d/g, '');
    },
    qinge(){
      this.myData.desc='' 
    },
    qingn(){
      this.myData.nickName='' 
    }
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