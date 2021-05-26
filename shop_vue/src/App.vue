<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    function a () {
      console.log(1)
    }
    a()
    function a() {
      console.log(2)
    }
    a()
  }
}
</script>

<style lang="less" scoped>
.app{
  width: 100%;
  height: 100%;
}
</style>