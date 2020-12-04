<template>
  <div class="newaddress">
    <div class="newaddress-top-box">
      <van-nav-bar
        :title="newadd?'新增地址':'编辑地址'"
        left-text="返回"
        left-arrow
        fixed
        @click-left="back"
      />
    </div>
    <div class="new-address">
      <!-- 地址 -->
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!newadd"
        show-set-default
        show-search-result
        :address-info='addressInfo'
        :area-columns-placeholder="['选择省', '选择市', '选择区/县']"
        @save="onSave"
        @delete="onDelete"
        
      />
    </div>
  </div>
</template>

<script>
import areaList from "../assets/js/area";
export default {
  name: "Newaddress",
  data() {
    return {
      areaList,
      searchResult: [],
      tokenString:'',
      // 获取地址
      loadadd:[],
      //新增地址
      newadd:true,
      addressInfo:{},
      aid:'',
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    onSave(content) {
      
      let data = {}
      data.appkey=this.appkey;
      data.tokenString=this.tokenString;
      data.name=content.name;
      data.tel=content.tel;
      data.province=content.province;
      data.city=content.city;
      data.county=content.county;
      data.addressDetail=content.addressDetail;
      data.areaCode=content.areaCode;
      data.postalCode=content.postalCode;
      data.isDefault=Number(content.isDefault);
      data.aid=this.aid
    
    if(this.newadd){
      this.newaddress(data)
      this.$router.go(-1);
    } else if(!this.newadd){
      this.edit(data)
      
      this.$router.go(-1);
    }
    
    },
    //新增地址
    newaddress(data) {
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
         this.axios({
        method: "POST",
        url: "/addAddress",
        data:data,
      })
        .then((result) => {
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          // 
          this.$toast(result.data.msg) 
        })
        .catch((err) => {
          
        });

    },
    // 编辑地址
    edit(data) {
      this.axios({
        method: "POST",
        url: "/editAddress",
        data:data,
      })
        .then((result) => {
           this.$toast(result.data.msg) 
           
        })
        .catch((err) => {
          
        });
    },
    //查询地址
    getaid(aid){
      if(!this.tokenString){
            //未登录
            this.$toast("请先登录");
            return this.$router.push({name:"Login"})
        }
    
      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          tokenString:this.tokenString,
          appkey:this.appkey,
          aid:aid
        },
      })
        .then((result) => {
          // 
           if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
          if(result.data.code==40000){
            // 
            this.addressInfo=result.data.result[0]
            this.newadd=false
          }
          
        })
        .catch((err) => {
          
        });
    },
    onDelete(content) {
       if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        // 删除地址
    
      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data:{
          appkey:this.appkey,
          tokenString:this.tokenString,
          aid:content.aid

        },
      })
        .then((result) => {
          // 
           if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
           this.$toast(result.data.msg) 
           this.$router.go(-1);
        })
        .catch((err) => {
          
        });
    },
    
  },
  created() {
     //获取tokenString
    this.tokenString =localStorage.getItem("__tk");
    this.aid=this.$route.params.aid
    
    if(!!this.aid){
      this.getaid(this.aid)
    }
    
  },
};
</script>

<style lang="less">
.newaddress{
  padding-top: 46px;
  .van-button--danger {
        background-color: #2566ca;
            border-color: #2566ca;
     }
}

</style>
