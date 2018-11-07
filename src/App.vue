<template>
  <div id="app">
    <header-component></header-component>
    <tab-componentFemale></tab-componentFemale>
    <router-view />
    <transition name='reader-view'>
      <reader v-show='currentShow'></reader>
    </transition>

  </div>
</template>

<script>
import HeaderComponent from '@/components/headerComponent'
import TabComponentFemale from '@/components/tabComponent'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import Reader from '@/base/reader/index'
export default {
  name: 'App',
  components:{
    HeaderComponent,
    TabComponentFemale,
    Reader
  },
  computed:{
    ...mapGetters(['currentShow'])
  }
}
</script>

<style lang='less'>
  *{
    padding: 0;
    marign:0;
    list-style: none;
    box-sizing:border-box;
  }
  body,html{
    padding: 0;
    margin: 0;
  }
  .reader-view-enter-active,.reader-view-leave-active {
    transition: all .3s ease;
  }
  .reader-view-enter, .reader-view-leave-to{
    transform: translateX(100%);
  }
</style>
