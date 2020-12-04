<template>
  <div class="address">
    <div class="add-top">
      <van-nav-bar
        title="地址列表"
        left-text="返回"
        left-arrow
        fixed
        @click-left="back"
      />
    </div>
    <!--  -->
    <BgBox>
      <van-address-list
            v-model="chosenAddressId"
            :list="list"            
            default-tag-text="默认"
            @add='newadd'
            @edit='editadd'
          />
          <van-empty v-if='list.length==0' description="您的地址是空的，去新增一个地址吧" />
    </BgBox>
    
  </div>
</template>

<script>
import "../assets/css/address.less";

import BgBox from '../components/BgBox.vue'
export default {
  name: "Address",
  components:{
    BgBox
  },
  data() {
    return {
      disabledList: [],
      list: [],
      chosenAddressId: "",
       // tokenString
        tokenString:'',
       
    };
  },
  methods: {
    back() {
      this.$router.go(-1)
      // 
    },
    newadd(){
        this.$router.push({name:'Newaddress'})
    },
    editadd(item){
        // 
        this.$router.push({name:'Newaddress',params: {aid: item.aid}})
    },
    // 查询地址
    getaddressData(){
         //获取tokenString
    this.tokenString =localStorage.getItem("__tk");
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
          tokenString:this.tokenString,
          appkey:this.appkey
        },
      })
        .then((result) => {
          
           if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          if(result.data.code==20000){
            result.data.result.map(v=>{
                // 
                v.isDefault = Boolean(v.isDefault);
                v.id=v.aid;
                v.address=`${v.province}${v.city}${v.county}${v.addressDetail}`;
                if(v.isDefault){
                  this.chosenAddressId=v.aid;
                }
               
            }) 
            this.list=result.data.result
            
          }
          
        })
        .catch((err) => {
          
        });
    }
  },
  created(){
      
    this.getaddressData()
  }
};
</script>

<style lang='less'>

.van-button--danger {
         background-color: #2566ca;
         border-color: #2566ca;
     }
     .van-tag--danger {
         background-color: #2566ca;
     }
     .van-address-item .van-radio__icon--checked .van-icon{
         background-color: #2566ca;
         border-color: #2566ca;
     }

     
</style>