<!--  -->
<template>
<div class='' id="positeMine">
    <div class='backColor'></div>
    <div class="userInfo">
        <div class="left">
            <img :src="userInfo.imgUrl" alt="">
            <!-- <img src="../assets/imgs/bag.jpg" alt=""> -->
        </div>
        <div class="middle">
            <div class="username">
                {{userInfo.userName}}
            </div>
            <div class="phone" v-if="userInfo.phone">
                {{userInfo.phone}}
            </div>
            <div class="bound" v-if="!userInfo.phone" @click="$router.push('/boundphone')">
                绑收货手机，集购物积分
            </div>
        </div>
        <div class="right" v-if="userInfo.phone" @click="$router.push('/boundOrder')">
            <i></i>关联订单号
        </div>
    </div>
    <div class="positeBox">
        <div>
            <span class="number">{{positeNum}}</span>
            <span>可用积分</span>
        </div>
        <div>
             <span class="number">{{spendNum}}</span>
            <span>已消耗积分积分</span>
        </div>
    </div>
    <div class="level">
        <div class="levelImg">
             <div class="levelVip">
                <div class="positeTitle">
                    <div >
                        <img src="../assets/imgs/novip.png" alt="" v-if="lvIntegral.lvName=='非会员'">
                         <img src="../assets/imgs/vip.png" alt="" v-else> {{lvIntegral.lvName}}</div>
                    还差{{lvIntegral.needIntegral}}积分升级下一级</div>
            </div>
            <div class="progress">
                <van-progress
                 pivot-text=""
                 color="rgb(243,203,47)"
                 :percentage="(lvIntegral.needIntegral/lvIntegral.totalIntegral)*100"
                 />
            </div>
           
        </div>
    </div>
    <div class="orderList">
         <ul>
            <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
             :offset=100
            :immediate-check='false'
            >
             <li v-for='item in cateList'>
                  <div class="left">
                    <img :src="getImgurl(item.cover)" alt="">
                </div>
                <div class="right">
                    <div class="title">
                        {{item.productName}}
                    </div>
                    <div class="sale">
                        <div class="status">{{item.status=="success"?'交易完成':'待确认'}}</div>
                        <div class="price">积分：<span>{{item.totalIntegral}}</span> </div>
                        <div class="saleNum">x{{item.exchangeCount}}</div>

                    </div>
                </div>
             </li>
              </van-list>
         </ul>
    </div>
</div>
</template>
<script>

import ajax from '@/assets/js/ajax'
export default {
components: {},
data() {
return {
    loading:false,
    finished: false,
    progress:false,
    userInfo:{
        userName:"小心",
        phone:"",
        imgUrl:"",
    },
    lvIntegral:{
       needIntegral:0,
       totalIntegral:0,
       lvName:''
    },
    data:{
            pageSize:10,
            currentPage:0,
            openId:"",
            status:'',//订单状态
            total:'',//订单总数以便滚动加载时使用
        },
    positeNum:0,
    spendNum:0,
    hour:0,
    day:0,
    minute:0,
    second:0,
    cateList:[],
    info:''//微信用户信息
};
},
created(){
     this.$store.state.active=2
     this.getPosite()
     this.onLoad()
     this.getWXinfo()
},
methods:{
    getWXinfo(){//根据微信用户信息
        let openid=this.$getLocal('openId')
        this.$HttpService.fetch('/official/user/info/get',{openId:openid}).then(res => {
	       if(res.data.code=='0000'){
               let resultData=JSON.parse(res.data.result)
               this.userInfo.userName=resultData.nickname
               this.userInfo.imgUrl=resultData.headimgurl
	       	}
	      }).catch(err => {//抛出异常
	      console.log(err)
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
    getList(){
        //获取订单列表的信息
        this.data.openId=this.$getLocal('openId')
        this.data.currentPage++
         this.$HttpService.fetch('/official/integral/product_exchange_record/pagination',this.data).then(res => {
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
	      }).catch(err => {//抛出异常
	      console.log(err)
	      })
    },
    getPosite(){
        //获取个人积分
         this.$HttpService.fetch('/official/integral/personal_integral/get',{openId:this.$getLocal('openId')}).then(res => {
	       if(res.data.code=='0000'){
               this.positeNum=res.data.result.personalIntegralModel.availableIntegral||0//此处获取用户积分情况
               this.spendNum=res.data.result.personalIntegralModel.usedIntegral||0
               this.lvIntegral.lvName=res.data.result.personalIntegralModel.membershipLevelName||'非会员'
               this.lvIntegral.needIntegral=res.data.result.personalIntegralModel.nextLevelIntegral||0
               this.lvIntegral.totalIntegral=res.data.result.personalIntegralModel.arrearsIntegral||0
               this.userInfo.phone=res.data.result.wechatFansModel.mobile   
	       	}
	      }).catch(err => {//抛出异常
	      console.log(err)
	      })
    },
   
    onLoad() {
      // 异步更新数据
      this.getList()

    }
   }
  }
</script>
<style lang='less' scoped >
#positeMine{
    background-color: #f7f7f7;
    .backColor{
        width:100%;
        height:140px;
        background-color: rgb(236,95,100);
        position:absolute;
      
    }
    .userInfo{
        width:100%;
        height:64px;
        position: relative;
        margin-bottom:10px;
        .left{
            height:64px;
            float: left;
            margin-left:20px;
            img{
                width:64px;
                height:64px;
                vertical-align: top;
                border-radius:50%;
            }
        }
        .middle{
            float: left;
            margin-left:10px;
            height: 64px;
            .username{
                font-size:20px;
                font-family: PingFangSC-Medium;
                color:#fff;
                margin-bottom:5px;
            }
            .phone{
                font-size:20px;
                font-family:PingFangSC-Regular;
                color:#fff;
              
            }
            .bound{
                    display: inline-block;
                    width: 159px;
                    height:24px;
                    font-size:12px;
                    font-family: PingFangSC-Medium;
                    vertical-align: top;
                    background-image: url("../assets/imgs/bt_bd.png");
                    background-size: cover;
                    border-radius:12px;
                    text-align: center;
                    line-height: 24px;
                    color:rgb(60,61,67);
            }
        }
        .right{
            float: right;
            height:46px;
            width:122px;
            color:rgb(109,83,178);
            font-size:14px;
            font-family: PingFangSC-Regular;
            background-color: #fff;
            text-align: center;
            line-height: 46px;
            border-radius: 30px 0 30px;
            i{
                display: inline-block;
                height:22px;
                width:22px;
                background-image: url("../assets/imgs/ic_correlation.png");
                background-size:cover;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
    }
    .positeBox{
        position: relative;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        width:352px;
        border-radius:15px;
        margin:0 auto;
        div{
            width:164px;
            height:104px;
        ;
            span{
                font-size: 14px;
                font-family: PingFangSC-Regular;
                color:rgb(165,167,175);
                display: block;
                text-align: center;

                 &.number{
                    font-size:26px;
                    font-family: PingFangSC-Regular;
                    color: rgb(109,83,178);
                    margin-top:24px;
            }
            }
           
        }
    }
    .level{
        height:56px;
        width:299px;
        background-color: #fcfcfc;
        margin:0 auto;
        border-radius: 0 0 15px 15px;
        .levelImg{
            width:299px;
            height:56px;
            position: relative;
            .progress{
            width:263px;
            margin:auto;
            margin-top: 10px;
            .van-progress{
                height:8px;
            }
            // .mt-progress-progress{
            //     background-color: #f3cb2f;
            // } 
        }
    } 
    .levelVip{
        .positeTitle{
            font-size: 12px;
            font-family: PingFangSC-Regular;
           color: rgb(60,61,67);
           width:210px;
           margin: 0 auto;
           padding-top:10px;
           div{
               font-size: 12px;
               background-color: #ecc52e;
               border-radius:5px;
               display: inline-block;
               width:80px;
               height:23px;
               margin-right:7px;
               line-height: 23px;
            img{
                vertical-align: middle;
                margin-left: 5px;
                margin-right: 5px;

            }
           }
        }
    }
    }
    .orderList{
        li{
            margin:10px 12px;
            overflow: hidden;
            position: relative;
             background-color:rgb(255,255,255);
        .left{
            width:100px;
            height:100px;
            float:left;
            img{
                vertical-align: top;
                width: 100%;
            }
        }
        .right{
            margin-left:5px;
            margin-top:10px;
            overflow: hidden;
            .title{
                width: 140px;
                font-size:14px;
                font-family: PingFangSC-Regular;
                float: left;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
            }
            .sale{
                width:61px;
                float: right;
                
                .status{
                    color:rgb(232,52,58);
                    font-size:14px;
                    font-family: PingFangSC-Regular;
                }
                .price{
                    color:rgb(165,167,175);
                    font-size:14px;
                    font-family: PingFangSC-Regular;
                    margin:0.1rem 0;
                    span{
                        color:rgb(109,83,178);
                    font-size:18px;
                    font-family: PingFangSC-Regular;
                    }
                }
                .saleNum{
                    color:rgb(165,167,175);
                    font-size: 12px;
                    font-family: PingFangSC-Regular;
                }

            }
            }
        }
    }
}
</style>