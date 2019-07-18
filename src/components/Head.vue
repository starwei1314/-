<template>
  <div class="" id="shopHead">
    <van-nav-bar title="积分兑换"  fixed left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight">
      <!-- <van-icon name="more" slot="right" /> -->
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'Head',
  data () {
    return {
      
    }
  },
  methods:{
     onClickLeft() {
      this.$router.back(-1)
    },
    onClickRight() {
     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
   #shopHead{
     margin-bottom:50px;
    .van-nav-bar {
    top: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 1;
}
     .van-nav-bar{
       width:100%;
       height:50px;
       line-height: 50px;
       background: rgb(236,95,100);
       &.van-hairline--bottom::after{
         border-bottom-width:0
       }
      .van-nav-bar__title{
        font-size: 20px;
        font-family: PingFangSC-Regular;
        margin-left:-10px;
        height:50px;
        line-height:50px;
        width:100%;
        color:#fff;
      }
      .van-nav-bar__left{
        // bottom:50%;
        // margin-bottom:-0.23rem;
        .van-icon {
          color:#fff;
          font-size:25px;
        }
      }
      .van-nav-bar__right{
        // bottom:50%;
        // margin-bottom:-0.23rem;
        .van-icon {
          color:#fff;
          font-size:30px;
        }
      }
     }
   }
</style>
