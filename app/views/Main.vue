


<template>

    <div class="main">
    <!-- 二级路由 -->
    
    <router-view/>
        <div class="bottom-box">
            <van-tabbar v-model="active"  route >
            <van-tabbar-item :name='item.name' replace :to='item.path' v-for='(item,index) in tabsdata' :key='index'>{{item.title}}
            <template #icon="props">
            <img :src="props.active ? item.inactive  : item.active " />
            </template>
            </van-tabbar-item>
            </van-tabbar>
        </div>

    </div>
</template>
<script>
export default {
    name:'Main',
    data(){
        return{
            // 激活下标
            active:"Home",
            tabsdata:[
                {
                    name:'Home',
                    title:'首页',
                    path:'/main/home',
                    active:require('../assets/image/home.png'),
                    inactive:require('../assets/image/home_active.png')
                },
                {
                    name:'Menu',
                    title:'菜单',
                    path:'/main/menu',                 
                    active: require('../assets/image/menu.png'),
                    inactive:require('../assets/image/menu_active.png')

                    
                },
                {
                    name:'Shopbag',
                    title:'购物袋',
                    path:'/main/shopbag',
                    active: require('../assets/image/shopbag.png'),
                    inactive:require('../assets/image/shopbag_active.png')
                },
                {
                    name:'My',
                    title:'我',
                    path:'/main/my',
                    active: require('../assets/image/my.png'),
                    inactive:require('../assets/image/my_active.png')
                },

            ]
        }
    },
    
    
   
}
</script>

<style lang='less'>
    .main{
        height: 100%;
    }
</style>