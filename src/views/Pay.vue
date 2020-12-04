<template>
  <div class="pay">
    <div class="pay-top">
      <van-nav-bar
        title="提交订单"
        left-text="返回"
        left-arrow
        fixed
        @click-left="back"
      />
    </div>

    <div class="pay-content">
      <!-- 地址选择 -->
      <div class="pay-address">
        <div class="select" @click="selectadd()"><p>选择收货地址 ></p></div>

        <div class="select-address">
          <div class="title-tel clearf">
            <div class="addname fl">{{addressData.name}}</div>
            <span class="fl">{{addressData.tel}}</span>
            <div class="isDefault fl" v-if="addressData.isDefault">默认</div>
          </div>
          <div class="pay-addressDetail">{{addressData.address}}</div>
        </div>
        <!-- 弹出层 -->
        <div class="select-tan">
          <van-popup v-model="show" position="bottom" closeable round>
            <div class="select-top">选择收货地址</div>
            <van-address-list
              v-model="chosenAddressId"
              :list="list"
              default-tag-text="默认"
              @add="newadd"
              @edit="editadd"
              @select='selectx'
            />
          </van-popup>
        </div>
      </div>

      <!-- 订单信息 -->
     <OrderList :shopNum="shopNum" :shopper="shopper |decimal"
     leftText="订单信息" ltcolor='black'>
          <OrderShop
          v-for="(item,index) in subShopData" :key="index"
          :img="item.small_img"
          :name='item.name'
          :rule='item.rule'
          :enname='item.enname'
          :price='item.price'
          :count='item.count'
          ></OrderShop> 
        </OrderList>
    </div>
    <div class="per-bottom">
      <van-button class="" type="primary" block color="#2566CA" round @click="submit"  :disabled="list==''" 
        >提交订单</van-button
      >
    </div>
  </div>
</template>

<script>
import "../assets/css/pay.less";
import OrderList from '../components/OrderList.vue'
import OrderShop from '../components/OrderShop.vue'
export default {
  name: "Pay",
  components:{
    OrderList,
    OrderShop
  },
  data() {
    return {
      inChenked: true,
      show: false,
      list: [],
      chosenAddressId: "",
       // 地址
        addressData:{},
        // 订单信息
        subShopData:[],
        sids:'',
        shopNum:0,
        shopper:0,
        tokenString:'',
        disabled:true
        
    };
    
  },
  created() {
    this.sids=this.$route.params.sids.split('+');
    this.getaddressData()
    this.getSids()
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getaddressData() {
      //获取tokenString
      this.tokenString = localStorage.getItem("__tk");
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      //查询地址
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          tokenString: this.tokenString,
          appkey: this.appkey,
        },
      })
        .then((result) => {
          // 
         
          if (result.data.code == 20000) {
            
            result.data.result.map((v) => {
              // 
              v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              if (v.isDefault) {
                this.addressData = v;
                this.chosenAddressId=v.aid;
              }
            });
            
            this.list = result.data.result;
            // 
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 截取sids/获取订单
    getSids(){
        if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      // 获取订单
      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          tokenString: this.tokenString,
          appkey: this.appkey,
          sids:JSON.stringify(this.sids)
        },
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          // 
          if(result.data.code==50000){
            //  if(result.data.result.length<1){
            //  return this.$router.push({ name: "shopbag" });
            // }
            result.data.result.map(v =>{
              this.shopNum+=v.count
              this.shopper+=v.count*v.price;
            })

            this.subShopData=result.data.result
            
          }else{
             this.$toast("tokenString错误,请重新登录");
          }
          
          
        }).catch((err) => {
          
        });

    },
    selectadd() {
      this.show = true;
      // this.getaddressData()
    },
    newadd() {
      this.$router.push({ name: "Newaddress" });
    },
    editadd(item) {
      this.$router.push({ name: "Newaddress", params: { aid: item.aid } });
    },
    //切换选中地址
    selectx(item,index){
      this.addressData=item;
      this.show=false;

    },
    submit(){
      
      this.$dialog.confirm({
        title: '确认订单',
        message: '是否提交订单',
        beforeClose:this.beforeClose,
      })
        .then(() => {
           if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
         
          let data={}

              data.phone=this.addressData.tel,
              data.address=this.addressData.address,
              data.receiver=this.addressData.name,
              data.sids=JSON.stringify(this.sids),
              data.appkey= this.appkey,
              data.tokenString= this.tokenString,
            
           this.axios({
            method: "POST",
            url: "/pay",
            data:data,
           }).then((result) => {
          // 
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          if (result.data.code == 60000) {
            this.$toast(result.data.msg)
            this.$router.push({name:'Order',params:{pay:true}});
          } else {
            this.$toast("tokenString错误,请重新登录");
          }
        })
        .catch((err) => {
          
        });
          
        })
        .catch(() => {
           this.$toast("您取消了确认订单")
        });
    },
   
   
  },
};
</script>

<style>
</style>