<template>
    <div class="" id="boundPhone">
         <van-nav-bar title="绑定手机号"  left-arrow fixed
         @click-left="onClickLeft"
        >
         <!-- <van-icon name="more" slot="right" /> -->
        </van-nav-bar>
        <div class="main">
            <div class="jifen">
                <div class="countNum">
                    <span>￥</span>{{positeNum}}<i>最高</i>
                </div>
                <div>首次激活领现金红包</div>
            </div>
            <div class="shuru">
                <input type="text" class="orderInput" placeholder="请输入手机号" v-model="registerInfo.mobile">
                <div>
                    <input type="text" class="phoneInput" placeholder="请输入验证码" v-model="registerInfo.smsCode"> 
                    <van-button type="default" :disabled="sendMsgDisabled==2" @click="getCode">{{verificationText}}</van-button>
                </div>
            </div>
            <div class="boundBtn" @click="getActive">
                激活领红包  
            </div>
        </div>
    <van-dialog
    class="rulesT"
    title=""
    v-model="moneyToast"
    :showConfirmButton="false"
    :beforeClose='jumpMine'
    > 
        <div class='getMain'>
            <div class="title">领取成功</div>
            <div class="money">恭喜获得¥{{money}}元红包</div>
        </div>
    <div class="cancleRule" @click="moneyToast=false"></div>
  </van-dialog>
    </div>
</template>
<script>
export default {
   data() {
      return {
          money:1,//获得的红包
          activeSuccess:true,
          sendMsgDisabled:1,
          verificationText:"获取验证码",
          positeNum:1,
          moneyToast:false,
          registerInfo:{
              mobile:"",
              smsCode:''
          }
      }
   },
   created(){
       
   },
   methods:{
    weixinJS(){//获取微信接口
    let url=window.location.href
    var radom = Math.random().toString(36).substr(2);
    var timestamp = (new Date()).getTime();
    let data={
        openid:this.$getLocal('openId'),
        url:url.split('#')[0]
    }
    this.$HttpService.fetch('/official/jsapi/signature/get',data).then(res => {
         wx.config({
             debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
             appId: this.$getLocal('appid') ,// 必填，公众号的唯一标识
             timestamp: res.data.result.timestamp, // 必填，生成签名的时间戳
             nonceStr: res.data.result.nonceStr, // 必填，生成签名的随机串
             signature: res.data.result.signature,// 必填，签名
             jsApiList: ["closeWindow"] // 必填，需要使用的JS接口列表
    });
        wx.ready(function(){
            wx.closeWindow();
        });
        wx.error(function(){});
      }).catch(err=>{
          console.log(err)
      })
      
 },
     getClose(){
      this.weixinJS()
    },
        getActive(){//激活红包
        //获取验证码后验证号码是否绑定成功
        let openId= this.$getLocal('openId')
        let appid= this.$getLocal('appid')
        var data={
             mobile:this.registerInfo.mobile,
             smsCode:this.registerInfo.smsCode,
             openid:openId,
             acccountAppid:appid,
        }
        this.$HttpService.postJson('/official/wechat/wechat_fans/activate',data).then(res => {
                if(res.data.code=='0000'){
                    //点击激活红包则弹出领取成功弹窗？红包如何发送？
                   this.getClose()
                    // this.moneyToast=true
                }else{
                  
                }
            }).catch(err => {
                console.log(err)
            })
        },
         onClickLeft() {
         this.$router.back(-1)
        },
       	getCode(){
      		var self=this
            if(self.registerInfo.mobile==''){
                this.$toast('请输入手机号')
                return false
            }
            var data={
                mobile:self.registerInfo.mobile,
            }
            self.$HttpService.post('/sms/code/mobile/send',data).then(res => {
                if(res.data.code=='0000'){
                    self.sendMsgDisabled=2
                    self.count = 60
                    var interval = window.setInterval(function() {
                        self.count--
                        self.verificationText=self.count+"s 重新获取"
                        if(self.count <= 0) {
                            self.sendMsgDisabled = 1;
                            self.verificationText="获取验证码"
                            window.clearInterval(interval);
                        };
                    }, 1000);
                }else{
                  
                }
            }).catch(err => {
                console.log(err)
            })
      		
        },
        jumpMine(done){//关闭弹窗后，跳转到个人中心
            this.$router.push('/mine')
            done()

        }
   }
}
</script>
<style lang='less' scoped>
#boundPhone{
    width: 100%;
    height:100%;
    background: url("../assets/imgs/bg.png");
    background-size: 100% 100%;
    position: fixed;
     .van-dialog.rulesT{
    height: 250px;
    background-image: url('../assets/imgs/popup_success.png');
    background-size: 100% 100%;
    padding:10px;
    background-color:#4c4842;
    .van-dialog__header{
      padding-top: 5px;
     color: #fff;
    }
    .getMain{
        margin-top: 50px;
    .title{
        font-family: PingFangSC-Medium;
        font-size:30px;
        font-weight:550;
        text-align: center;
    }
     .money{
         margin-top: 0.1rem;
         font-family: PingFangSC-Regular;
         font-size: 20px;
         color:rgb(232,52,58);
         text-align: center;
     }
    }
    
    }
  .cancleRule{
    width: 32px;
    height:32px;
    position: absolute;
    display:inline-block;
    bottom: 0;
    left: 50%;
    margin-left: -16px;
  }
  }
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
         background-size: cover; 
         padding-top:125px;
        .jifen{
            height: 241px;
            width:321px;
            background-image: url("../assets/imgs/shai/red.png");
            background-size: cover;
            margin:0 auto 53px;
            div{
                font-size: 18px;
                font-weight: 550;
                font-family: PingFangSC-Medium;
                color:rgb(232,52,58);
                // width: 1.8rem;
                height: 25px;
                line-height:45px;
                margin:0 auto;
                text-align: center;
            }
            .countNum{
                color:rgb(232,52,58);
                font-size:45px;
                font-family: PingFangSC-Medium;
                // width: 1.76rem;
                height: 83px;
                line-height: 120px;
               span{
                color:rgb(232,52,58);
                font-size: 25px;
                font-family: PingFangSC-Medium;
               }
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
            margin-bottom:112px;
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
             margin-bottom: 10px;
            }
            div{
                height: 48px;
              .phoneInput{
                     width: 146px;
                     height:46px;
                     vertical-align: top;
                     margin-left:63px;
                     border-radius:5px;
                     margin-left: 56px;
                     border:1px solid rgb(166,134,250);
                     outline:none;
                     text-indent: 1em;
                     font-size:14px;
                     font-family: PingFangSC-Regular;
                     }
             button{
                height:46px;
                display: inline-block;
                background-color: rgb(167,123,252);
                font-size:14px;
                color:#fff;
                font-family: PingFangSC-Regular;
                vertical-align: top;
                border-radius:5px;
                text-align: center;
                line-height:46px;
                
            }
                }
           
        }
         .boundBtn{
             font-size: 16px;
             font-family: PingFangSC-Regular;
             height:48px;
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

</style>
