<!--  -->
<template>
<div class='' id=category>
    <div class="navBar">
        <van-tabs v-model="selectedCate" title-active-color="rgb(232,52,58)" @click='changeTab'>
            <van-tab :title='item.name' v-for='(item,index) in cateTabList' :key='index' ></van-tab>
        </van-tabs>
    </div>
    <div class="categoryList">
        <ul  >
            <van-list
            v-model="loading"
            :finished="finished"
             :immediate-check='false'
            finished-text="没有更多了"
            @load="onLoad"
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
                    <div class="positeDui">兑换积分<span>{{item.needIntegral}}</span></div>
                    <div class="last"> 
                       <span class="lastTime fl">
                            <!-- <span class='time'></span> 
                            <span class='time'></span>
                            <span class='time'></span>
                            <span class='time'></span> -->
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
export default {
components: {},
data() {
return {
    loading:false,
    finished: false,
    selectedCate:"0",
    hour:0,
    day:0,
    minute:0,
    second:0,
    data:{
      total:0,//总条数
      currentPage:0,
      pageSize:10, 
      categoryUid:''

    },
    timer:null,//倒计时
    cateTabList:[],//标签栏列表
    cateList:[],
     timer:'',//定时器以便于组件销毁时清除
};
},

created() {
 this.$store.state.active=1
//  this.getCateList()
},
mounted() {
    this.onLoad()
    this.timer=setInterval( ()=> {
           //设置定时给每一个对象
           var ul=document.querySelector('.van-list')
           this.cateList.map((item,index)=>{
               var lis=ul.querySelectorAll('.lastTime')[index].innerHTML='剩余时间'+this.Djs_timeList(item.expiredTime)
            //    //该方法存在问题每次修改数据时，会强制页面刷新，会请求图片数据无形中会增加服务器压力
            //    this.$set(
            //     item,"djs", this.Djs_timeList(item.expiredTime)
            // );
           })
        }, 1000);
},
methods:{
  buyNow(){

    },
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
getCateList(){
    
        //获取商品目录
        return new Promise((resolve, reject) => {
         this.$HttpService.fetch('/official/integral/product_category/all',{merchantUid:this.$getLocal('merchantUid')}).then(res => {
            if(res.data.code=='0000'){
               this.cateTabList=res.data.result
                console.log(111)
                resolve()
              }
        	})
        })
    },
 getDataList(){
      this.data.categoryUid=this.cateTabList[this.selectedCate].uid
      this.data.currentPage++
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
	    	}).catch(err => {
	   	console.log(err)
            })
                  
    },
  changeTab(){//切换tab标签栏时清空列表，重置加载状态
      this.data.currentPage=0
      this.cateList=[]
         this.loading = true;//下拉加载中
            this.finished = false;//下拉结束
            if(this.loading){
                this.onLoad();
            }
  },
  async onLoad() {
      // 异步更新数据
      await this.getCateList()
        this.getDataList()
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
// time(val,index){
//         //列表第一次传入截止时间以后   每秒获取一次当前时间并展示
//             var bt = new Date(val);
//             var str=''
//             this.timer=setInterval(()=>{
//             var dt=new Date()
//             var t = parseInt((bt-dt)/86400000%30);
//             var h = parseInt((bt-dt)%86400000/3600000); 
//             var m = parseInt((bt-dt)%86400000%3600000/60/1000);
//             var s = parseInt((bt-dt)%86400000%3600000%60000/1000);
//              if(s<0){
//               m--;
//               s=59;
//              }
//              if(m<0){
//               h--;
//               m=59;
//              }
//              if (h<0) {
//               t--;
//               h=23;
//              }
//              if (t<0) {
//               t=0;
//              }
      
//         var timeObj={
//             hour:"",
//             day:"",
//             minute:"",
//             second:"",
//             }
//             timeObj.hour = h<10?"0"+h:h;
//             timeObj.day= t<10?"0"+t:t;
//             timeObj.minute = m<10?"0"+m:m;
//             timeObj.second = s<10?"0"+s:s;
//         var ul=document.querySelector('.van-list')
//         var lis=ul.querySelectorAll('li')[index]
//         lis.querySelectorAll('.time')[0].innerHTML=timeObj.day
//         lis.querySelectorAll('.time')[1].innerHTML=timeObj.hour
//         lis.querySelectorAll('.time')[2].innerHTML=timeObj.minute
//         lis.querySelectorAll('.time')[3].innerHTML=timeObj.second
//         if (timeObj.day<1&&
//             timeObj.hour<1&&
//             timeObj.minute<1&&
//             timeObj.second<1) {
//                 //当倒计时结束以后，终止倒计时，并展示活动结束
//             //   lis.querySelector('.lastTime').innerHTML='活动结束'
//               clearInterval(this.timer);
//                   } 
//         },1000)     
//         }       
     },
      beforeDestroy() {//组件退出时销毁定时器避免报错
    clearInterval(this.timer);        
}
}

</script>
<style lang='less'  scoped>
//@import url(); 引入公共css类
#category{
     background-color: #F7F7F7;
    .van-tabs__wrap{
        z-index:0
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
                font-size:12px;
                color:rgb(165,167,175);
                span{
                   font-size:18px;
                   font-family: PingFangSC-Regular;
                   color:rgb(109,83,178)
                }
            }  
            .last{
                 font-size:12px;
                 font-family: PingFangSC-Regular;
                color:rgb(165,167,175);
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
                line-height:29px;
                text-align: center;
                border:none;
            }
            }
        }
    }
}
</style>