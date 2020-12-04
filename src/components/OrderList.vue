<template>
   
        <div class="oder-content">
        <div class="pay-title clearf ">
          <span class="fl" :style='{color:ltcolor}'>{{leftText}}</span>
          <div class="fr order-right" v-if="isque">
              <span class="rTrxt" :style='{color:rtcolor}' @click='too' >{{rightText==1?'确认收货':'已收货'}}</span>
              <van-icon name="delete" v-if="rightText!=1" @click='click' size="16"/>

              </div>
          
        </div>
        <div class="pay-order">
          <slot></slot>
        </div>
        <div class="pay-per clearf">

            
          <div class="pay-style-boyyom">
            <div class="left"></div>
            <div class="right"></div>
          </div>

            <div v-if='isTime' class="order-time">{{time}}</div>
          <div class="payand fl">共计{{shopNum}}件商品</div>
          <div class="perand fr">合计￥{{shopper}}元</div>
        </div>
      </div>
   
</template>

<script>
export default {
    name:'OrderList',
    props:{
        shopNum:{
            
            default:0
        },
        shopper:{
            
            default:0
        },
        rightText:{
            default:'1'
        },
        leftText:{
            default:''
        },
        ltcolor:{
            default:"#999"
        },
        rtcolor:{
            default:"#2566CA"
        },
        isTime:{
            default:false
        },
        time:{
            default:"00"
        },
        isque:{
            default:false
        }

    },
    methods:{
        click(){
            this.$emit('click')
        },
        too(){
            this.$emit('change')
        }
    }
    
}
</script>

<style lang="less" scoped>
.oder-content{
        background-color: #fff;
        border-radius: 10px;
        margin-top: 10px;
        overflow: hidden;  
    }
    .pay-title{
        font-weight: bold;
        font-size: 14px;
        color: #999;
        padding: 5px 10px;
    }
    .pay-order{
        border-bottom: 1px #999 dashed;
    }
    .pay-per{
        height: 40px;
        padding: 0 10px;
        line-height: 40px;
        font-weight: bold;
        .perand{
            color: #2566CA;
        }
    }
     .pay-style-boyyom{
        position: relative;
        >div{
            width: 24px;
            height: 24px;
            background: #f5f5f5;
            position: absolute;
            top: -12px;
            border-radius: 50%;
        }
        .left{
            left: -25px;
        }
        .right{
            right: -25px;
        }
       
    }
        
   .rTrxt{
            margin-right:10px ;
            line-height: 20px;
        }
    .van-icon{
        top: 3px;
    }
    .order-time{
        color: #999;
    }
</style>