<template>
  <div class="search">
    <div class="search-top">
      <form action="/">
        <van-search
          v-model="value"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch(value)"
          @cancel="onCancel"
        />
      </form>
    </div>
    <div class="menu-shop-content">
      <div
        class="shop-con clearf"
        v-for="(v, i) in showData"
        :key="i"
        @click="goshop(v.pid)"
      >
        <div class="img fl">
          <img :src="v.smallImg" />
        </div>
        <div class="right-content clearf">
          <div class="titleN fl">
            <span class="name">{{ v.name }}</span>
            <span class="enName">{{ v.enname }}</span>
          </div>
          <div class="prier fr">￥{{ v.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { search } from "../api/my";
export default {
  name: "Search",
  data() {
    return {
      value: "",
      showData: [],
    };
  },
  created() {
    let val = localStorage.getItem("searchv");
    this.value = val;
    if (this.value != "") {
      this.onSearch(this.value);
    }
  },
  methods: {
    async onSearch(val) {
      localStorage.setItem("searchv", val);
      let res = await search(val);
      if (res.data.code == "Q001") {
        this.showData = res.data.result;
      }
    },
    onCancel() {
      this.$router.go(-1);
    },
    goshop(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  padding-top: 55px;
  min-height: 100%;
  background-color: #f5f5f5;
  .search-top {
    width: 100%;
    position: fixed;
    top: 0;
  }
}
.menu-shop-content {
  margin-top: 10px;
  height: 100px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  // background-color: red;
}
.shop-con {
  margin-top: 10px;
  height: 80px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid transparent;
  .img {
    width: 60px;
    height: 60px;
    margin: 10px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .name {
    color: #2566ca;
    font-size: 14px;
  }
  .right-content {
    line-height: 80px;
  }
  .titleN {
    padding-top: 20px;
    line-height: 20px;
    > span {
      display: block;
    }
    .enName {
      // line-height: 0px;
      color: #999;
    }
  }
}
.prier {
  color: #2566ca;
  margin-right: 20px;
  font-size: 13px;
  font-weight: bold;
}
</style>