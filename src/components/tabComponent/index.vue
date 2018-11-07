<template>
  <div class="tab">
    <div class="tab_items">
      <router-link to='/classify'><span>分类</span> </router-link>
      <router-link to='/rank'><span>排行</span></router-link>
      <router-link to='/search'><span>搜索</span> </router-link>
      <router-link to='/mine'><span>我的</span> </router-link>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style lang='less' scoped>
  .tab{
    height:36px;
    padding: 0 12px;
    background: #4ECDC4;
    .tab_items{
      display: flex;
      align-items: center;
      font-size: 14px;
      text-align: center;
      height:100%;
      a{
        flex: 1;
        display: block;
        height:100%;
        line-height: 36px;
        text-decoration: none;
        color:#fff;
        &::after{
          content:'';
          display: block;
          margin: 0 auto;
          margin-top: -3px;
          width:0;
          height:1px;
          background: #fff;
          transition: 0.25s;
        }
        &.router-link-active{
          background: #46C6BE;
          color:#F4F4F4;
          box-shadow:  0 0 20px #4ECDC4 inset;
          &::after{
            content:'';
            display: block;
            margin: 0 auto;
            margin-top: -3px;
            width:28px;
            height:1px;
            background: #fff;
          }
        }
      }
    }
  }
</style>
