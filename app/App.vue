<template>
  <div id="app">
    <router-view>

  
    </router-view>
  </div>
</template>


<script>
export default {
    name:'App',
    data(){
      return {
        
      }
    }
}
</script>



<style lang="less">
html,body{
  width: 100%;
  height: 100%;
}
#app{
  height: 100%;
}

.fl{
  float: left;
}

.fr{
  float: right;
}
  .clearf::after{
  content: "";
  display: block;
  clear: both;
}
</style>
