<!--  -->
<template>
<div class='' id='home'>
    <!-- <img :src="codeUrl" alt="" style="display:none;"> -->
    <Head></Head>
    <transition name="fade">
    <router-view></router-view>
    </transition>
    <TabBar></TabBar>
      
</div>
</template>

<script>
import Head from "@/components/Head"
import TabBar from "@/components/TabBar"
import ajax from '@/assets/js/ajax'
import { Promise } from 'q';
export default {
components: {
    Head,
    TabBar
},
data() {
return {
    codeUrl:'',//获取请求code的地址
    access_token:'',//授权密钥
};
},
computed: {},
watch: {},
methods: {

getPersonInfo(){// 获取微信公众号access_token
        let openId=this.$getLocal('openId')
        this.$HttpService.fetch('/official/access_token/get',{openId:openId}).then(res => {
	       if(res.data.code=='0000'){
               this.access_token=res.data.result
              
                this.$setLocal('accessToken',this.access_token)//保存token到本地，该值存在有效期
                 console.log(this.$getLocal("accessToken"))
                // this.polling()
	       	}
         })
    },
  getUrlParams(names) {//调用获取url上的地址
  //获取？后面的参数
   var urlSearch = location.search;
   var urlValue="";
   //以？*&来拆分
   var params = urlSearch.split(/[?*&]/);
    for(var i=0;i<params.length;i++){
    //如果url参数里包含传递过来names字段，则取=后面的部分
        if(params[i].indexOf(names) >= 0 ){
            urlValue=params[i].split("=")[1];
            return urlValue;
        }
    }
   return urlValue;
  },
//   polling(){//轮询
//     setTimeout(res=>{
//         this.getPersonInfo()
//     },5000)
//   },
//  weixinJS(){//获取微信接口
//     let url=window.location.href
//     var radom = Math.random().toString(36).substr(2);
//     var timestamp = (new Date()).getTime();
//     let data={
//         openid:this.$getLocal('openId'),
//         url:url.split('#')[0]
//     }
//     this.$HttpService.fetch('/official/jsapi/signature/get',data).then(res => {
//          wx.config({
//              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//              appId: this.$getLocal('appid') ,// 必填，公众号的唯一标识
//              timestamp: res.data.result.timestamp, // 必填，生成签名的时间戳
//              nonceStr: res.data.result.nonceStr, // 必填，生成签名的随机串
//              signature: res.data.result.signature,// 必填，签名
//              jsApiList: ["closeWindow"] // 必填，需要使用的JS接口列表
//     });
//         wx.ready(function(){
         
//         });
//         wx.error(function(){});
//       }).catch(err=>{
//           console.log(err)
//       })
      
//  },
  getIdenum(){
      //获取idenNumeber,appid保存到本地
    let value=this.$getLocal('merchantUid')||''
    this.$HttpService.fetch('/get/merchantinfo',{merchantUid:value}).then(res => {
        let identnum=res.data.result.idenNumber
        let appid=res.data.result.appid
        this.$setLocal("idenNumber",identnum)
        this.$setLocal("appid",appid)
    //    this.weixinJS()
      }).catch(err=>{
          console.log(err)
      })
  }
    },
created() {
    //进入页面获取url地址上面的merchantUID和openID保存在本地使用
   this.$setLocal("merchantUid",this.getUrlParams("merchantUid"))
   this.$setLocal("openId",this.getUrlParams("openId"))
  
},
mounted() {
    this.getIdenum()
   this.getPersonInfo()
},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='less' scoped>
#home{
    overflow: hidden;
.fade-enter{
	opacity:0;
  transform:translateX(100%)
}
.fade-leave-to{
	opacity:0;
	/* 当组件离开时为了解决独占一行的影响 给其添加绝对定位 */
	position: absolute;
	transform: translateX(-100%)
}
.fade-enter-active,.fade-leave-active{
	transition: all 0.5s ease;
}
}

</style>