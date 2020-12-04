<template>
  <div class="collection">
      <div class="collection-top">
          <van-nav-bar
            title="我的收藏"
            left-text="返回"
            left-arrow
            @click-left="back"
            fixed
            />
      </div>
      <BgBox>
          <!-- 空状态 -->
    <div class="collection-none">
     <van-empty description="您的收藏为空，去逛一逛吧" v-if="collectionData.length==0" >
         <van-button round type="danger" class="bottom-button" @click="gohome">
          先去逛一逛
        </van-button>
        </van-empty>
        </div>
        <!-- 内容 -->
        <div class="collectioncontent clearf">
            <div class="collection-shop fl" v-for="(item, index) in collectionData" :key='index'  >
                <div class="cimg" @click="goshop(item.pid)">
                    <img :src="item.smallImg" >
                </div>
                <div class="coll-bot">
                    <span class="ctitle">{{item.name}}</span>
                    <div class="shop-bottom clearf">
                        <div class="fl shopper">￥{{item.price}}</div>
                        <div class="fr shop-del" @click='del(item.pid,index)'>
                            <van-icon name="delete"  size="16"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </BgBox>
  </div>
</template>

<script>
import '../assets/css/collection.less'
import BgBox from '../components/BgBox.vue'
export default {
    name:'Collection',
    components:{
        BgBox
    },
    data(){
        return{
            collectionData:[]
        }
    },
    created(){
        // 获取收藏数据
        this.getcollectionData()
    },
    methods:{
         back(){
            this.$router.go(-1)
        },
        //逛一逛
    gohome() {
      this.$router.push({ name: "home" });
    },
    //获取收藏数据
    getcollectionData(){
          this.tokenString = localStorage.getItem("__tk");
      if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          tokenString: this.tokenString,
          appkey: this.appkey,
        },
      })
        .then((result) => {
          
           if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
            if(result.data.code==2000){
                this.collectionData=result.data.result
            }
        })
        .catch((err) => {
          
        });
    },
    //取消收藏商品
    del(pid,index){
      if (!this.tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }
        // 
         this.$dialog
        .confirm({
          title: "取消收藏",
          message: "是否取消收藏",
          beforeClose: this.beforeClose,
          confirmButtonColor: "#2566CA",
        })
        .then(() => {
          this.axios({
            method: "POST",
            url: "/notlike",
            data: {
              appkey: this.appkey,
              tokenString: this.tokenString,
              pid: pid,
            },
          })
            .then((result) => {
              
               if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
              if(result.data.code==900){
                  this.$toast(result.data.msg)
                  this.collectionData.splice(index,1)
              }
              
            })
            .catch((err) => {
              
            });
        })
        .catch(() => {
          this.$toast("取消操作");
        });
    },
    goshop(pid){
        this.$router.push({name:'Detail',params:{pid}})
    }
    }

}
</script>
