<template>
    <div class="" id="getprize">
      <van-nav-bar title="抽奖活动"  left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
     <div class="luckDraw">
      <div class="container">
         <div class="turntable-wrapper">
           <div class="prizeNum">
             <div>您有 <span>{{getPrizeNum}}</span>  次抽奖机会</div>
            </div>
           <p class="integral">我的积分: <span>{{myposite}}</span></p>
         <div class="luck-wrapper">
          
          <ul class="nineGrid">
         <li class="row">
          <div :class="index === 0 ? 'active': ''">
           <div class="wrapper">
            <img :src="prizeList.length&&getImgurl(prizeList[0].awardImg)" alt="">
            <p>{{prizeList.length&&prizeList[0].awardName}}</p>
           </div>
           <div class="mask"></div>
          </div>
          <div :class="index === 1 ? 'active': ''">
           <div class="wrapper">
            <img :src="prizeList.length&&getImgurl(prizeList[1].awardImg)" alt="">
            <p>{{prizeList.length&&prizeList[1].awardName}}</p>
           </div>
           <div class="mask"></div>
          </div>
          <div :class="index === 2 ? 'active': ''">
           <div class="wrapper">
            <img :src="prizeList.length&&getImgurl(prizeList[2].awardImg)" alt="">
            <p>{{prizeList.length&&prizeList[2].awardName}}</p>
           </div>
           <div class="mask"></div>
          </div>
        </li>
      <li class="row">
       <div :class="index === 7 ? 'active': ''">
        <div class="wrapper">
         <img :src="prizeList.length&&getImgurl(prizeList[7].awardImg)" alt="">
         <p>{{prizeList.length&&prizeList[7].awardName}}</p>
        </div>
        <div class="mask"></div>
       </div>
       <div class="getLuck" @click="startLottery">
        <p>立即<br>抽奖</p>
       </div>
        <div :class="index === 3 ? 'active': ''">
        <div class="wrapper">
         <img :src="prizeList.length&&getImgurl(prizeList[3].awardImg)" alt="">
         <p>{{prizeList.length&&prizeList[3].awardName}}</p>
        </div>
        <div class="mask"></div>
       </div>
      </li>
      <li class="row">
      <div :class="index === 6 ? 'active': ''">
           <div class="wrapper">
            <img :src="prizeList.length&&getImgurl(prizeList[6].awardImg)" alt="">
            <p>{{prizeList.length&&prizeList[6].awardName}}</p>
           </div>
           <div class="mask"></div>
      </div>
      <div :class="index === 5 ? 'active': ''">
        <div class="wrapper">
         <img :src="prizeList.length&&getImgurl(prizeList[5].awardImg)" alt="">
         <p>{{prizeList.length&&prizeList[5].awardName}}</p>
        </div>
        <div class="mask"></div>
       </div>
          <div :class="index === 4? 'active': ''">
        <div class="wrapper">
         <img :src="prizeList.length&&getImgurl(prizeList[4].awardImg)" alt="">
         <p>{{prizeList.length&&prizeList[4].awardName}}</p>
        </div>
        <div class="mask"></div>
       </div>
      </li>
     </ul>
      <div class="myprize" @click="$router.push('/myPrize')">
      我的奖品
      </div>
    </div>
   </div>
  </div> 
 <van-dialog
  class="rulesT"
  title="抽奖规则"
  v-model="ruleToast"
  :showConfirmButton="false"
  > 
   <div class="rule">
     <!-- <p class="rule-title">抽奖规则</p> -->
     <ul class="rule-main">
      <li> 1.用户每次进行抽奖消耗{{rules.focus}}积分;</li>
      <li> 2. 积分赚取：每日签到、关联订单可获得积分哦;</li>
       <li v-if="rules.beginTime!=null||rules.beginTime!=''">3.活动时间：{{rules.beginTime}}-{{rules.endTime}};</li>
      <!-- <li>  活动最终解释权归卖家所有。</li> -->
     </ul>
    </div>
    <div class="cancleRule" @click="ruleToast=false"></div>
  </van-dialog>
  <!-- 抽中奖品弹窗 -->
  <van-dialog 
    class="redBag"
    v-model="showToast"
    :showConfirmButton="false"
    overlay
  > 
    <div class="zanshi">
      <p >恭喜获得</p>
      <p class="redNum">{{prizeNow.awardName}}  </p>
      <p class="redType"> <img :src="getImgurl(prizeNow.awardImg)" alt=""></p>
    </div>
  <div class="line"></div>
  <div class="get" @click="getMoney" >领取奖品</div>
  <div class="cancle" @click="closeToast()"></div>
 </van-dialog>
 <!-- 未抽中奖品弹窗 -->
 <van-dialog 
    class="lose"
    v-model="loseToast"
    :showConfirmButton="false"
    overlay
  > 
    <img src="../assets/imgs/lucky/sorry.png" alt="">
    <div class="line"></div>
    <div class="loseTitle">
      <p>很遗憾,未中奖</p>
      <p>不要气馁, <span @click="$router.push('/daysign')">签到领积分</span>  </p>
    </div>
  <div class="cancle" @click="loseToast=false"></div>
 </van-dialog>
 <!-- 领取长按二维码弹窗 -->
 <van-dialog 
    class="erweima"
    v-model="erweimaToast"
    :showConfirmButton="false"
    overlay
  > 
    <img src="../assets/imgs/lucky/sorry.png" alt="">
    <div class="line"></div>
    <div class="erweimaTitle">
      <p>长按识别图中的二维码</p>
      <p>加客服领取</p>
    </div>
  <div class="cancle" @click="erweimaToast=false"></div>
 </van-dialog>
 </div>
 <div class="rules" @click="prizeRule">
  抽奖规则
 </div>
</div>
</template>
<script>
export default {
   data() {
      return {
      everyExpend:10,//每次消耗的积分数量
      myposite:1000,//我的积分数量
      daySignNum:0,//每日积分抽奖次数
      loseToast:false,//谢谢惠顾弹窗
      ruleToast:false,//规则弹窗
      erweimaToast:false,//长按领取
      getPrizeNum:0,//免费抽奖的次数  
      title: '积分转盘',
      index: -1,    // 当前转动到哪个位置，起点位置
      count: 8,    // 总共有多少个位置
      timer: 0,    // 每次转动定时器
      speed: 200,   // 初始转动速度
      times: 0,    // 转动次数
      cycle: 50,   // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1,   // 中奖位置
      click: true,
      showToast: false,
      toastType: 'luck',
      luckPrize:'',//中奖奖品
      prizeNow:{
        awardImg:'',
        awardName:""
      },
      prizeList:[],//奖品列表
      rules:{
        beginTime:'',
        endTime:'',
        focus:0,

      }
      }
   },
   methods:{
     getImgurl(val){//获取oss图片，进行展示
      //  console.log(val)
    	  let self=this
    	  let imgUrl=''
    	  self.$oss((client) => {
    	      let result = client.signatureUrl(val, {'process' : 'image/resize,h_80,w_80'})
    	      imgUrl=result
    	    })
    	    return imgUrl
    	},
    getPosite(){
      //获取用户积分详情
       this.$HttpService.fetch('/official/integral/personal_integral/get',{
            openId:this.$getLocal('openId')
          }).then(res => {
           if(res.data.code=='0000'){
             this.myposite=res.data.result.personalIntegralModel.availableIntegral
          }
        }).catch(err => {
	   	console.log(err)
            })
    },
    prizeRule(){//抽奖规则
    this.ruleToast=true
    this.$nextTick(()=>{
      this.$HttpService.fetch('/lottery/draw/all/rule',{
        merchantUid:this.$getLocal('merchantUid')
      }).then(res=>{
        if(res.data.code=='0000'){
          this.rules.beginTime=res.data.result.beginTime
           this.rules.endTime=res.data.result.endTime
            this.rules.focus=res.data.result.focusCount
             
        }
      })
    })
    },
    getImgurl(val){//获取oss图片，进行展示
    	  let self=this
    	  let imgUrl=''
    	  self.$oss((client) => {
    	      let result = client.signatureUrl(val, {'process' : 'image/resize,h_80,w_80'})
    	      imgUrl=result
    	    })
    	    return imgUrl
    	},
    getPrize(){//获取奖品列表
       this.$HttpService.fetch('/official/lottery/lottery_award/list/lottery/award',{
            merchantUid:this.$getLocal('merchantUid')
          }).then(res => {
           if(res.data.code=='0000'){
             this.prizeList=res.data.result
          }
        }).catch(err => {
	   	console.log(err)
            })
    },
    getFreePrieze(){
      //  获取免费抽奖次数
        this.$HttpService.fetch('/official/lottery/lottery_fans_base/free/times',{
              accountAppid:this.$getLocal('appid'),//公众号appid
              openid:this.$getLocal('openId'),
          }).then(res => {
           if(res.data.code=='0000'){
             this.getPrizeNum=res.data.result
          }
        }).catch(err => {
	   	      console.log(err)
            })
    },
    getDayPosite(){//获取每天的抽奖次数
     this.$HttpService.fetch('/official/lottery/lottery_fans_integral/integral/times',{
              accountAppid:this.$getLocal('appid'),//公众号appid
              openid:this.$getLocal('openId'),
          }).then(res => {
           if(res.data.code=='0000'){
             this.daySignNum=res.data.result.times
             this.everyExpend=res.data.result.perIntegral
          }
        }).catch(err => {
	   	console.log(err)
            })
    },
    getMoney(){
      //领取奖品事件
      //更换长按二维码识别功能
      this.$router.push('/myprize')
      // this.erweimaToast=true//长按领取按钮
      this.closeToast()
      
    },
       // 开始抽奖
    startLottery () {
      var data={
         accountAppid:this.$getLocal('appid'),//公众号appid
         openid:this.$getLocal('openId'),
         drawType:"free" 
      }
      if(this.getPrizeNum==0){//假如免费次数为0时，则更换为积分抽奖方式
        data.drawType='integral'
        if(this.daySignNum==0){
          //假如当日的积分抽奖次数为0时
          this.$toast('今日抽奖次数已达上限')
        }else{
           this.$dialog.confirm({
            title: '',
            confirmButtonColor:'#ec5f64',
            message: '每次抽奖，消耗'+this.everyExpend+'积分'
          }).then(() => {
          this.$HttpService.post('/lottery/draw/lottery',data).then(res=>{
            if(res.data.code=='0000'){
             this.luckPrize=res.data.result//获取中奖信息
             this.closeToast()
             this.speed = 200
             this.click = false
             this.startRoll()
             this.getFreePrieze()
            }
        })
      //点击以后抽奖机会减1
      if (!this.click) {//通过调用接口实现  暂不需要该功能
        return 
      }
          }).catch((err) => {
          console.log(err)
          });
        } 
      }else{
        this.$HttpService.post('/lottery/draw/lottery',data).then(res=>{
         if(res.data.code=='0000'){
          this.luckPrize=res.data.result//获取中奖信息
          this.closeToast()
          this.speed = 200
          this.click = false
          this.startRoll()
          this.getFreePrieze()
        }
      })
      //点击以后抽奖机会减1
      if (!this.click) {//通过调用接口实现  暂不需要该功能
        return 
      }
      }
     
    },

    // 开始转动
    startRoll () {
      this.times += 1  // 转动次数
      this.oneRoll()  // 转动过程调用的每一次转动方法，这里是第一次调用初始化

      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.index) {
        clearTimeout(this.timer)   // 清除转动定时器，停止转动
        this.prize = -1
        this.times = 0
        this.click = true
        if(!this.loseToast){
            this.showToast = true
        }
        this.toastType = 'comeOn'
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10   // 加快转动速度
        } else if (this.times === this.cycle) {    // 随机获得一个中奖位置
          // const index = parseInt(Math.random() * 10, 0) || 0
         const index= this.prizeList.findIndex(item=>{
            return   item.awardUid==this.luckPrize.awardUid
          })
          this.prizeNow=this.prizeList[index]
          this.prize =index //获奖的奖品索引位置   根据后端返回获取对比数组UID   正确则返回对应的索引值
          
          // if(this.prize==4){ //判断如果用户转到谢谢惠顾时  打开抱歉弹框 
          //   this.loseToast=true
          // }
          //此时根据奖品索引值返回这个奖品对象
          if (this.prize > 7) {
            this.prize = 7
          }
        } else if (this.times > this.cycle + 10 &&
          ((this.prize === 0 && this.index === 7) || this.prize === this.index + 1)) {
          this.speed += 110
        } else {
          this.speed += 20
        }

        if (this.speed < 40) {
          this.speed = 40
        }
        this.timer = setTimeout(this.startRoll, this.speed)
      }
    },

    // 每一次转动
    oneRoll () {
      let index = this.index  // 当前转动到哪个位置
      const count = this.count  // 总共有多少个位置
      index += 1
      if (index > count - 1) {
        index = 0
      }
      this.index = index
    },

    // 关闭弹出框
    closeToast () {
      this.showToast = false
    },
    onClickLeft() {
         this.$router.back(-1)
        },
  },

  beforeMount () {

  },

  created () {
    this.getFreePrieze()
    this.getDayPosite()
    this.getPrize()
    this.getPosite()
  },

  beforeDestroy () {

  }
   
}
</script>
<style lang='less' scoped>
#getprize{
    padding-top:50px;
    min-height:617px;
    background-image: url("../assets/imgs/lucky/bg.png");
    background-size:cover;
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
.luckDraw {
  .turntable-wrapper {
    position: relative;;
    padding-top:20px;
    .prizeNum{
      width: 244px;
      height:75px;
      margin: 0 auto;
      background-image: url("../assets/imgs/lucky/times.png");
      background-size: cover;
      div{
        font-size:14px;
        margin-left:77px;
        height:40px;
        line-height: 65px;
       font-family: PingFangSC-Medium;
       color:rgb(232,52,58);
       font-weight: 550;
        span{
        font-size:25px;
        font-weight: 550;
        color: rgb(166,134,250);
        font-family: Roboto-Medium;
      }
      }
    }
      .integral {
        width: 100%;
        color: rgb(60,61,67);
        font-size:16px;
        font-weight: normal;
        text-align: center;
        font-family: PingFangSC-Regular;
        margin-bottom:10px;
        span {
          font-weight: 600;
          font-family: PingFangSC-Regular;
          color: rgb(109,83,178)
        }
      }
    .luck-wrapper {
      width: 336px;
      height: 386px;
      margin: 0 auto;
      position: relative;
      background-image: url("../assets/imgs/lucky/cj.png");
      background-size: 100% 100%;
      .nineGrid {
        position: absolute;
        top:18px;
        left: 18px;
        // margin-left: -1.3rem
        width: 300px;
        height: 264px;
        li {
          height: 84px;
          display: flex;
          padding-top: 5px;
          > div {
            flex: 1;
            margin-right: 5px;
            height: 100%;
            text-align: center;
            position: relative;

            .wrapper {
              width: 100%;
              height: 100%;
              margin: 0;
              p{
                font-size:14px;
                color: rgb(232,52,58);
                font-family: PingFangSC-Regular;
                // position: absolute;
                // top: 52px;
                // left: 50%;
                // margin-left: -30px;
                margin-top: 10px;
              }
            }

            img {
              width:42px;
              height: 30px;
              vertical-align: top;
              margin-top:8px;
            }

            .mask {
              position: absolute;
              top: -9px;
              left: -2px;
              width: 102px;
              height: 94px;
              // opacity: 0.5;
              border-radius:10px;
              // background-color: #000;
              border:7px solid rgb(149,129,246);
              display: none;
              box-sizing: border-box;
            }
          }

          > div.active {
            .mask {
              display: block;
            }
          }

          > div:first-child {
            // margin-left:5px;
          }

          > div.getLuck {
            font-size: 0;

            p {
              font-size:20px;
              font-weight: 600;
              color: #fff;
              // line-height: 1.1;
              margin-top: 11px;
            }
          }
        }

        li:last-child {
          margin-bottom: 5px;
        }
      }
  .myprize{
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color:#fff;
  width: 237px;
  height: 49px;
  font-weight: 550;
  line-height: 49px;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left:-118px;
  text-align: center;
}
    }

    .share {
      width:160px;
      height: 42px;
      margin: 0 auto;
      text-align: center;
      line-height:42px;
      margin-top: 22px;
      color: #6d2d00;
      font-size: 16px;
      font-weight: 600;

      .icon-go {
        display: inline-block;
        vertical-align: middle;
        margin-bottom:2px;
      }
    }
  }
  .van-dialog{
      &.rulesT{
          height: 330px;
          background-image: url('../assets/imgs/shai/popup.png');
          background-size: 100% 100%;
          // padding:5px 5px;
          background-color:#4c4842;
          .van-dialog__header{
            padding-top: 10px!important;
          }
          .rule{
            margin-top: 30px;
            .rule-title{
            }
            .rule-main{
              // list-style-type:disc;s
              li{
                margin-top:10px;
                padding: 2px 15px;
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
  }
  
}
.van-dialog.lose{
  width:333px;
  height:418px;
  background-image: url("../assets/imgs/lucky/hongbao.png");
  background-size: 100% 100%;
  background-color:#4c3a3c;
  }
  .van-dialog.erweima{
  width:333px;
  height:418px;
  background-image: url("../assets/imgs/lucky/hongbao.png");
  background-size: 100% 100%;
  background-color:#4c3a3c;
  }
.van-dialog.redBag{
  width:333px;
  height:418px;
  background-image: url("../assets/imgs/lucky/hongbao.png");
  background-size: 100% 100%;
  background-color:#4c3a3c;
  .zanshi{
    width: 264px;
    height: 114px;
    margin:27px 33px 0;
    background-image: url('../assets/imgs/lucky/ticket.png');
    background-size: 100% 100%;
    p{
      font-family: PingFangSC-Medium;
      font-size:20px;
      font-weight: 550;
      color:rgb(60,61,67);
      text-align: center;
      &:nth-child(1){
        padding-top:10px;
      }
      &.redNum{
        font-size:33px;
        color:rgb(232,52,58);
        span{
          font-size: 15px;
          color:rgb(232,52,58)
        }
      }
      &.redType{
        font-weight:500;
        font-family: PingFangSC-Regular;
        text-align: center;
        img{
          width:64px;
          height:64px;
        }
      }
    }
  }
  .get{
    width:264px;
    height:48px;
    background-image: url("../assets/imgs/button_currency.png");
    background-size: cover;
    border-radius: 4px;
    text-align: center;
    line-height:48px;
    position: absolute;
    top:215px;
    left:35px;
   color: rgb(255,255,255);
  }
  .cancle{
    width: 32px;
    height: 32px;
    position: absolute;
    display:inline-block;
    bottom: 0;
    left: 151px;
  }
  .line{
    width: 26px;
    height: 1px;
    border-bottom:2px dashed rgb(242,224,195);
    position: absolute;
    top:185px;
    left:35px;
  }
}
.lose{
  img{
    width: 127px; 
    position: absolute;
    top:20px;
    left: 50%;
    margin-left: -675px;
  }
  .line{
    width: 260px;
    height: 1px;
    border-bottom:2px dashed rgb(242,224,195);
    position: absolute;
    top:185px;
    left:35px;
  }
  .loseTitle{
    left: 50%;
    top: 2rem;
    position: absolute;
    margin-left: -93px;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color:rgb(60,61,67);
    text-align: center;
    span{
      color:rgb(109,83,178);
      text-decoration: underline;
      &:hover{}
    }
  }
  .cancle{
    width: 32px;
    height:32px;
    position: absolute;
    display:inline-block;
    bottom: 0;
    left:151px;
  }
}
.erweima{
  img{
    width: 127px; 
    position: absolute;
    top:20px;
    left: 50%;
    margin-left: -67.5px;
  }
  .line{
    width:260px;
    height: 1px;
    border-bottom:2px dashed rgb(242,224,195);
    position: absolute;
    top:185px;
    left:35px;
  }
  .erweimaTitle{
    left: 50%;
    top: 2rem;
    position: absolute;
    margin-left: -93px;
    font-family: PingFangSC-Medium;
    font-weight:550;
    font-size: 20px;
    color:rgb(60,61,67);
    text-align: center;
  }
  .cancle{
    width: 32px;
    height:32px;
    position: absolute;
    display:inline-block;
    bottom: 0;
    left: 151px;
  }
}
.rules{
  width:104px;
  height: 32px;
  border-radius:16px;
  background-color: rgb(132,105,197);
  margin: 0 auto;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  text-align: center;
  line-height: 32px;
  color:#fff;
  margin-top:27px;
}
}
</style>
<style  >
  .ruleT .van-dialog__header{
    padding-top: 10px!important;
  }
</style>
