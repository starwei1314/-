<template>
  <div id="app">
    <!-- <transition name="fadeApp"> -->
    <router-view></router-view>
    <!-- </transition> -->
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app{
  height:100%;
  overflow: hidden;
  .fadeApp-enter{
	opacity:0;
  transform:translateX(100%)
}
.fadeApp-leave-to{
	opacity:0;
	/* 当组件离开时为了解决独占一行的影响 给其添加绝对定位 */
	position: absolute;
	transform: translateX(-100%)
}
.fadeApp-enter-active,.fadeApp-leave-active{
	transition: all 0.5s ease;
}
}

</style>
