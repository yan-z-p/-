<template>
  <div class="shopbag">
    <!-- 顶部 -->
    <div class="shopbag-top">
      <van-nav-bar
        title="购物袋"
        :right-text="isshop ? '' : delor ? '完成' : '编辑'"
        fixed
        
        @click-right="edit"
      />
    </div>
    <!-- 空购物袋 -->
    <div class="kong" v-if="isshop">
      <van-empty description="你的购物袋是空的！">
        <van-button round type="danger" class="bottom-button" @click="gohome">
          先去逛一逛
        </van-button>
      </van-empty>
    </div>

    <!-- 非空购物袋 -->
    <div class="rmbbag" v-if="!isshop">
      <img class="top-img" :src="require('../assets/image/shopbag_bg.png')" />
      <!-- 商品 -->
      <div class="shop-content">
        <!-- 懒加载购物带 -->
        <!-- <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          
        > -->
        <div
          class="ab"
          style="margin: 10px"
          v-for="(item, index) in shopData"
          :key="item.sid"
        >
          <van-swipe-cell :disabled="!delor">
            <!-- 清除浮动 -->
            <div class="clearf">
              <div class="check fl">
                <!-- 选择框 -->
                <van-checkbox
                  v-model="item.inChenked"
                  @click="onecheck"
                ></van-checkbox>
              </div>
              <!-- 照片 -->
              <div class="fl" style="padding: 10px; display: inline-block">
                <img :src="item.small_img" />
              </div>
              <div class="ab-title fl">
                <ul class="clearf">
                  <p class="ab-bold fl">{{ item.name }}</p>
                  <span class="rule fl">{{ item.rule }}</span>
                </ul>
                <span class="enname fl">{{ item.enname }}</span>

                <div class="money">￥{{ item.price }}</div>
              </div>
              <!-- 数量 -->
              <div class="num">
                <van-stepper
                  v-model="item.count"
                  theme="round"
                  button-size="22"
                  @plus="eone(item.sid, item.count)"
                  @minus="aone(item.sid, item.count)"
                  disable-input
                />
              </div>
            </div>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="del(item.sid, index)"
              />
            </template>
          </van-swipe-cell>
        </div>
        <!-- </van-list> -->
      </div>

      <!-- 提交/删除 -->
      <div class="and">
        <!-- 提交 -->
        <van-submit-bar
          v-if="!delor"
          :price="shopPrice"
          button-text="提交订单"
          @submit="onSubmit"
          :disabled="disabled"
        >
          <van-checkbox v-model="checked" @click="allcheck">全选</van-checkbox>
        </van-submit-bar>
        <!-- 删除 -->
        <van-submit-bar
          v-if="delor"
          button-text="删除选定"
          @submit="delAll"
          :disabled="disabled"
        >
          <van-checkbox v-model="checked" @click="allcheck">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/shopbag.less";
export default {
  name: "shopbag",
  data() {
    return {
      //购物袋中是否为空
      isshop: true,
      // 商品数据
      shopData: [],
      tokenString: "",
      //全选
      checked: false,
      //提交/删除
      delor: false,
      //懒加载
      loading: false,
      finished: false,
      //懒加载的数据
      onLoadData: [],
      disabled: true,
    };
  },
  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },
    //购物袋数据
    getShopData() {
      this.tokenString = localStorage.getItem("__tk");

      if (!this.tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      // 
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString: this.tokenString,
        },
      })
        .then((result) => {
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 

          if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.inChenked = false;
            });

            if (result.data.result.length != 0) {
              this.isshop = false;
            }
            //购物袋全部数据
            this.shopData = result.data.result;

            // this.onLoadData= this.shopData.splice(0,8)
          } else {
            this.$toast("tokenString错误,请重新登录");
          }
        })
        .catch((err) => {
          
        });
    },
    //提交订单
    onSubmit() {
      // 
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      let params = [];
      this.shopData.map((v) => {
        // 
        if (v.inChenked) {
          params.push(v.sid);
        }
      
      });
        params=params.join("+")
      
      if (params != "") {
        this.$router.push({ name: "Pay", params: {sids: params } });
      }
    },
    //逛一逛
    gohome() {
      this.$router.push({ name: "Home" });
    },
    // 商品数量加
    eone(sid, count) {
      count++;
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          count: count,
          sid: sid,
          appkey: this.appkey,
          tokenString: this.tokenString,
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          if (result.data.code == 6000) {
          } 
        })
        .catch((err) => {
          
        });
    },
    // 商品数减少
    aone(sid, count) {
      count--;
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          count: count,
          sid: sid,
          appkey: this.appkey,
          tokenString: this.tokenString,
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          // 
          if (result.data.code == 6000) {
          } 
        })
        .catch((err) => {
          
        });
    },
    // 全选
    allcheck() {
      if (this.checked) {
        this.shopData.map((v) => {
          v.inChenked = true;
        });
        this.disabled = false;
      } else {
        this.shopData.map((v) => {
          v.inChenked = false;
        });
        this.disabled = true;
      }
    },
    //单选/按钮禁用
    onecheck() {
      let boo = this.shopData.every((v) => {
        if (v.inChenked == true) {
          return true;
        }
      });
      let disabled = this.shopData.some((item) => {
        if (item.inChenked == true) {
          return true;
        }
      });
      this.disabled = !disabled;
      this.checked = boo;
    },
    //单个删除
    del(sid, index) {
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((result) => {
         
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 

          if (result.data.code == 7000) {
            this.$toast("删除成功");
            this.shopData.splice(index, 1);
          }
          if (this.shopData.length == 0) {
            this.isshop = true;
          }
        })
        .catch((err) => {
          
        });
    },
    //编辑/
    edit() {
      this.delor = !this.delor;
    },
    //删除选定的商品
    delAll() {
      let sids = [];
      this.shopData.map((v, index) => {
        if (v.inChenked) {
          sids.push(v.sid);
        }
      });
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          if (result.data.code == 7000) {
            this.$toast("删除成功");

            for (let i = 0; i < this.shopData.length; i++) {
              if (this.shopData[i].inChenked) {
                this.shopData.splice(i, 1);
                i--;
              }
            }
            //购物车为空
            if (this.shopData.length == 0) {
              this.isshop = true;
            }
          } 
        })
        .catch((err) => {
          
        });
    },
    //懒加载
    onLoad() {
      

      //开始截取的下标
      // let onindex=0;
      // let jiequ=8
      // this.onLoadData= this.shopData.splice(onindex,onindex+jiequ)
      // // this.onLoadData.push(lan);
      // 
      // 
      // if(this.shopData.length<8){
      //   // this.finished=true
      // }
    },
  },
  created() {
    //购物袋数据
    this.getShopData();
  },
  //添加计算属性
  computed: {
    //计算总价
    shopPrice() {
      let num = 0;
      this.shopData.map((v) => {
        if (v.inChenked) {
          num += v.price * v.count;
        }
      });
      return num * 100;
    },
  },
};
</script>

<style>
</style>