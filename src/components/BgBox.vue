<template>
  <div class="con">
      <div class="top-box"></div>       
      <div class="bottom-box">
        <div class="bottom">
            <slot></slot>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    name:'BgBox',
    
}
</script>

<style lang="less" scoped>
 .top-box{
        height: 100px;
        background-color: #2566ca;
    }
    .bottom-box{
        padding: 0 15px;
        position: relative;
        top: -30px;
        min-height: 100%;
    }
    .bottom{
        background-color: #fff;
        border-radius: 15px 15px 0 0;
        min-height: 100%;
        overflow: hidden;
    }

   
</style>