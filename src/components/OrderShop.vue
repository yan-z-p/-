<template>
   
         <div class="ab" style="margin: 10px" >
              <!-- 清除浮动 -->
              <div class="clearf">
                <!-- 照片 -->
                <div class="fl" style="padding: 10px; display: inline-block">
                  <img :src="img"/>
                </div>
                <div class="ab-title fl">
                  <ul class="clearf">
                    <p class="ab-bold fl">{{name}}</p>
                    <span class="rule fl"> {{rule}} </span>
                  </ul>
                  <span class="enname fl"> {{enname}} </span>

                  <div class="money">￥ {{price}}</div>
                </div>
                <!-- 数量 -->
                <div class="num">x{{count}}</div>
              </div>
            
          </div>
</template>

<script>
export default {
    name:'OrderShop',
    props:{
        price:{
            type:[Number,String],
            default:0
        },
        count:{
            type:Number,
            default:0
        },
        rule:{
            type:String,
            default:"规格"
        },
        name:{
            type:String,
            default:"商品名称"
        },
        enname:{
            type:String,
            default:"英文名"
        },
        img:{
            default:''
        }

    }
}
</script>

<style lang="less" scoped>
.menu{
    background: #666;
    width: 100%;
    height: 100%;
}
.ab{
        position: relative;
        background-color: white;
        border-radius: 10px;
        border-top: #ddd 1px solid;
        border-bottom: #ddd 1px solid;
        .van-swipe-cell__right{
            padding-left:2px;
            
        }
        img{
            width: 80px;
            height: 80px;
        }
        .ab-bold{
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 0;

            
        }

        .ab-title{
            ul{
                padding: 0;
            }
            
        }
        .rule{
            display: inline-block;
            margin-top: 17px;
            padding-left: 10px;
            color: #999;
        }
        .enname{
            
            color: #666;
        }

        .money{
            font-size: 14px;
            font-weight: bold;
            margin-top: 30px;
            color: #2566CA;
            position: absolute;
            bottom: 15px;
            left: 100px;

        }

        .num{
            position: absolute;
            bottom: 10px;
            right: 15px;
            color: #999;

            .van-stepper--round .van-stepper__minus{
                color: #2566CA;
                border-color: #2566CA;
            }
            .van-stepper--round .van-stepper__plus{
                background:  #2566CA;
            }
        }

    }
</style>