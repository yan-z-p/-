<template>
  <div class="detail">
    <div class="detail-top-box">
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        fixed
        @click-left="back"
      />
    </div>
    <!-- 规格 -->
    <div class="detail-content">
      <img :src="deraildata.large_img" />
      <div class="shop-content clearf">
        <div
          class="choice clearf"
          v-for="(cho, indcho) in choice"
          :key="indcho"
        >
          <div class="title fl">{{ cho.title }}</div>
          <div
            class="title-con fl"
            v-for="(set, indset) in cho.set"
            :key="indset"
            :class="cho.isActive == indset ? 'active' : ''"
            @click="too(cho, indset)"
          >
            {{ set }}
          </div>
        </div>

        <!-- 分割线 -->
        <div class="detail-fen"></div>
        <!-- 商品描述 -->
        <div class="miao">
          <h3>商品描述</h3>
          <p v-for="(item, index) in deraildata.desc" :key="index">
            {{ index + 1 + "、" }}{{ item }}
          </p>
        </div>
        <div class="detail-fen"></div>

        <div class="peir">
          <div class="detail-rmb fl">￥28.00</div>
          <div class="fr">
            <van-stepper
              v-model="shopnum"
              theme="round"
              button-size="22"
              disable-input
            />
          </div>
        </div>

        <van-goods-action>
          <van-goods-action-icon
            icon="bag"
            text="购物袋"
            :badge="shopbagnum"
            :color="!!shopbagnum ? ' #2566CA' : '#323233'"
            @click="goshopbag(isLogin)"
          />
          <van-goods-action-icon
            icon="like"
            :color="islike ? ' #2566CA' : '#323233'"
            :text="islike ? '已收藏' : '收藏'"
            @click="like(isLogin)"
          />
          <van-goods-action-button
            type="warning"
            text="加入购物袋"
            color="#6A91EC"
            @click="shopcar(isLogin)"
          />
          <van-goods-action-button
            type="danger"
            text="立即购买"
            color="#2566CA"
            @click="pay"
          />
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/detail.less";

import { detail,
            like, 
            notlike,
            findlike,
            addShopcart,
            findAllShopcart,

        } from "../api/detail.js";

import {getLocal} from "../utils/local.js"
export default {
  name: "Detail",

  data() {
    return {
      // 登录状态
      // isLogin:"",
      //商品数量
      shopnum: "1",
      //徽章
      shopbagnum: "",
      //商品数据
      deraildata: {},
      //规格
      choice: [],
      // 收藏的样式，
      islike: false,
      // 当前商品规格
      choiceX: [],
      // 立即购买
      isNow: true,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 商品详情
    async detaildata() {
      //商品pid
      let params = {
        pid: this.$route.params.pid,
      };
      console.log(params);
      let res = await detail(params);

      console.log("pid res==>", res);
      if (res.data.code == 600) {
        //处理数据(商品描述)
        let data = res.data.result[0];
        data.desc = data.desc.split(/[\n]/);
        //处理数据(商品选择)
        let a = [];
        let xuan = ["tem", "sugar", "milk", "cream"];

        xuan.map((v) => {
          let ze = {};
          ze.title = data[v + "_desc"];
          ze.isActive = 0;
          ze.set = "";
          if (data[v] != "") {
            ze.set = data[v].split("/");
            //拿到默认商品规格
            a.push(ze.set[ze.isActive]);
            this.choice.push(ze);
          }
        });

        this.choiceX = a.join("/");
        this.deraildata = data;
      } else {
        // 请求未成功，提示错误
        this.$toast(res.data.msg);
      }
    },
    // 点击高亮
    too(cho, index) {
      cho.isActive = index;

      let c = [];
      this.choice.map((v) => {
        c.push(v.set[v.isActive]);
      });
      c = c.join("/");
      this.choiceX = c;
    },
    //商品收藏或取消
    async like(isLogin) {
      //isLogin登录状态
      //   console.log(isLogin);

      if (!isLogin) {
        //未登录
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      //商品pid
      let data = {
        pid: this.$route.params.pid,
      };

      //正在加载提示
      this.$toast.loading({
        message: "处理中...",
        forbidClick: false,
        duration: 0,
      });

      if (!this.islike) {
        //收藏
        let res = await like(data);
        if (res.data.code == 800) {
          //取消正在加载提示
          this.$toast.clear();
          this.$toast("收藏成功");
          this.islike = true;
        } else {
          // 请求未成功，提示错误
          this.$toast(res.data.msg);
        }
      } else if (this.islike) {
        //取消收藏
        let res2 = await notlike(data);
        if (res2.data.code == 900) {
          //取消正在加载提示
          this.$toast.clear();
          this.$toast("取消收藏成功");
          this.islike = false;
        } else {
          // 请求未成功，提示错误
          this.$toast(res2.data.msg);
        }
      }
    },
    //查询是否已经收藏
    async istoo() {
        //商品pid
      let params = {
        pid: this.$route.params.pid,
      };
      if (!getLocal()) {
        return;
      }
        // 查询是否收藏
       let res = await findlike(params);
        if (res.data.code == 1000) {
            //取消正在加载提示
            this.$toast.clear();
            
            if (res.data.result.length > 0) {
                this.islike = true;
            }
        } else {
          // 请求未成功，提示错误
          this.$toast(res.data.msg);
        }
    },
    //加入购物车
    async shopcar(isLogin,buy) {

         if (!isLogin) {
        //未登录
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
        // 商品数据
        let data = {
        pid: this.$route.params.pid,
        count: this.shopnum,
        rule: this.choiceX,
      };
        let res = await addShopcart(data);

        if (res.data.code == 3000) {
            if (buy) {
              this.$toast("正在前往购买");
              return this.$router.push({
                name: "Pay",
                params: { sids: res.data.sid },
              });
            }
            this.$toast("加入购物车成功");
            this.shopnum = 1;

            if (res.data.status != 0) {
              this.shopbagnum++;
            }
          } else {
          // 请求未成功，提示错误
          this.$toast(res.data.msg);
        }
        
    },
    goshopbag(isLogin) {
        if (!isLogin) {
        //未登录
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$router.push({ name: "Shopbag" });
    },
    //立即购买
    pay() {

      let buy = true;
      this.shopcar(buy,buy);
      // buy=false
    },
    //购物车条数
    async shopcount(){

      if (!getLocal()) {
        return;
      }
        let res = await findAllShopcart()
        if(res.data.code == 5000){
            this.shopbagnum = res.data.result.length;
        }else {
          // 请求未成功，提示错误
          this.$toast(res.data.msg);
        }
    }
  },
  created() {
    // 商品详情
    this.detaildata();
    //查询是否已经收藏
    this.istoo();
    // 购物车条数
    this.shopcount()

   
  },
  computed: {
      //登录状态
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
};
</script>

<style>
</style>