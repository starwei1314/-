<template>
  <div class id="addressEditor">
    <van-nav-bar title="收货地址" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    <van-address-edit
      :address-info="info"
      :area-list="areaList"
      show-set-default
      show-search-result
      show-delete
      :search-result="searchResult"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
      @change-area="onChange"
    />
  </div>
</template>
<script>
import myaddress from "@/assets/js/myaddress.js";
export default {
  data() {
    return {
      info: {
        //收货地址初始化
        // key	说明	类型
        // id	每条地址的唯一标识	String | Number
        // name	收货人姓名	String
        // tel	收货人手机号	String
        // province	省份	String
        // city	城市	String
        // county	区县	String
        // addressDetail	详细地址	String
        // areaCode	地区编码，通过省市区选择获取（必填）	String
        // postalCode	邮政编码	String
        // isDefault	是否为默认地址	Boolean
      },

      areaList: myaddress,
      searchResult: [],
      popupVisible: false
    };
  },
  props: {
    Uids: String
  },
  created() {
    if (this.Uids) {
      this.getDetail();
    } else {
      this.info = {};
    }
  },
  mounted() {},
  methods: {
    getDetail() {
      //获取详细信息，初始化地址栏
      this.$HttpService
        .fetch("/official/integral/personal_address_setting/detail", {
          uid: this.Uids
        })
        .then(res => {
          if (res.data.code == "0000") {
            var detail = res.data.result;
            var status = "";
            if (detail.defaultType == "0") {
              status = false;
            } else {
              status = true;
            }
            this.info = {
              //  key	说明	类型
              id: detail.uid,
              name: detail.contact,
              tel: detail.mobile,
              province: detail.province,
              city: detail.city,
              county: detail.area,
              addressDetail: detail.address,
              isDefault: status,
              areaCode: detail.code
            };
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onClickLeft() {
      this.backUp();
    },
    backUp() {
      this.$emit("close");
    },
    onSave(val) {
      var data = {
        openId: this.$getLocal('openId'),
        contact: val.name,
        mobile: val.tel,
        province: val.province,
        city: val.city,
        area: val.county,
        address: val.addressDetail,
        defaultType: "",
        code: val.areaCode,
        preCheck:'yes'
      };
      if (val.isDefault == true) {
        data.defaultType = "1";
      } else {
        data.defaultType = "0";
      }
      if (this.Uids) {
        //点击保存按钮

        this.$HttpService
          .postJson("/official/integral/personal_address_setting/update", data)
          .then(res => {
            if (res.data.code == "0000") {
              this.backUp();
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$HttpService
          .postJson("/official/integral/personal_address_setting/save", data)
          .then(res => {
            if (res.data.code == "0000") {
              this.backUp();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    onDelete() {
      //点击删除按钮
      this.$HttpService
        .post("/official/integral/personal_address_setting/remove", {
          "uids[]": this.Uids
        })
        .then(res => {
          if (res.data.code == "0000") {
            this.backUp();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeDetail(val) {
      if (val) {
      } else {
      }
    },
    onChange(val) {
      console.log(val);
    }
  }
};
</script>
<style lang='less' >
#addressEditor {
  .van-nav-bar {
    top: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 1;
  }
  .van-nav-bar {
    width: 100%;
    height: 50px;
    background: rgb(236, 95, 100);
    .van-nav-bar__title {
      font-size:20px;
      font-family: PingFangSC-Regular;
      margin-left: -10px;
      height: 100%;
      line-height:50px;
      width: 100%;
      color: #fff;
    }
    .van-nav-bar__left {
      // bottom: 50%;
      // margin-bottom: -0.23rem;
      .van-icon {
        color: #fff;
        font-size: 25px;
      }
    }
    .van-nav-bar__right {
      // bottom: 50%;
      // margin-bottom: -0.23rem;
      .van-icon {
        color: #fff;
        font-size: 30px;
      }
    }
  }
  .van-button {
    width: 80%;
    margin: 10px auto;
    &.van-button--danger {
      background-color: rgb(232, 52, 58) !important;
      border-radius: 50px;
      border: 1px solid #f44;
    }
  }

  .picker-slot {
    font-size: 14px;
    font-family: PingFangSC-Regular;
  }
  .moren {
    height: 48pxrem;
    line-height: 48px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgb(60, 61, 67);
    .mint-switch {
      float: right;
      margin-right: 15px;
      margin-top: 15px;
      .mint-switch-core {
        width: 42px;
        height: 22px;
      }
      .mint-switch-core::before {
        width: 0;
      }
      .mint-switch-core::after {
        width: 20px;
        height: 2px;
      }
    }
  }
}
</style>
