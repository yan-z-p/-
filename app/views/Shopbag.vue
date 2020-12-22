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
import {
  findAllShopcart,
  modifyShopcartCount,
  deleteShopcart,
} from "../api/shopbag";
import { getLocal } from "../utils/local";
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
      //按钮状态
      disabled: true,
    };
  },
  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },
    //购物袋数据
    async getShopData() {
      if (!getLocal()) {
        //未登录
        return this.$toast("请先登录");
        // return this.$router.push({ name: "Login" });
      }
      //正在加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      let res = await findAllShopcart();

      if (res.data.code == 5000) {
        //取消正在加载提示
        this.$toast.clear();
        //添加复选框状态
        res.data.result.map((v) => {
          v.inChenked = false;
        });

        if (res.data.result.length != 0) {
          this.isshop = false;
        }
        this.shopData = res.data.result;
      } else {
        //取消正在加载提示
        this.$toast.clear();
        // 请求未成功，提示错误
        this.$toast(res.data.msg);
      }
    },
    //提交订单
    onSubmit() {
      //
      if (!getLocal()) {
        //未登录
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let params = [];
      this.shopData.map((v) => {
        //
        if (v.inChenked) {
          params.push(v.sid);
        }
      });
      params = params.join("+");

      if (params != "") {
        this.$router.push({ name: "Pay", params: { sids: params } });
      }
    },
    //逛一逛
    gohome() {
      this.$router.push({ name: "Home" });
    },
    // 商品数量加
    async eone(sid, count) {
      count++;
      let data = {
        sid,
        count,
      };
      let res = await modifyShopcartCount(data);
    },
    // 商品数减少
    async aone(sid, count) {
      count--;
      let data = {
        sid,
        count,
      };
      let res = await modifyShopcartCount(data);
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
    async del(sid, index) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      let res = await deleteShopcart(JSON.stringify([sid]));
      console.log("res", res);
      if (res.data.code == 7000) {
        //关闭提示
        this.$toast.clear();
        this.$toast("删除成功");
        this.shopData.splice(index, 1);

        //判断购物车是否为空
        if (this.shopData.length == 0) {
          this.isshop = true;
        }
      } else {
        //关闭提示
        this.$toast.clear();
        // 请求未成功，提示错误
        this.$toast(res.data.msg);
      }
    },
    //编辑/
    edit() {
      this.delor = !this.delor;
    },
    //删除选定的商品
    async delAll() {
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
      let res = await deleteShopcart(JSON.stringify(sids));
      if (res.data.code == 7000) {
        //关闭提示
        this.$toast.clear();
        //删除选定商品
        for (let i = 0; i < this.shopData.length; i++) {
          if (this.shopData[i].inChenked) {
            this.shopData.splice(i, 1);
            i--;
          }
        }
        this.$toast("删除成功");
        //判断购物车是否为空
        if (this.shopData.length == 0) {
          this.isshop = true;
        }
      } else {
        //关闭提示
        this.$toast.clear();
        // 请求未成功，提示错误
        this.$toast(res.data.msg);
      }
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