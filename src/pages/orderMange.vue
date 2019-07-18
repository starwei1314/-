<template>
    <div class="" id="orderMange">
<div v-if="!isshowEditor">
     <van-nav-bar title="提交订单"  left-arrow fixed
      @click-left="onClickLeft"
     >
    </van-nav-bar>
    <div v-if='addressObj ==null' class="shouhuo" @click="add">+ &nbsp;添加收货地址</div>
    <div class="address" v-if='addressObj!=null' >
        <div class="defalut">{{addressObj.province}}{{addressObj.city}}{{addressObj.area}}</div>
        <div class="nowAddress">{{addressObj.address}}<span class="editor" @click="$router.push('/address')"></span></div>
        <div class="concatPerson">{{addressObj.concat}} &nbsp;{{addressObj.mobile}}</div> 
    </div>
    <div class="line" v-if='JSON.stringify(addressObj)!="{}"'></div>
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
            <li v-for="item in orderList">
                  <div class="left">
                    <img :src="getImgurl(item.cover)" alt="">
                </div>
                <div class="right">
                   <div class="title">{{item.productName}} </div>
                   <div class="num"><span>兑换积分：</span>{{item.totalIntegral}} 
                       <div class="count">
                           <button :disabled="item.exchangeCount<2" @click="item.exchangeCount<2?item.exchangeCount=1:item.exchangeCount--" >-</button>
                           <input type="text" v-model="item.exchangeCount" >
                           <button  @click='item.exchangeCount++'>+</button>
                       </div>
                   </div>
                    
                </div>
            </li>
            </van-list>
        </ul>
        <div class="total">
            <div>兑换积分   <span>{{getTotalNum}}</span> </div>
            <!-- <div>运费   <span>+￥ {{addressmoney}}</span> </div> -->
        </div>
    </div>
    <div class="bar">
            <span class="concat">实付积分：{{getTotalNum}}</span>
            <van-button type="default" class="nowDui" @click="submitOrder">提交订单</van-button>
    </div>
    </div>
        <van-dialog
         v-model="show"
        title="您还没有收货地址，请点击添加"
        confirmButtonText="添加地址"
        cancelButtonText='稍后添加'
        confirmButtonColor="rgb(232,52,58)"
        show-cancel-button
        @confirm="isshowEditor=true"
        >
        </van-dialog>
       <address-editor v-if="isshowEditor" v-on:close='closeBox'></address-editor>
    </div>
</template>
<script>

import AddressEditor from "@/components/AddressEditor"
export default {
   data() {
      return {
           show: false,//弹框开关
           loading:false,//加载开关
          finished: false,//加载完成开关
          isshowEditor:false,//编辑地址开关
          isshowdiago:false,//添加地址开关
          addressmoney:100,
          totalNum:0,//为列表所有订单的总计数
          addressObj:{
            // address:"湖北武汉洪山",
            // detail:"新南湖",
            // name:"小明",
            // phone:"1331111222"
          },
          data:{
              pageSize:10,
              currentPage:0,
              openId:"2ddfffadasdas2131231sdqd",
              total:0,//总条数
          },
          orderList:[
         
          ]
      }
   },
   computed:{
      getTotalNum(){
           let total=0
         this.orderList.map(item=>{

            return total+=item.totalIntegral*item.exchangeCount
                }) 
        return total    
       }
   },
   components:{AddressEditor},
   created(){
    //    this.getAddress()
    this.getAddressPre()//获取地址栏信息
    this.onLoad()
   },
   mounted(){
    
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
       getList(){
           //获取订单列表
        this.data.openId=this.$getLocal('openId')
         this.data.currentPage++
        this.$HttpService.fetch('/official/integral/product_exchange_record/pagination',this.data).then(res => {
	    if(res.data.code=='0000'){
            if(this.orderList.length==0){
                this.orderList=res.data.result.list
            }else{
                this.orderList=this.orderList.concat(res.data.result.list)
            }
            this.data.total=res.data.result.totalSize
            this.loading = false;
            
          if (this.orderList.length >= this.data.total) {
            this.finished = true;
           }
            }
	      	}).catch(err => {
	     	console.log(err)
	      	})
       },
    //  getAddress(){//展示地址
    //     this.$HttpService.fetch('/official/integral/personal_address_setting/precheck/all',{openId:this.$getLocal('openId')}).then(res => {
	//     if(res.data.code=='0000'){
    //         this.addressObj=res.data.result
	//     	}
	//       	}).catch(err => {
	//      	console.log(err)
	//       	})
    //  },
     getAddressPre(){
         this.$HttpService.fetch('/official/integral/personal_address_setting/precheck/get',{openId:this.$getLocal('openId')}).then(res => {
	    if(res.data.code=='0000'){
            this.addressObj=res.data.result
	    	}
	      	}).catch(err => {
	     	console.log(err)
	      	})
     },
     onClickLeft() {
         this.$router.back(-1)
        },
     onClickRight() {
     
         },
    onLoad() {
      // 异步更新数据
      this.getList()

    },
       add(){
           
           this.isshowdiago=true
           this.show=true
       },
       submitOrder(){
           //提交订单
           var product=[]
           for(var i=0;i<this.orderList.length;i++){
               product.push(this.orderList[i].uid)
           }
           
           var data={
               	"mobile":this.addressObj.mobile ,
	            "contact": this.addressObj.contact,
	            "address":this.addressObj.province+this.addressObj.city+this.addressObj.area+this.addressObj.address,
	            "orderList": product
           }
           this.$HttpService.postJson('/official/integral/product_exchange_record/order/commit',data).then((res)=>{
               if(res.data.code=='0000'){
                   this.$router.push('/mine')
               }else{
                   this.$toast(res.data.remark)
              
               }
           }).catch((err)=>{
               console.log(err)
           })
       },
       closeBox(){
           this.isshowEditor=false
           this.getAddressPre()
       }
   }
}
</script>
<style lang='less' scoped>
#orderMange{
    background-color: #F7F7F7;
    padding-top:50px;
    min-height:667px;
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
     .van-dialog__header{
         font-family: PingFangSC-Regular;
         color:rgb(60,61,67);
         font-size:16px;
     }
     .shouhuo{
         font-size: 14px;
         font-family: PingFangSC-Regular;
         height:20px;
         padding:10px 10px;
     }
     .line{
         width: 100%;
         height:2px;
         background-image: url("../assets/imgs/address/line.png")

     }
     .address{
         width: 100%;
         height: 98px;
         font-size:14px;
         font-family: PingFangSC-Regular;
        //  margin-top: 0.7rem;
         padding:10px 10px;
         div{
             margin-top:5px;
         }
         .defalut{
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
             span{
                 display: inline-block;
                 width:28px;
                 height: 16px;
                 font-size:14px;
                 font-family: PingFangSC-Regular;
                 background-color: #6d53b2;
                 border-radius:2px;
                 text-align: center;
             }
         }
         .nowAddress{
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
             font-size:18px;
             font-family: PingFangSC-Regular;
             .editor{
                 width:22px;
                 height:22px;
                 float: right;
                 margin-right: 20px;
                 background-image: url("../assets/imgs/address/ic_more.png");
                 background-size:cover;
             }
         }
         .concatPerson{
            font-size:14px;
            font-family: PingFangSC-Regular;
         }
     }
     .orderList{
         margin-bottom:10px;
         ul{
             overflow: hidden;
             
         }
         li{
             overflow: hidden;
             margin-top:10px;
             position: relative;
             background-color: #fff;
             &:nth-child(1){
                 margin-top: 0;
             }
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
              width: 255px;
              margin-left:5px;
              float: left;
              .title{
                width: 100%;
                margin-top:5px;
                 color:rgb(51,51,51);
                 font-size:16px;
                 font-family: PingFangSC-Regular;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
              }
              .num{
                  position: absolute;
                  bottom: 10px;
                  width:255px;
                  font-size: 18px;
                  font-family: PingFangSC-Regular;
                  color:rgb(109,83,178);
                  span{
                      font-size:14px;
                      font-family: PingFangSC-Regular;
                      color:rgb(165,167,175);
                  }
                  .count{
                      float: right;
                      input{
                          width:46px;
                          height:24px;
                          border: 1px solid rgb(242,242,242);
                          border-radius:2px;
                          font-size: 14px;
                          color:rgb(60,61,67);
                          text-align: center;
                      }
                      button{
                          border:none;
                          background-color:#fff;
                          width: 20px;
                          height:20px;
                          margin-left: 10px;
                          color:rgb(60,61,67);

                      }
                  }
              }
          }
         }
         .total{
             background-color: #fff;
             margin-top:10px;
             margin-bottom:48px;
             div{
                 font-size:18px;
                 font-family: PingFangSC-Regular;
                 color:rgb(51,51,51);
                 padding: 10px 10px 0;
                 span{
                     float: right;
                     
                 }
             }
         }
     }
     .bar{
            width:100%;
            height:48px;
            display: flex;
            justify-content: space-around;
            position: fixed;
            bottom:0;
            // padding-top:8px;
            background-color: #fff;
            .concat{
                // width:1.07rem;
                height:40px;
                font-size:16px;
                font-family: PingFangSC-Regular;
                line-height: 40px;
                text-align: center;
                margin-left:10px;
                color:rgb(232,52,58)
            }
            .nowDui{
                width: 185px;
                height:40px;
            
                margin-left: 10px;
                font-size: 16px;
                font-family: PingFangSC-Regular;
                color:rgb(255,255,255);
                text-align: center;line-height:40px;
                background-image: url(../assets/imgs/address/bt.png);
                background-size:cover;
                border-radius: 20px;
                border:none;
            }
        }
}
</style>

