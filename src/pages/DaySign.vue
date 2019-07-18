<!--  -->
<template>
<div class='' id="daysign">
    <van-nav-bar title="每日签到"  left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    <div class="sign">
        <div class="signhead">
            {{getTimeNow()}}
            <!-- <div class="signTip">签到提醒<van-switch v-model="checked" /></div> -->
            <van-button type="default" class="signTip" @click='ruleShow'>签到规则</van-button>

        </div>
       <Calendar
           v-on:choseDay="clickDay"
           v-on:changeMonth="changeDate"
          :markDate='signDates'
          :markDateMore="noSignDays"
          :agoDayHide='((Date.parse(new Date())-8.64e7)/1000).toString()'
          :futureDayHide='(Date.parse(new Date())/1000).toString()'
          :textTop="['周一','周二','周三','周四','周五','周六','周日']"
         ></Calendar> 
         <div class="myposite" v-if="istodaySign">
             <p>{{positeNums}}</p>
             <p class="title">累计获得积分</p>
         </div>
      <van-dialog
            class="rulesT"
            title="签到规则"
            v-model="ruleToast"
            :showConfirmButton="false"
            > 
         <div class="rule">
           <ul class="rule-main">
            <li v-for='(item,index) in ruleInfoContinue' :key='index'>{{index+1}}.连续签到{{item.ruleStart}}-{{item.ruleEnd}}天，则每日签到奖励：{{item.ruleIntegral}}积分/日；</li>
            <li v-for='(item,indexAccumulate) in ruleInfoAccumulate' :key='indexAccumulate'>{{ruleInfoContinue.length+indexAccumulate+1}}.累计签到{{item.ruleStart}}-{{item.ruleEnd}}天，则每日签到奖励：{{item.ruleIntegral}}积分/日；</li>
           </ul>
          </div>
          <div class="cancleRule" @click="ruleToast=false"></div>
     </van-dialog>
    </div>
     <div class="successSign"  v-if="istodaySign">
        <p>签到成功</p>
        <p class='noBreak'>连续签到{{nobreakDays}}次</p>
    </div>
    <div class="qianNow"  v-if="!istodaySign">
         <p class="now" @click="clickDay(new Date().toLocaleDateString())">签到</p>
        <p class='noBreak'>连续签到{{nobreakDays}}次</p>
    </div>
</div>
</template>

<script>
import Calendar from 'vue-calendar-component';
export default {
components: {Calendar},
data() {
return {
    ruleToast:false,//规则弹框
    ruleInfoContinue:[],//连续签到规则详情
    ruleInfoAccumulate:[],//累计签到规则详情
    signDates:[],//已签到的日子
    noSignDay:[],//未签到的日子
    noSignDays:[], //没有有签到的日子
    checked:false,//当日已签到
    positeNums:0,//累计获得积分数
    istodaySign:false,//当天未签到
    nobreakDays:3,//不间断签到时间
    todayPosite:0//今天获取的积分数
};
},
methods: {
    getSignTimes(){
        //获取连续签到次数
        this.$HttpService.fetch('/official/sign/continue_recode/continue/times',{
              accountAppid:this.$getLocal('appid'),//公众号appid
              openid:this.$getLocal('openId'),
          }).then(res => {
           if(res.data.code=='0000'){
             this.nobreakDays=res.data.result
          }
        }).catch(err => {
	   	console.log(err)
            })
    },
    ruleShow(){//展示签到规则
        this.ruleToast=true
         this.$HttpService.fetch('/official/sign/sign_date/list/sign/rule',{
              merchantUid:this.$getLocal('merchantUid')
          }).then(res => {
           if(res.data.code=='0000'){
             this.ruleInfoContinue=res.data.result.signContinueModels
             this.ruleInfoAccumulate=res.data.result.signAccumulateModels
          }
        }).catch(err => {
	   	console.log(err)
            })

    },
    getStatus(){
        //验证当前日期是否已经签到
        this.$HttpService.post('/official/sign/sign_date/check/sign',{
              accountAppid:this.$getLocal('appid'),//公众号appid
              openid:this.$getLocal('openId'),
        }).then(res => {
          if(res.data.code=='0000'){
              if(res.data.remark=='000000'){//当前表示用户已签到
                  this.istodaySign=true
              }else{
                  this.istodaySign=false
              }
          }
        }).catch(err => {
	   	console.log(err)
            })

    },
    getSignRecord(){
             var month = ((new Date).getMonth()+1)>10?((new Date).getMonth()+1):'0'+((new Date).getMonth()+1);  //获取当前月
             var year = (new Date).getFullYear();　　//获取当前年
             var dataArr= [];　　//新建日期数组
             var dataLength = new Date(year,month).toJSON().substring(0,10).split("-")[2];   //获取当前年月日期最大值
             for (var i = 1; i <= dataLength ; i++) {
                var  d=i>=10?i:'0'+i;
                 var day=year+'-'+month+'-'+d
                 dataArr.push(day);  //存入数组得到本月所有的日期集合
              }  
            var arr=new Date().toLocaleDateString().split('/')//截取当前时间进行补零
            var yearX=arr[0]
            var monthX=arr[1]<10?'0'+arr[1]:arr[1]
            var dayX=arr[2]<10?'0'+arr[2]:arr[2]
            var currentDay=yearX+'-'+monthX+'-'+dayX//当前时间日期
            var index
            for(var j=0;j<dataArr.length;j++){
                if(dataArr[j]==currentDay){
                   index=j
                }
            }
            
        // 获取签到记录
        var data={
            accountAppid:this.$getLocal('appid'),//公众号appid
            openid:this.$getLocal('openId'),
            firstDayOfMonth:dataArr[0]
        }
        this.$HttpService.fetch('/official/sign/sign_date/list/sign',data).then(res => {
          if(res.data.code=='0000'){
                this.signDates=res.data.result//获取已签到的日期
                this.noSignDays=[]
                var dataNew=dataArr.slice(0,index+1)//得到截止到当前日期本月所有的日期数组
            //    console.log(dataNew)
             this.noSignDay=dataNew.filter(item=>{//
                  return this.signDates.indexOf(item)==-1
               })
              for(var k=0;k<this.noSignDay.length;k++){
                  this.noSignDays.push({//本月已过日期未签到
                      date:this.noSignDay[k],
                      className:'mark1'
                  })
              }
          }
        }).catch(err => {
	   	console.log(err)
            })

    },
    onClickLeft() {
             this.$router.back(-1)
            },
     getTimeNow(){
         var date = new Date();     
         var year = date.getFullYear();
         var month = date.getMonth() + 1;
         if (month >= 1 && month <= 9) {
             month = "0" + month;
         }
         var currentdate = year + "年" + month + "月";
         return currentdate;
     },     
    //  getPosite(){
    //      let openId=this.$getLocal('openId')
    //      //获取累计签到的积分   该接口暂时未对接   接口暂时错误
    //      this.$HttpService.fetch('/official/integral/personal_integral/get',{
    //           openId:openId,
    //       }).then(res => {
    //        if(res.data.code=='0000'){
    //         // this.positeNums=res.data.result.personalIntegralModel
    //       }
    //     }).catch(err => {
	//    	console.log(err)
    //         })
    //  },
      
     clickDay(val) {
         let appid= this.$getLocal('appid')
          if(!this.istodaySign){//判断当前签到状态！
        this.$HttpService.postJson('/official/sign/sign_date/save',{
              accountAppid:appid,//公众号appid
              openid:this.$getLocal('openId'),
          }).then(res => {
           if(res.data.code=='0000'){
              this.$toast(`恭喜您签到成功，得到`+this.todayPosite+`积分`);
              this.getSignRecord()
              this.getCumtrapz()
              this.istodaySign=true
          }
        }).catch(err => {
	   	console.log(err)
            })
        }else{
            this.$toast('您今天已经签到过');
        }
        },
    getCumtrapz(){//获取累计签到积分
        let appids= this.$getLocal('appid')
        this.$HttpService.fetch('/official/sign/singn_integral/count/accumulate/integral',{
              accountAppid:appids,//公众号appid
              openid:this.$getLocal('openId'),
          }).then(res => {
           if(res.data.code=='0000'){
               this.positeNums=res.data.result
          }
        }).catch(err => {
	   	console.log(err)
            })
    },   
    changeDate(data) {
          console.log(data); //左右点击切换月份
        },
},
created() {
this.getSignRecord()
this.getStatus()
this.getSignTimes()
// this.getPosite()
this.getCumtrapz()
},
mounted() {

},
}
</script>
<style lang='less'>
//@import url(); 引入公共css类
#daysign{
    padding-top:50px;
    min-height: 617px;
    background-image: url("../assets/imgs/day/bg.png");
    background-size: cover;
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
      .sign{
          width:320px;
          height:439px;
          margin: 20px auto 0;
          position: relative;
          box-shadow: 0px 29px 8px #e7e9ec;
     .van-dialog{
      &.rulesT{
          height: 330px;
          background-image: url('../assets/imgs/shai/popup.png');
          background-size: 100% 100%;
          padding:5px 5px;
          background-color:#4c4842;
          .van-dialog__header{
            padding-top: 10px!important;
          }
          .rule{
            margin-top: 30px;
           
            .rule-title{
            }
            .rule-main{
              list-style-type:disc;
              li{
                margin-top:10px;
                padding: 1px 10px;
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
          .signhead{
              width:100%; 
              border-top-left-radius:3px;
              border-top-right-radius:3px;
              height:70px;
              background-color:rgb(142,133,245);
              line-height: 70px;
              text-indent:0.5em;
              color:PingFangSC-Medium;
              font-size:24px;
              color:#fff;
              position: relative;
          }
          .signTip{
              height: 24px;
              line-height: 24px;
              font-size:12px;
              position: absolute;
              font-weight: 600;
              bottom:10px;
              right:10px;
              border-radius: 10px;
            //   .van-switch{
            //       font-size:16px!important;
            //       vertical-align: middle;
            //       margin-left:5px;
            //       background-color: rgba(34,31,31,0.26);
            //   }
          }
         .myposite{
             position: absolute;
             bottom:20px;
             left:50%;
             margin-left:-54px;

             p{
                color: rgb(109,83,178);
                font-weight: 550;
                font-size:26px;
                text-align: center;
                &.title{
                    color:rgb(60,61,67);
                    font-size: 18px;
                    font-weight: normal;
                }
             } 
         } 
        .wh_container{
          position: relative;
          .mark1{
              color:#000
          }
          .mark1::before{
                display: block;
                 content: '';
                 width: 4px;
                 height: 4px;
                 border-radius: 50%;
                 background-color: rgb(109,83,178);
                 position: absolute;
                 bottom: 2px;
                 left: 50%;
                 margin-left: -2px;
          }
          .wh_content_all{
              background-color: #fff;
              color:rgb(60,61,67);
              padding-bottom:60px;
          }
          .wh_top_changge{
            display: none;
            }
          .wh_content{
              .wh_top_tag{
                  color:rgb(60,61,67);
                  font-size:12px;
                  font-family: PingFangSC-Regular;

              }
              .wh_content_item{
                  color:rgb(60,61,67);
                  position: relative;
                  .wh_chose_day{
                      background-color: #fff;
                    //   background-image: url('../assets/imgs/day/ic.png');
                      background-size:100% 100%;
                  }
                  .wh_item_date{
                      width: 30px;
                      height: 30px;
                      line-height: 30px;
                  }
                  .wh_isToday{
                      background-color: #fff;
                  }
                
              }
              
             .wh_content_item>.wh_isMark{
                 background-color:rgb(236,95,100);
                 color:#fff;
            
             }
          }  
      }  
      }
    .successSign{
          width:100%;
          position: relative;
          top:10px;
          p{
            color: rgb(109,83,178);
            font-weight: 550;
            font-size:26px;
            text-align: center;
            &.noBreak{
                font-size: 12px;
                font-weight: normal;
                width:98px;
                height:18px;
                line-height: 18px;
                margin:10px auto 0;
                background-image: url("../assets/imgs/day/txt.png");
                background-size: cover;
                border-radius: 12px;
                color:#fff;
            }
          }   
         }
         .qianNow{
             width:100%;
             position: relative;
             top:0.4rem;
          p{
            color: rgb(109,83,178);
            font-weight: 550;
            font-size:26px;
            text-align: center;
            &.now{
               width: 88px;
               height: 90px;
               margin: 0 auto;
               background-image: url(../assets/imgs/day/bt_1.png);
               background-size: 100% 100%;
               font-size: 19px;
               line-height: 80px;
               color: #fff;
               border-radius: 50%;
            }
            &.noBreak{
                font-size: 12px;
                font-weight: normal;
                width:98px;
                height:18px;
                line-height:18px;
                margin:10px auto 0;
                background-image: url("../assets/imgs/day/txt.png");
                background-size: cover;
                border-radius: 12px;
                color:#fff;
                position: absolute;
                bottom: 0;
                left: 50%;
                margin-left: -49px;
            }
          }   
         }
}
</style>