<template>
  <div class="home">
    <!-- 顶部搜索 -->
    <div class="home-topbox">
      <van-nav-bar left-arrow fixed>
        <template #left>
          <div class="home-top-left">
            <div class="home-t-title">您好，</div>
            <div class="home-username">{{userInfo.nickName}} </div>
          </div>
        </template>

        <template #right>
          <van-search
            v-model="value"
            placeholder="请输入商品名称"
            shape="round"
            @focus="gosearch"
          />
        </template>
      </van-nav-bar>
    </div>
    <!-- 轮播 -->

    <div class="Swipe">
      <van-swipe class="my-swipe" indicator-color="#2566CA">
        <van-swipe-item v-for="(image, index) in bannerData" :key="index">
          <img v-lazy="image.bannerImg" @click="goDetail(image.pid)" />
          <div class="imgtext">{{ image.name }}</div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="content">
      <!-- 热卖推荐 -->
      <div class="hot">热卖推荐</div>
      <!-- 商品 -->
      <div class="shops clearf">
        <div
          class="shop fl"
          v-for="(v, i) in this.shopsData"
          :key="i"
          @click="goDetail(v.pid)"
        >
          <div class="shop-img">
            <img :src="v.smallImg" />
          </div>
          <div class="shop-con clearf">
            <div class="shop-title">{{ v.name }}</div>
            <p>{{ v.enname }}</p>
            <p class="price fr">￥{{ v.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/home.less";
import { banner, shopData } from "../api/home.js";
import { mapState } from 'vuex'
export default {
  name: "home",
  data() {
    return {
      value: "",
      // 轮播图数据
      bannerData: [],
      // 商品数据
      shopsData: {},
      // myData: "",
    };
  },
  created() {
    this.getBannerData();
    this.getShopData();
  },

  methods: {
    //拿到轮播图数据
    async getBannerData() {
      let patams = {
        appkey: this.appkey,
      };

      let res = await banner(patams);
      if (res.data.code == 300) {
        this.bannerData = res.data.result;
      } else {
        // 未能请求成功提示错误
        this.$toast(res.data.msg);
      }
    },
    //拿到商品数据
    async getShopData() {
      //正在加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      let res = await shopData();
      console.log("res==>",res)
      if (res.data.code == 500) {
        //取消正在加载提示
        this.$toast.clear();
        this.shopsData = res.data.result;
      } else {
        //取消正在加载提示
        this.$toast.clear();
        // 未能请求成功提示错误
        this.$toast(res.data.msg);
      }
    },
    //查看商品详情
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
    //搜索
    gosearch() {
      this.$router.push({ name: "Search" });
    },
  },
  computed:{
    ...mapState(["userInfo"])
    // userInfo(){
    //   // console.log( " this.$store.state.userInfo==>",this.$store.state)
    //   return this.$store.state.usermodule.userInfo
    // }
  },
};
</script>

<style>
</style>