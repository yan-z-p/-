<template>
  <div class="order">
    <div class="add-top">
      <van-nav-bar
        title="订单中心"
        left-text="返回"
        left-arrow
        fixed
        @click-left="back"
      />
    </div>
    <div class="topbg"></div>

    <van-tabs
      v-model="active"
      line-height="2"
      :swipeable="true"
      @change="changeTab"
    >
      <van-tab :title="i.title" v-for="(i, j) in ordertitle" :key="j">
        <OrderList
          :shopNum="v.count"
          :isTime="true"
          :time="v.time | formatDate"
          :shopper="v.shopper | decimal"
          :leftText="v.oid"
          :rightText="v.status"
          @change="shopT(v.oid, v.status)"
          @click="del(v.oid, i)"
          v-for="(v, i) in orderData"
          :key="i"
          :isque="true"
        >
          <OrderShop
            v-for="(item, index) in v.data"
            :key="index"
            :price="item.price"
            :img="item.smallImg"
            :count="item.count"
            :rule="item.rule"
            :name="item.name"
            :enname="item.enname"
          ></OrderShop>
        </OrderList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
import OrderList from "../components/OrderList.vue";
import OrderShop from "../components/OrderShop.vue";
import "../assets/css/order.less";
import { findOrder, receive, removeOrder } from "../api/order";
import { form } from "../assets/js/form";
import { getLocal } from "../utils/local";
export default {
  name: "Order",
  components: {
    BgBox,
    OrderList,
    OrderShop,
  },
  data() {
    return {
      // 订单数据
      orderData: [],
      // 激活下标
      active: 0,
      // tokenString: "",
      shopNum: 0,
      shopper: 0,

      ordertitle: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
    };
  },
  created() {
    this.getorderData();
  },
  methods: {
    back() {
      if (this.$route.params.pay) {
        this.$router.push({ name: "Shopbag" });
      } else {
        this.$router.back(-1);
      }
    },
    //订单数据
    async getorderData() {
      if (!getLocal()) {
        return;
      }
      //  启动加载提示
      this.$toast.loading({
        //文本提示
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //提示时间, 0: 没有时间限制
        duration: 0,
      });
      let res = await findOrder(this.active);
      if (res.data.code == 70000) {
        //   关闭加载提示
        this.$toast.clear();
        this.orderData = form.setorder(res.data.result);
      } else {
        //   关闭加载提示
        this.$toast.clear();
      }
    },
    //切换状态
    shopT(oid, status) {
      if (!getLocal()) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      if (status == 1) {
        this.$dialog
          .confirm({
            title: "确认收货",
            message: "是否确认收货",
            beforeClose: this.beforeClose,
            confirmButtonColor: "#2566CA",
          })
          .then(() => {
            let res = Promise.all([receive(oid)]);
            res.then((result) => {
              if (result[0].data.code == 80000) {
                this.getorderData();
              }
            });
          })
          .catch(() => {
            this.$toast("取消操作");
          });
      } else {
        this.$toast("您已经收货成功");
      }
    },
    //删除商品
    del(oid, index) {
      if (!getLocal()) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$dialog
        .confirm({
          title: "删除订单",
          message: "是否删除订单",
          beforeClose: this.beforeClose,
          confirmButtonColor: "#2566CA",
        })
        .then(() => {
          let res = Promise.all([removeOrder(oid)]);
          res.then((result) => {
            if (result[0].data.code == 90000) {
              this.$toast(result[0].data.msg);
              this.orderData.splice(index, 1);
            }
          });
        })
        .catch(() => {
          this.$toast("取消操作");
        });
    },
    // 切换状态
    changeTab(name, title) {
      this.getorderData();
    },
  },
};
</script>
<style lang="less" scoped>
</style>
