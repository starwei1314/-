<!--  -->
<template>
<div class='' id='shop'>
    <div class="banner">
        <div class="spanner">
            <img src="../assets/imgs/banner.jpg" alt="">
            <!-- <van-swipe :autoplay="3000" indicator-color="white">
                <van-swipe-item> <img src="../assets/imgs/banner.jpg" alt=""> </van-swipe-item>
                 <van-swipe-item> <img src="../assets/imgs/banner.jpg" alt=""> </van-swipe-item>
                <van-swipe-item v-for="(item,index) in bannerList" :key='index'><img :src="item.url" alt=""></van-swipe-item> 
            </van-swipe> -->
        </div>
        <div class="banner_posite">
            <span>当前积分</span>&nbsp;{{posite}}
        </div>
    </div>
    <div class="luckyPosite">
        <div class="actives">
             <div class="daySign" @click="$router.push('/daysign')">
                 每日签到
             </div>
              <div class="luckDraw"  @click="$router.push('/getprize')">
                  积分抽奖
              </div>
        </div>
        
          <div class="descDown">
            <span>积分
                <span class="btnGroup">
                   <button @click="upSort"> <img src="../assets/imgs/shangjiantou.png" alt=""> </button>
                   <button @click='downSort'> <img src="../assets/imgs/xiajiantou.png" alt=""> </button>
                </span>
            </span>  
              
          </div>
    </div>
    <div class="categoryList">
        <ul>
          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check='false'
            finished-text="没有更多了"
            @load="onLoad"
            :offset=100
            >
            <li v-for='(item,index) in cateList' :key='index'>
                 <router-link :to="{
                     path:'detail',
                     query:{
                         uid:item.uid
                     }
                 }">
                <div class="left">
                    <img :src="getImgurl(item.cover)" alt="">
                </div>
                <div class="right">
                    <div class="title">
                        {{item.name}}
                    </div>
                    <div class="positeDui">兑换积分:<span>{{item.needIntegral}}</span></div>
                    <div class="last"> 
                        <span class="lastTime fl" >
                            <!-- <span class='time'>{{timeObj1[index].day}}</span> 
                            <span class='time'>{{timeObj1[index].hour}}</span>
                            <span class='time'>{{timeObj1[index].minute}}</span>
                            <span class='time'>{{timeObj1[index].second}}</span> -->
                        </span>
                        <span class="lastNum fr">剩余 <span>{{item.remainingCount}}</span> 件</span>
                    </div>
                    <button class="btnDui" @click="buyNow" :disabled="item.remainingCount==0">
                        马上兑换
                    </button>
                </div>
                 </router-link>
            </li>
            </van-list>
        </ul>
    </div>
</div>
</template>

<script>
import { setInterval, clearInterval } from 'timers';

export default {
components: {},
data() {
return {
    bannerList:[],//轮播图
    posite:0,//积分
    loading:false,
    finished: false,
    hour:0,
    day:0,
    minute:0,
    second:0,
    
    data:{
      total:0,//总条数
      currentPage:0,
      pageSize:10, 
      merchantUid:'c1ed37072d484e79848fdf117b1d98ec'
    },
    cateList:[],//商品列表
    timeObj1:[],
    CountDown:"",//辅助倒计时用于刷新
    timer:'',//定时器以便于组件销毁时清除
};
},
created() {
    this.$store.state.active=0
    this.getPosite()
},
mounted() {
 this.onLoad()
 this.timer=setInterval( ()=> {
           //设置定时给每一个对象
           var ul=document.querySelector('.van-list')
           this.cateList.map((item,index)=>{
               var lis=ul.querySelectorAll('.lastTime')[index].innerHTML='剩余时间: '+this.Djs_timeList(item.expiredTime)
            //    //该方法存在问题每次修改数据时，会强制页面刷新，会请求图片数据无形中会增加服务器压力
            //    this.$set(
            //     item,"djs", this.Djs_timeList(item.expiredTime)
            // );
           })
        }, 1000);
  },
methods:{
    getImgurl(val){//获取oss图片，进行展示
    		  let self=this
    		  let imgUrl=''
    		  self.$oss((client) => {
    		      let result = client.signatureUrl(val, {'process' : 'image/resize,h_80,w_80'})
    		      imgUrl=result
    		    })
    		    return imgUrl
    		},
    upSort(){
        //升序排列
       this.cateList.sort((a,b)=>{return a.needIntegral-b.needIntegral})
    },
    downSort(){
        //降序排列
        this.cateList.sort((a,b)=>{return b.needIntegral-a.needIntegral})
    },
    getBanner(){//获取广告图
       let merchantUid=this.$getLocal('merchantUid')
      this.$HttpService.fetch('/official/integral/mall_banner/all',{merchantUid:merchantUid}).then(res => {
	    if(res.data.code=='0000'){
            this.bannerList=res.data.result
            
	    	}
	      	}).catch(err => {
	     	console.log(err)
	      	})
    },
    buyNow(){

    },
    getPosite(){
         //获取累计积分   该接口暂时未对接
         this.$HttpService.fetch('/official/integral/personal_integral/get',{
              openId:this.$getLocal('openId'),
          }).then(res => {
           if(res.data.code=='0000'){
            this.posite=res.data.result.personalIntegralModel.availableIntegral
          }
        }).catch(err => {
	   	console.log(err)
            })
     },
    Djs_timeList:function(end){
        var endItem=new Date(end).getTime();//获取列表传的截止时间
        var nowItem=new Date().getTime();//获取当前时间
        var rightTime = endItem - nowItem;//截止时间减去当前时间
        if (rightTime > 0) {//判断剩余倒计时时间如果大于0就执行倒计时否则就结束
          var dd = Math.floor(rightTime / 1000 / 60 / 60 / 24);
          var hh = Math.floor((rightTime / 1000 / 60 / 60) % 24);
          var mm = Math.floor((rightTime / 1000 / 60) % 60);
          var ss = Math.floor((rightTime / 1000) % 60);
          var showTime= dd + "天" + hh + "小时" + mm + "分" + ss + "秒"
        }else{
          var showTime= "活动已结束"

        }
        return showTime
      },
    getDataList(){
        this.data.currentPage++
        this.data.merchantUid=this.$getLocal('merchantUid')
        this.$HttpService.fetch('/official/integral/mall_product/pagination',this.data).then(res => {
	    if(res.data.code=='0000'){
            if(this.cateList.length==0){
                this.cateList=res.data.result.list
            }else{
                this.cateList=this.cateList.concat(res.data.result.list)
            }
            this.data.total=res.data.result.totalSize
            this.loading = false;
          if (this.cateList.length >= this.data.total) {
            this.finished = true;
           }
            }
            setInterval(this.Djs_timeList, 1000);//倒计时列表，多个
	      	}).catch(err => {
	     	console.log(err)
	      	})
    },
    onLoad() {
      // 异步更新数据
        this.getDataList()
    },
    
   },
     beforeDestroy() {
    clearInterval(this.timer);        
}
}
</script>
<style lang='less' scoped>
#shop{
    background-color: #F7F7F7;
    .banner{
        height:116px;
        background-image: url("../assets/imgs/banner.jpg");
        background-size: cover;
        position: relative;
        .spanner{
            img{
                width: 100%;
                height: 116px;
            }
        }
       .van-swipe{
           width: 100%;
           height:116px;
           .van-swipe-item{
               img{
                   height: 100%
               }
           }
       }
        .banner_posite{
            width:140px;
            height:33px;
            position: absolute;
            top:58px;
            left:29px;
            font-size:16px;
            font-family: PingFangSC-Regular;
            color:#fff;
            border-radius: 17px;
            background-image: url('../assets/imgs/integral_bg.png');
            background-size:cover;
            text-align: center;
            line-height: 33px;
            span{
                font-size: 12px;
                font-family: PingFangSC-Regular;
                line-height:33px;
                height:33px;
                display: inline-block;
            }
        }

    }
    .luckyPosite{
        font-size:14px;
        font-family: PingFangSC-Regular;
        overflow: hidden;
        .actives{
            display: flex;
            justify-content: space-around;
            padding-top:8px;
            .daySign{
            width:164px;
            height:50px;
            line-height: 50px;
            text-align: center;
            font-weight: 600;
            color:black;
            text-indent: 3.5em;
            background-image: url('../assets/imgs/button_sign.png');
            background-size:cover;
            border-radius:25px;
        }
        .luckDraw{
            width:164px;
            height:50px;
            line-height: 50px;
            text-align: center;
             font-weight: 600;
            color:black;
             text-indent: 3.5em;
            background-image: url('../assets/imgs/button_prize.png');
            background-size:cover;
            border-radius:25px;
        }
        }
        .descDown{
            // height:0.18rem;
            // width:0.45rem;
            float:right;
            margin-top: 12px;
            margin-right:9px;
            margin-bottom:12px;
            span{
                color:rgb(165,167,175);
            }
            .btnGroup{
            //   width:0.16rem;
            //   float:right;
            vertical-align: bottom;
            display: inline-block;
              button{
                width:16px;
                height:8px;
                display: block;
                border:none;
                line-height:8px;
                text-align: center;
                margin-top:5px;
                img{
                    height:8px;
                }
            }
            }
           
        }   
        
    }
    .categoryList{
        li{
            margin:10px 12px;
            overflow: hidden;
            position: relative;
            background-color:rgb(255,255,255);
        .left{
            width:70px;
            height:80px;
            margin-top: 6px;
            float:left;
            img{
            vertical-align: top;
                width: 100%;
            }
        }
        .right{
            float: left;
            margin-left:5px;
            div{
                margin-top:5px;
            }
            .title{
                font-size: 16px;
                font-family: PingFangSC-Regular;
                color:rgb(51,51,51);
                width: 200px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                }
            .positeDui{
                font-size: 12px;
                font-family: PingFangSC-Regular;
                color:rgb(165,167,175);
                span{
                   font-size: 18px;
                   font-family: PingFangSC-Regular;
                   color:rgb(109,83,178)
                }
            }  
            .last{
                  font-size: 12px;
                  font-family: PingFangSC-Regular;
                  color:rgb(165,167,175);
                  width: 260px;
                span{
                  span{
                      color:rgb(232,52,58);
                      &.time{
                          color:#fff;
                         background-color:rgb(139,87,42);
                      width:17px;
                      height:17px;
                      display: inline-block;
                      text-align: center;
                      }
                  }
                  
                 &.lastNum{
                     margin-left:30px;
                 }  
                }
            }
            .btnDui{
                font-size:14px;
                font-family: PingFangSC-Regular;
                color:#fff;
                width:72px;
                height:29px;
                position: absolute;
                top:30px;
                right:11px;
                background-image: url("../assets/imgs/button_currency.png");
                background-size:cover;
                border-radius:2px;
                line-height: 29px;
                text-align: center;
                border: none;
            }
            }
        }
    }
}
</style>