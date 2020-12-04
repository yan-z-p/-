<template>
  <div class="menu-content">
      <div class="menu-top">
          <van-search  shape='round' v-model="serv" placeholder="请输入搜索关键词" @focus='gosearch' />
      </div>
        <van-tabbar v-model="isactive" :fixed='false' active-color=' #2566ca' @change="changeTabs">
                <van-tabbar-item  v-for="(item,index) in menuData" :key='index' :name="item.value+'/'+item.key" :icon="isactive==item.value+'/'+item.key?item.activeIcon:item.inActiveIcon"  >{{item.title}}</van-tabbar-item>
                
            </van-tabbar>

        <div class="menu-shop-content">
            <div class="shop-con clearf" v-for="(v,i) in showData" :key="i" @click="goshop(v.pid)">
                <div class="img fl">
                    <img :src="v.smallImg" >
                </div>
                <div class="right-content clearf">
                    <div class="titleN fl">
                        <span class="name">{{v.name}}</span>
                        <span class="enName">{{v.enname}}</span>
                    </div>
                    <div class="prier fr">￥{{v.price}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../assets/css/menu.less'
export default {
    name:'Meau',
    data(){
        return{
            serv:'',
            isactive:"1/isHot",
            menuData:[
                {
                    title:'推荐',
                    key:'isHot',
                    value:'1',
                    inActiveIcon:require('../assets/image/icons_09.gif'),
                    activeIcon:require('../assets/image/icons_21.gif')
                },{
                    title:'拿铁',
                    key:'type',
                    value:'latte',
                    inActiveIcon:require('../assets/image/icons_05.gif'),
                    activeIcon:require('../assets/image/icons_19.gif')
                },
                {
                    title:'咖啡',
                    key:'type',
                    value:'coffee',
                    inActiveIcon:require('../assets/image/icons_03.gif'),
                    activeIcon:require('../assets/image/icons_18.gif')
                },
                {
                    title:'瑞纳冰',
                    key:'type',
                    value:'rena_ice',
                    inActiveIcon:require('../assets/image/icons_07.gif'),
                    activeIcon:require('../assets/image/icons_20.gif')
                },
            ],
            showData:[]

        }
    },created(){
        this.changeTabs('1/isHot')
    },
    methods:{
        // 根据下标请求数据
        changeTabs(active){
            
            let type=active.split("/")
            
            this.axios({
                method:'GET',
                url:'/typeProducts',
                params:{
                    appkey:this.appkey,
                    key:type[1],
                    value:type[0]
                }
            }).then(result=>{
                
                if(result.data.code==500){
                    this.showData=result.data.result
                }
            }).catch(err=>{
                
            })
        },
        goshop(pid){
            this.$router.push({name:'Detail',params:{pid}})
        },
        //搜索
        gosearch(){
             this.$router.push({name:'Search'})
        }
    }
    
}
</script>

