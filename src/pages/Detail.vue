<template>
    <div class="" id="detail">
            <div class="detailImg">
                <div class="back" @click="$router.back(-1)"></div>
                <img :src="getImgurl(detail.cover)" alt="">
                <div class="lastTime">
                 <div class="last"> 
                    <div class="positeFev">
                        <span class='positeLeave'> {{detail.needIntegral}}</span>
                        <span class="lastNum">剩余 <span>{{detail.remainingCount}}</span> 件</span>
                    </div>
                    <div class="positeRight">
                        积分兑换
                    </div>
                 </div>
                 <div class="lastRight">
                   <div id="lastTimes">
                         <div > 距离剩余时间 {{time(detail.expiredTime)}}</div>
                         <div>
                            <span class='time'>{{day}}</span>
                            <span class='time'>{{hour}}</span>
                            <span class='time'>{{minute}}</span> 
                            <span class='time'>{{second}}</span>
                         </div>
                    </div> 
                 </div>
             </div>
            </div>
            <div class="detailTile">
               <div class="top">{{detail.summary}}</div> 
               <div class="main">
                   商品介绍:{{detail.remark}}
                   <div>商品名称：{{detail.name}}</div>
                   <div>商品积分：{{detail.needIntegral}}</div>
                   <div>商品类目{{detail.categoryName}}</div>
               </div>
            </div>
           <div class="bar">
               <div href="#" class="concat">
                   <i></i> 
                  <span>联系客服</span>
               </div>
                <button href="#" class="nowDui" @click="jumpOrder">
                   立即兑换
               </button>
           </div>
    </div>
</template>
<script>
// import { clearInterval } from 'timers';
export default {
   data() {
      return {
          hour:0,
          day:0,
          minute:0,
          second:0,
          timer :null,//定时器
          detail:{
            // imgUrl:require("../assets/imgs/bag.jpg"),
            // nums:0,
            // title:"RELX悦刻电子烟男女正品2018新款大烟雾充电式一次性烟弹包邮",
            // positeNumeber:1000,//积分数
          },
         
      }
   },
   created(){
    
   },
   mounted(){
    this.getDeatil()
    this.timer = setInterval(this.time,1000);
   },
   destroyed(){
           clearInterval(this.timer)
            this.timer = null;
   },
   methods:{
        getImgurl(val){//获取oss图片展示
    		  let self=this
    		  let imgUrl=''
    		  self.$oss((client) => {
    		      let result = client.signatureUrl(val, {'process' : 'image/resize,h_375,w_375'})
    		      imgUrl=result
    		    })
    		    return imgUrl
    		},
       getDeatil(){
           //获取商品详情
         this.$HttpService.fetch('/official/integral/mall_product/detail',{uid:this.$route.query.uid}).then(res => {
	        if(res.data.code=='0000'){
                this.detail=res.data.result
	        	}
	          	}).catch(err => {//抛出异常
	         	console.log(err)
	          	})
       },
        time(val){
             var bt = new Date(val);
             var dt = new Date()
             var t = parseInt((bt-dt)/86400000%30);
             var h = parseInt((bt-dt)%86400000/3600000); 
             var m = parseInt((bt-dt)%86400000%3600000/60/1000);
             var s = parseInt((bt-dt)%86400000%3600000%60000/1000);
             if(s<0){
              m--;
              s=59;
             }
             if(m<0){
              h--;
              m=59;
             }
             if (h<0) {
              t--;
              h=23;
             }
             if (t<0) {
              t=0;
             }
             if (t<=0&&h<=0&&m<=0&&s<=0) {
              clearInterval(this.timer);
                }
            this.hour = h<10?"0"+h:h;
            this.day= t<10?"0"+t:t;
            this.minute = m<10?"0"+m:m;
            this.second = s<10?"0"+s:s;
          
    },
    jumpOrder(){
        //点击立即兑换按钮，新增商品到兑换订单
        var data ={
        "nickname": 'Alex',
	    "openId": this.$getLocal('openId'),
	    "productUid": this.detail.uid,
	    "productName": this.detail.name,
	    "cover": this.detail.cover,
	    "exchangeCount": 1,
	    "totalIntegral": this.detail.needIntegral,
        }
        this.$HttpService.postJson('/official/integral/product_exchange_record/save',data).then(res => {
	        if(res.data.code=='0000'){
                this.$router.push("/ordermange/")
	        	}
	          	}).catch(err => {//抛出异常
	         	console.log(err)
	          	})
    },  
   
   }
}
</script>
<style lang='less' scoped>
#detail{
    .detailImg{
        height:100%;
        width:100%;
        position: relative;
        .back{
            width:24px;
            height:24px;
            background-image: url("../assets/imgs/icon/back.png");
            background-size: cover;
            position: absolute;
            top:35px;
            left:20px;
        }
        img{
            width:100%;
            vertical-align:top;
        }
        .mint-button--normal{
            position: absolute;
            border-radius: 50%;
            top:10px;
            left:10px;
        }
          .lastTime{
            //  position: absolute;
            //  bottom: 0;
            //  left:0;
             height:56px;
             width:100%;
             background-image: url("../assets/imgs/details_bg.png");
             background-size: cover;
             overflow: hidden;
            .last{
                font-size: 12px;
                font-family: PingFangSC-Regular;
                color:rgb(165,167,175);
                width:65%;
                overflow: hidden;
                height:100%;
                float: left;
                .positeFev{
                    float: left;
                    margin-left:16px;
                    span{
                        &.positeLeave{
                            color:rgb(255,255,255);
                            font-size:25px;
                            font-family: PingFangSC-Regular;
                            display: block;
                            font-weight: 600;
                           
                        }
                        &.lastNum{
                            width:100%;
                            display:block;
                            text-align: center;
                            color:rgba(255,255,255,0.65);
                            font-size: 12px;
                            font-family: PingFangSC-Regular;
                        }
                    }
                }
                .positeRight{
                    float: left;
                    color:rgb(255,255,255);
                    font-size:16px;
                    font-family: PingFangSC-Regular;
                    margin-top:13px;
                    margin-left:20px;
                }
            
            }
            .lastRight{
              color:rgb(139,87,42);
              font-size:12px;
              font-family: PingFangSC-Regular;
              width:35%;
              float: left;
              #lastTimes{
                  margin-top:8px;
                  div{
                      text-align: center;
                      .time{
                          color:#fff;
                         background-color:rgb(139,87,42);
                            width:17px;
                            height:17px;
                            display: inline-block;
                            text-align: center;     
                  }
                  }
              }
            }
    }
    }
    .detailTile{
        .top{
            font-size:18px;
            font-family: PingFangSC-Regular;
            color:rgb(51,51,51);
            width:343px;
            height:56px;
            margin:8px auto 10px;
            font-weight: 550;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            border-bottom:1px solid rgb(238,238,238);
        }
        .main{
            font-size:18px;
            font-family: PingFangSC-Regular;
            color:rgb(51,51,51);
            width:343px;
            height:147px;
            margin:0 auto ;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
     .bar{
            width:100%;
            height:56px;
            display: flex;
            // justify-content: space-between;
            position: fixed;
            bottom:0;
            left: 0;
            background-color:#fff;
            button{
                font-size: 12px;
                font-family: PingFangSC-Regular;
                float: left;
                margin-top:10px;
                border:none;
            }
            .concat{
                width:107px;
                height:40px;
                margin-top:10px;
                font-size: 12px;
                font-family: PingFangSC-Regular;
                float: left;
                color:rgb(165,167,175);
                text-align: center;
                margin-left:0.1rem;
                background-color:#fff;
                i{
                    display: block;
                    width:23px;
                    height:23px;
                    background-image: url("../assets/imgs/icon/ic_kefu.png");
                    background-size: cover;
                    background-position: center;
                    margin:0 auto;
                }
            }
            .nowDui{
                width:235px;
                height:40px;
                margin-left:10px;
                float: left;
                font-size: 16px;
                font-family: PingFangSC-Regular;
                color:rgb(255,255,255);
                text-align: center;
                line-height: 40px;
                background-image: url(../assets/imgs/button_buy.png);
                background-size:cover;
                border-radius: 20px;
            }
        }
  
}

</style>
