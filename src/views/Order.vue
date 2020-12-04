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
            @change="shopT(v.oid,v.status)"
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
      tokenString: "",
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
      ;
      if(this.$route.params.pay){
        this.$router.push({name:'Shopbag'})
      }else{
        this.$router.back(-1)
      }
    },
    //订单数据
    getorderData() {
      //获取token
      this.tokenString = localStorage.getItem("__tk");

       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      this.axios({
        method: "GET",

        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          status: this.active,
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          // 
          let data = result.data.result;
          if (result.data.code == 70000) {
            //数据分类
            let orderData = {};
            let arr = [];
            data.map((v) => {
              //数据未存在
              let o = {};
              let isre = false;
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].oid == v.oid) {
                  isre = true;
                  arr[i].count += v.count;
                  arr[i].shopper += v.count * v.price;
                  arr[i].data.push(v);
                  break;
                }
              }
              //初始化
              if (!isre) {
                o.oid = v.oid;
                o.time = v.createdAt;
                o.count = v.count;
                o.shopper = v.count * v.price;
                o.status = v.status;
                o.oid = v.oid;
                o.data = [v];
                isre = false;
              }
              if (Object.keys(o).length !== 0) {
                arr.push(o);
              }
            });
            this.orderData = arr.reverse();
            // 
            // 
          }
        })
        .catch((err) => {
          
        });
    },
    //切换状态
    shopT(oid,status) {
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      
      if(status==1){
         this.axios({
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString: this.tokenString,
          oid: oid,
        },
      })
        .then((result) => {
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          this.$toast(result.data.msg);
          this.getorderData();
        })
        .catch((err) => {
          
        });
      }else{
         this.$toast("您已经收货成功");
      }
     
    },
    //删除商品
    del(oid, index) {
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
     
      this.$dialog
        .confirm({
          title: "删除订单",
          message: "是否删除订单",
          beforeClose: this.beforeClose,
          confirmButtonColor: "#2566CA",
        })
        .then(() => {
          this.axios({
            method: "POST",
            url: "/removeOrder",
            data: {
              appkey: this.appkey,
              tokenString: this.tokenString,
              oid: oid,
            },
          })
            .then((result) => {
              
              if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
              if (result.data.code == 90000) {
                this.$toast(result.data.msg);
                this.orderData.splice(index, 1);
              }
            })
            .catch((err) => {
              
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
