<template>
  <div class="classify">
    <div class="item" v-for='(i,index) in list' :key='i.id'>
      <div class="menutitle" @click="toggle(i)">{{i.title}}</div>
      <transition name='slide'>
        <div class="sildermun" v-show="i.status">
          <div v-for='(j,index) in i.data' :key='j.id' @click='addDetail(i.type,j.name)'>
            <p>{{j.name}}</p>
            <span>{{j.bookCount}}</span>
          </div>
        </div>
      </transition>
    </div>
    <mt-spinner class='load' color="#26a2ff" v-show='loading' type="double-bounce"></mt-spinner>
    <transition name='slide-view'>
      <router-view />
    </transition>
  </div>
</div>
</template>

<script>
import Axios from 'axios'
export default {
  data() {
    return {
      status:false,
      loading:true,
      list:[],
    }
  },
  created() {
    this.getDataClassify()
  },
  methods: {
    getDataClassify(){
      let url = '/api/cats/lv2/statistics'
      Axios(url).then((res)=>{
        //console.log(res)
        if(res.data.ok){
          let list = [
            {
              type:'male',
              status:false,
              title:'男生',
              data:res.data.male
            },
            {
              type:'female',
              status:false,
              title:'女生',
              data:res.data.female
            },
            {
              type:'picture',
              status:false,
              title:'漫画',
              data:res.data.picture
            },
            {
              type:'press',
              status:false,
              title:'出版',
              data:res.data.press
            },
          ]
          this.list = list
          this.loading = false;
        }else{
          this.loadingBottom = false;
          Toast({
            message: '服务器连接失败',
            duration: 2000
          });
        }

      })
    },
    toggle: function(i) {
      i.status = !i.status;
    },
    addDetail:function(type,name){
      //console.log(name)
      this.$router.push({
        path:`/classify/${type}/${name}`
      })
    }
  }
}
</script>

<style lang='less' scoped>
.classify{
  .load{
    display: block;
    margin: 30% auto;
    width: 28px;
  }
  position: fixed;
  top:82px;
  bottom:0;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  .item{
    margin-top: 8px;
    .menutitle{
      margin:  0 10px;
      padding:0 20px;
      height:38px;
      line-height: 38px;
      border-radius: 8px;
      color:#fff;
      font-size: 12px;
      box-shadow: 0 0 5px #999;
      background: #A3D9FF;
    }
    .sildermun{
      margin: 5px auto 20px auto;
      display: flex;
      flex-wrap: wrap;
      width: 90%;
      border-radius: 6px;
      background: #ECF6FB;
      box-shadow: 0 0 10px #aaa;
      div{
        width: 50%;
        padding: 10px;
        font-size: 14px;
        text-align: center;
        border: 1px solid #fff;
        p{
          color:#000;
          margin: 0;
        }
        span{
          display: block;
          color:#888;
          font-size: 10px;
        }
      }
    }
  }
}

.slide-enter-active,.slide-leave-active {
  transition: all .3s ease;
}
.slide-enter, .slide-leave-to{
  transform: translateY(-10px);
  opacity: 0;
}

.slide-view-enter-active,.slide-view-leave-active {
  transition: all .3s ease;
}
.slide-view-enter, .slide-view-leave-to{
  transform: translateX(100%);
}
</style>
