<template>
  <div class="newaddress">
    <div class="newaddress-top-box">
      <van-nav-bar
        :title="newadd ? '新增地址' : '编辑地址'"
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
        :address-info="addressInfo"
        :area-columns-placeholder="['选择省', '选择市', '选择区/县']"
        @save="onSave"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script>
import areaList from "../assets/js/area";
import {
  addAddress,
  editAddress,
  findAddressByAid,
  deleteAddress,
} from "../api/newAddress.js";
import { getLocal } from "../utils/local";
export default {
  name: "Newaddress",
  data() {
    return {
      areaList,
      searchResult: [],
      // 获取地址
      loadadd: [],
      //新增地址
      newadd: true,
      addressInfo: {},
      aid: "",
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    onSave(content) {
      let data = {};
      data.name = content.name;
      data.tel = content.tel;
      data.province = content.province;
      data.city = content.city;
      data.county = content.county;
      data.addressDetail = content.addressDetail;
      data.areaCode = content.areaCode;
      data.postalCode = content.postalCode;
      data.isDefault = Number(content.isDefault);
      data.aid = this.aid;

      if (this.newadd) {
        this.newaddress(data);
        this.$router.go(-1);
      } else if (!this.newadd) {
        this.edit(data);

        this.$router.go(-1);
      }
    },
    //新增地址
    async newaddress(data) {
      if (!getLocal()) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let res = await addAddress(data);
      if (res.data.code == 9000) {
        this.$toast(res.data.msg);
      }
    },
    // 编辑地址
    async edit(data) {
      if (!getLocal()) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let res = await editAddress(data);
      if (res.data.code == 30000) {
        this.$toast(res.data.msg);
      }
    },
    //查询地址
    async getaid(aid) {
      if (!getLocal()) {
        //未登录
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let res = await findAddressByAid(aid);
      if (res.data.code == 40000) {
        this.addressInfo = res.data.result[0];
        this.newadd = false;
      }
    },
    async onDelete(content) {
      if (!getLocal()) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      // 删除地址
      let res = await deleteAddress(content.aid);
      console.log("delete", res);
      if (res.data.code == 10000) {
        this.$toast(res.data.msg);
        this.$router.go(-1);
      } else {
      }
    },
  },
  created() {
    //获取tokenString
    // this.tokenString = localStorage.getItem("__tk");
    this.aid = this.$route.params.aid;

    if (!!this.aid) {
      this.getaid(this.aid);
    }
  },
};
</script>

<style lang="less">
.newaddress {
  padding-top: 46px;
  .van-button--danger {
    background-color: #2566ca;
    border-color: #2566ca;
  }
}
</style>
