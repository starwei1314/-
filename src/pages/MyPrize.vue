<template>
    <div class="" id="myPrize">
          <van-nav-bar title="我的奖品"  left-arrow fixed
         @click-left="onClickLeft"
        >
         <!-- <van-icon name="more" slot="right" /> -->
        </van-nav-bar>
        <div class="prize">
          <ul>
            <li v-for="(item,index) in prizeList" :key='index'>
                <div class="left">
                   <img :src="getImgurl(item.lotAwardImg)" alt="" >
                   <!-- <img src="../assets/imgs/lucky/jd.png" alt="" v-if="item.come=='jd'"> -->
                </div>
                <div class="right">
                  {{item.lotAwardName}}
                </div>
            </li>
          </ul>
        </div>
    </div>
</template>
<script>
export default {
   data() {
      return {
        prizeList:[],//奖品列表·  
        total:0,
              }
   },
   created(){
     this.getList()
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
     getList(){
       var data={
         openid:this.$getLocal('openId'),
        accountAppid:this.$getLocal('appid')
       }
         this.$HttpService.fetch('/official/lottery/award_record/list/award',data).then(res => {
	       if(res.data.code=='0000'){
            this.prizeList=res.data.result
          
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
<style lang='less'  scoped>
#myPrize{
    height: 100%;
    min-height: 667px;
    background-image: url("../assets/imgs/lucky/bg.png");
    background-size: cover;
    .van-nav-bar{
     width:100%;
     height:50px;
     line-height:50px;
     background: rgb(236,95,100);
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
     .prize{
       padding-top:90px;
       ul{
         li{
           width:336px;
           height:80px;
           margin:20px auto;
           position: relative;
            background-image: url("../assets/imgs/lucky/my.png");
            background-size: cover;
            overflow: hidden;
            .left{  
              float: left;
              width: 85px;
              height: 80px;
              img{
                width: 42px;
                height: 30px;
                vertical-align: top;
                position: absolute;
                margin-top:-15px;
                top:50%;
                margin-left: 23px;
              }
            }
           .right{
              float: left;
              width:250px;
              height:80px;
              text-align: center;
              line-height: 80px;
              font-family: PingFangSC-Medium;
              font-size:20px;
              color: rgb(60,61,67);
            }
         }
       }
     }
    
}
</style>
