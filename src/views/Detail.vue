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
            <img :src="deraildata.large_img">
            <div class="shop-content clearf">
                <div class="choice clearf" v-for="(cho,indcho) in choice" :key="indcho">
                    <div class="title fl">{{cho.title}}</div>
                    <div class="title-con fl" v-for="(set , indset) in cho.set" :key="indset" :class="cho.isActive==indset? 'active':''" @click="too(cho,indset)">{{set}}</div>
                    
                </div>
                
                <!-- 分割线 -->
                <div class="detail-fen">
                </div>
                <!-- 商品描述 -->
                <div class="miao">
                    <h3>商品描述</h3>
                    <p v-for="(item,index) in deraildata.desc" :key='index'>{{index+1+"、"}}{{item}}</p>                    
                </div>
                <div class="detail-fen">
                </div>

                <div class="peir">
                    <div class="detail-rmb fl" >￥28.00</div>
                    <div class="fr">
                    <van-stepper v-model="shopnum" theme="round" button-size="22" disable-input /></div>
                </div>

                <van-goods-action>
                    <van-goods-action-icon icon="bag" text="购物袋"  :badge="shopbagnum"  :color="!!shopbagnum ?' #2566CA':'#323233'" @click='goshopbag'/>
                    <van-goods-action-icon icon="like" :color="islike ?' #2566CA':'#323233'" :text="islike?'已收藏':'收藏'"  @click="like"/>
                    <van-goods-action-button type="warning" text="加入购物袋" color="#6A91EC" @click="shopcar()"/>
                    <van-goods-action-button type="danger" text="立即购买"  color='#2566CA' @click="pay"/>
                </van-goods-action>
            </div>

        </div>
    </div>
</template>

<script>
import '../assets/css/detail.less'
export default {
    name:"Detail",
    
    data(){
        return{
                //商品数量
                shopnum:'1',
                //徽章
                shopbagnum:'',
                //商品数据
                deraildata:{},
                //规格
                choice:[],
                // 收藏的样式，
                islike:false,
                // 当前商品规格
                choiceX:[],
                // 立即购买
                isNow:true
        }
    },
    methods:{
        back(){
            this.$router.go(-1)
        },
        // 商品详情
        detaildata(){

             //商品pid
        let shopPid=this.$route.params.pid

            this.axios({
            method:"GET",

            url:'/productDetail',
            params:{
            appkey: this.appkey,
            pid: shopPid
            }
        }).then(result=>{
            if(result.data.code==600){
                 //处理数据(商品描述)
                let data=result.data.result[0];
                data.desc = data.desc.split(/[\n]/);
                //处理数据(商品选择)
                let a=[]
                let xuan = ['tem', 'sugar', 'milk', 'cream'];
                xuan.map(v=>{
                    let ze={}
                    ze.title=data[v+"_desc"]
                    ze.isActive=0;                    
                    ze.set=""
                    if(data[v]!=""){
                        ze.set=data[v].split("/");
                        //拿到默认商品规格
                        a.push(ze.set[ze.isActive]);                       
                        this.choice.push(ze)
                    }
                    
                });
                
                this.choiceX=a.join("/")
                this.deraildata=data
            }

        }).catch(err=>{
            
        })
        },
        // 点击高亮
        too(cho,index){
            cho.isActive=index;

            let c = []
            this.choice.map(v=>{
                c.push(v.set[v.isActive]);
                
            }) 
            c=c.join("/");
            this.choiceX=c
            
        },
        //商品收藏或取消
        like(){

             //正在加载提示
            this.$toast.loading({
                message: "处理中...",
                forbidClick: false,
                duration: 0,
            });
            // 
         //商品pid
        let shopPid=this.$route.params.pid

        //获取token
        let tokenString = localStorage.getItem('__tk');
        if(!tokenString){
            //未登录
            this.$toast("请先登录");
            return this.$router.push({name:"Login"})
        }else if(!this.islike){
            //收藏
            this.axios({
            method:"POST",
            url:"/like",
            data:{
                appkey:this.appkey,
                pid:shopPid,
                tokenString:tokenString
            }
        }).then(result=>{
            //取消正在加载提示
                this.$toast.clear()
                 if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
            if(result.data.code==800){
                // 
                this.$toast("收藏成功");
                this.islike=true
            }
                // 
        }).catch(err=>{
            
        });
        }else if(this.islike){
            //取消收藏
            this.axios({
            method:"POST",
            url:"/notlike",
            data:{
                appkey:this.appkey,
                pid:shopPid,
                tokenString:tokenString
            }
        }).then(result=>{
            this.$toast.clear()
             if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$toast('token检验无效')
            return this.$router.push({name: 'Login'});
          } 
            // 
            if(result.data.code==900){
                this.islike=false;
                // 
            }
        }).catch(err=>{
            
        });
        }
        },
        //查询是否已经收藏
        istoo(){
            let tokenString = localStorage.getItem('__tk');
          //商品pid
        let shopPid=this.$route.params.pid

        if(!tokenString){

            return
        }
        this.axios({
            method:"GET",
            url:"/findlike",
            params:{
                appkey:this.appkey,
                tokenString:tokenString,
                pid:shopPid
            }
        }).then(result=>{
            // 
            if(result.data.code==1000){
                if(result.data.result.length>0){
                    this.islike=true
                }
            }
        }).catch(err=>{
            
        })
        },
        //加入购物车
        shopcar(buy){
            // 
            // 
            //规格
            let rule=this.choiceX
              //商品pid
            let shopPid=this.$route.params.pid

            //获取token
            let tokenString = localStorage.getItem('__tk');

            
            this.axios({
                method:'POST',
                url:"/addShopcart",
                data:{
                    pid: shopPid,
                    count: this.shopnum,
                    rule: rule,
                    appkey: this.appkey,
                    tokenString: tokenString
                }
            }).then(result=>{
                
                if(result.data.code==3000){
                    
                    
                    if(buy){
                        this.$toast("正在前往购买");
                        return this.$router.push({name:'Pay',params:{sids:result.data.sid}})
                        
                    }
                    this.$toast("加入购物车成功");
                    this.shopnum=1;
                    

                    if(result.data.status!=0){
                        this.shopbagnum++
                    }
                }
            }).catch(err=>{
                
            })
        
            
        },
        goshopbag(){
            this.$router.push({name:'Shopbag'})
        },
        pay(){
            let buy=true;
            this.shopcar(buy)
            // buy=false
        }
    },
    created(){
        // 商品详情
        this.detaildata()
        //查询是否已经收藏
        this.istoo()
        
        
            //获取token
            let tokenString = localStorage.getItem('__tk');

            
            this.axios({
                method:"GET",
                url:'/findAllShopcart',
                params:{
                    appkey:this.appkey,
                    tokenString:tokenString
                }
            }).then(result=>{
                
                if(result.data.code==5000){
                    this.shopbagnum=result.data.result.length
                }
            }).catch(err=>{
                
            })
        
        
    }
}
</script>

<style>

</style>