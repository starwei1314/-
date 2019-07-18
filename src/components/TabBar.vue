<!--  -->
<template>
<div id="shopTab">
  <van-tabbar route v-model="$store.state.active">
  <van-tabbar-item
    :to="item.path"
    v-for="(item,index) in tabbars" :key=index
  >
  <span>{{item.title}}</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? item.active : item.normal"
    >
     </van-tabbar-item>
</van-tabbar>
</div>
</template>

<script>

export default {
components: {},
data() {
return {
    
      tabbars: [
        {
          path: "/shop",
          title: "商城",
          normal: require("../assets/imgs/icon/ic_bar_fl_normal.png"),
          active: require("../assets/imgs/icon/ic_bar_fl_focused.png")
        },
        {
          path: "/category",
          title: "分类",
          normal: require("../assets/imgs/icon/ic_bar_sc_normal.png"),
          active: require("../assets/imgs/icon/ic_bar_sc_focused.png")
        },
        
        {
          path: "/mine",
          title: "我的",
          normal: require("../assets/imgs/icon/ic_bar_me_normal.png" ),
          active: require("../assets/imgs/icon/ic_bar_me_focused.png")
        }
      ]
};
},
computed: {},
watch: {
      selected: function (val, oldVal) {
        console.log(val)
        // click后打印出当前mt-tab-item的id
        this.$router.push(val)
      }
    
},
methods: {

},
created() {

},
mounted() {

},
}
</script>
<style lang='less'>
//@import url(); 引入公共css类
    #shopTab{
        margin-top:50px;
        .van-tabbar{
            height:50px;
            .van-tabbar-item{  
              .van-tabbar-item__icon{
                  img{width:23px;height:20px;}
              }  
              &.van-tabbar-item--active{
                 color:rgb(232,52,58);
                .van-tabbar-item__text{
                  span{
                       color:rgb(232,52,58);
                  }
               }
              }
            } 
        }
    }
</style>