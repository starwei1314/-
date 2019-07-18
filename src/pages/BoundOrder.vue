<template>
    <div class="" id="boundorder">
        <van-nav-bar title="绑定订单"  left-arrow fixed
         @click-left="onClickLeft"
        >
        </van-nav-bar>
        <div class="main">
            <div class="jifen">
                <div class="countNum">
                    {{positeNum}}<i>积分</i>
                </div>
                <div>绑定订单号领积分奖励</div>
            </div>
            <div class="shuru">
                <input type="text" class="orderInput" placeholder="请输入订单号" v-model='orderInfo.orderNumber'>
            </div>
            <div class="boundBtn" @click="boundOrder">
                绑定领积分  
            </div>
        </div>
    </div>
</template>
<script>
export default {
   data() {
      return {
          positeNum:1,
          orderInfo:{
              openId:'',
              orderNumber:''
          }
      }
   },
   methods:{
       boundOrder(){
        this.orderInfo.openId=this.$getLocal('openId')
        this.$HttpService.post('/official/integral/order_bind_record/bind',this.orderInfo).then(res => {
	       if(res.data.code=='0000'){
               
               this.$router.push('/mine')
	       	}
	      }).catch(err => {//抛出异常
	      console.log(err)
	      })
       },
          onClickLeft() {
         this.$router.back(-1)
        },
   }
}
</script>
<style lang='less' scoped>
#boundorder{
    width: 100%;
    height:100%;
    background: url("../assets/imgs/bg.png");
    background-size: 100% 100%;
    position: fixed;
   .van-nav-bar{
     width:100%;
     height:50px;
     background: rgb(236,95,100);
.van-nav-bar__title{
    font-size: 20px;
    font-family: PingFangSC-Regular;
    margin-left:-10px;
    height:100%;
    line-height:50px;
    width:100%;
    color:#fff;
      }
    .van-nav-bar__left{
        bottom:50%;
        margin-bottom:-23px;
    .van-icon {
          color:#fff;
          font-size:25px;
        }
      }
      .van-nav-bar__right{
        bottom:50%;
        margin-bottom:-23px;
        .van-icon {
          color:#fff;
          font-size:30px;
        }
      }
     }
     .main{
         width: 100%;
         height: 100%;
         background-image: url("../assets/imgs/bg.png");
         background-size: 100% 100%; 
         padding-top:125px;
         overflow: hidden;
        .jifen{
            height:223px;
            width:321px;
            background-image: url("../assets/imgs/jf.png");
            background-size: cover;
            margin:0 auto 89px;
            div{
                font-size: 18px;
                font-weight: 550;
                font-family: PingFangSC-Medium;
                color:rgb(166,134,250);
                // width: 1.8rem;
                height: 25px;
                line-height:25px;
                margin:0 auto;
                text-align: center;
            }
            .countNum{
                color:rgb(109,83,178);
                font-size: 45px;
                font-family: PingFangSC-Medium;
                // width: 1.76rem;
                height: 83px;
                line-height:83px;
               
                i{
                    color:rgb(220,173,137);
                    font-size: 14px;
                    font-family: PingFangSC-Medium;
                }
            }
        }
        .shuru{
            width: 100%;
            height:48px;
            margin-bottom:1.12rem;
            .orderInput{
            width: 264px;
            height:46px;
            vertical-align: top;
            display: block;
            border-radius:5px;
            margin:0 auto;
            border:1px solid rgb(166,134,250);
             outline:none;
             text-indent: 1em;
             font-size:14px;
             font-family: PingFangSC-Regular;
            }
        }
        
         .boundBtn{
             font-size: 16px;
             font-family: PingFangSC-Regular;
             height: 48px;
             width:264px;
             background-image:url("../assets/imgs/bt_code.png");
             background-size: cover;
             border-radius: 10px;
             color:#fff;
             line-height: 48px;
             text-align: center;
             position: fixed;
             bottom: 10px;
             left:56px;
         }
     }
}
 
</style>
