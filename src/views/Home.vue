<template>
  <div class="home">
    <!-- 顶部搜索 -->
    <div class="home-topbox">
      <van-nav-bar left-arrow fixed>
        <template #left>
          <div class="home-top-left">
            <div class="home-t-title">您好，</div>
            <div class="home-username">{{ myData.nickName }}</div>
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
export default {
  name: "home",
  data() {
    return {
      value: "",

      // 轮播图数据
      bannerData: [],

      // 商品数据
      shopsData: {},
      myData: "",
    };
  },
  created() {
    this.getBannerData();
    this.getShopData();
    this.getmyData();
  },
  methods: {
    //拿到轮播图数据
    getBannerData() {
      // axios请求

      this.axios({
        method: "GET",

        url: "/banner",

        //请求参数
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          // 

          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          
        });
    },
    //拿到商品数据
    getShopData() {
      //正在加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          //取消正在加载提示
          this.$toast.clear();
          if (result.data.code == 500) {
            this.shopsData = result.data.result;
          }
          // 
        })
        .catch((err) => {
          
        });
    },
    //查看商品详情
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
      // 
    },
    // 搜索
    //搜索
    gosearch() {
      this.$router.push({ name: "Search" });
    },
    getmyData() {
      //获取tokenString
      this.tokenString = localStorage.getItem("__tk");
      if (!this.tokenString) {
        return;
      }
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
            this.myData = result.data.result[0];
          }
        })
        .catch((err) => {
          
        });
    },
  },
};
</script>

<style>
</style>