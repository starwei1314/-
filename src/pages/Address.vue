<template>
  <div class id="address">
    <div v-if="!isshowEditor">
      <van-nav-bar title="收货地址" left-arrow fixed @click-left="onClickLeft">
        <!-- <van-icon name="more" slot="right" /> -->
      </van-nav-bar>
      <div class="addressList">
        <ul>
          <!-- <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >-->
          <li v-for="(item,index) in addressList" @click="choose(item.uid)">
            <div class="addressCheck" v-if="item.preCheck=='yes'"></div>
            <!-- <input type="radio" v-if="item.status!=true" class="addressCheck"   > -->
            <div class="address">
              <div class="defalut">
                <span v-if="item.defaultType==1">默认</span>
                {{item.province}}{{item.city}}{{item.area}}
              </div>
              <div class="nowAddress">
                {{item.address}}
                <span class="editor" @click.stop="modifie(item.uid)"></span>
              </div>
              <div class="concatPerson">{{item.contact}} &nbsp;{{item.mobile}}</div>
            </div>
          </li>
          <!-- </van-list> -->
        </ul>
      </div>
      <div class="btn">
        <span @click="addEditor">添加新地址</span>
      </div>
    </div>
    <address-editor v-if="isshowEditor" v-on:close="closeBox" :Uids="uid"></address-editor>
  </div>
</template>
<script>
import AddressEditor from "@/components/AddressEditor";
export default {
  data() {
    return {
      //   loading:false,
      //   finished: false,
      isshowEditor: false, //地址编辑开关
      icon: {
        normal: "",
        active: "../assets/imgs/address/selected.png"
      },
      addressList: [
        //   {
        //        status:true,
        //         detailAddress:"xxxx小区一期 25栋 1单元 1818",
        //         phone:1897123456,
        //         name:'小明',
        //         address:"湖北省武汉市武昌区南湖",
        //   },
        //    {
        //     status:false,
        //      detailAddress:"xxxx小区一期 25栋 1单元 1818",
        //      phone:1897123456,
        //      name:'小明',
        //      address:"湖北省武汉市武昌区南湖",
        //   }
      ],
      uid: "" //地址详请UId
    };
  },
  components: { AddressEditor },
  created() {
    this.getDataList();
  },
  methods: {
    choose(val) {
      console.log("这里将选中的地址提交，以便在订单管理中使用");
      this.$HttpService.post("/official/integral/personal_address_setting/check", { uid: val }).then(res => {
          if (res.data.code == "0000") {
            this.$router.push("/ordermange");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addEditor() {
      //    新增地址
      this.uid = "";
      this.isshowEditor = true;
    },
    modifie(val) {
      //编辑地址
      this.isshowEditor = true;
      this.uid = val;
    },
    getDataList() {
     let openId= this.$getLocal('openId')
      //    获取地址列表
      this.$HttpService
        .fetch("/official/integral/personal_address_setting/all", {
          openId: openId
        }).then(res => {
          if (res.data.code == "0000") {
            this.addressList = res.data.result;
          }
        }).catch(err => {
          console.log(err);
        });
    },
    closeBox() {
      this.isshowEditor = false;
      this.getDataList();
    },
    onClickLeft() {
      this.$router.back(-1);
    }
    //     onLoad() {//下拉加载更多的方法
    //   // 异步更新数据
    //   setTimeout(() => {

    //     // 加载状态结束
    //     this.loading = false;

    //     // 数据全部加载完成
    //     if (this.addressList.length >= 20) {
    //       this.finished = true;
    //     }
    //   }, 500);
    // },
  }
};
</script>
<style lang='less' scoped>
#address {
  background-color: #f7f7f7;
  min-height:667px;
  margin-top: 50px;
  .van-nav-bar {
    width: 100%;
    height:50px;
    background: rgb(236, 95, 100);
    .van-nav-bar__title {
      font-size: 20px;
      font-family: PingFangSC-Regular;
      margin-left: -10px;
      height: 100%;
      line-height: 50px;
      width: 100%;
      color: #fff;
    }
    .van-nav-bar__left {
      bottom: 50%;
      margin-bottom: -23px;
      .van-icon {
        color: #fff;
        font-size: 25px;
      }
    }
    .van-nav-bar__right {
      bottom: 50%;
      margin-bottom: -23px;
      .van-icon {
        color: #fff;
        font-size: 30px;
      }
    }
  }
  .addressList {
    ul {
      background-color: #f7f7f7;
      overflow: hidden;
      li {
        margin-top:10px;
        overflow: hidden;
        background-color: #fff;
        .addressCheck {
          width: 24px;
          height: 24px;
          margin-left: 10px;
          float: left;
          background-image: url("../assets/imgs/address/selected.png");
          background-size: cover;
          margin-top: 37px;
        }
        .address {
          width: 330px;
          height: 98px;
          font-size:14px;
          font-family: PingFangSC-Regular;
          margin-bottom: 10px;
          margin-left: 5px;
          float: right;
          div {
            margin-top: 5px;
          }
          .defalut {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              display: inline-block;
              width: 28px;
              height: 16px;
              font-size: 12px;
              font-family: PingFangSC-Regular;
              background-color: #6d53b2;
              border-radius: 2px;
              text-align: center;
            }
          }
          .nowAddress {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 18px;
            font-family: PingFangSC-Regular;
            .editor {
              width: 24px;
              height:24px;
              float: right;
              margin-right: 20px;
              background-image: url("../assets/imgs/address/ic_edit.png");
              background-size: cover;
            }
          }
          .concatPerson {
            font-size: 14px;
            font-family: PingFangSC-Regular;
          }
        }
      }
    }
  }
  .btn {
    width: 100%;
    height:48px;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    padding-top: 8px;
    background-color: #fff;
    span {
      font-size: 16px;
      font-family: PingFangSC-Regular;
      background-color: rgb(232, 52, 58);
      width: 263px;
      height: 40px;
      border-radius: 20px;
      display: inline-block;
      line-height: 40px;
      text-align: center;
      color: #fff;
    }
  }
}
</style>
