<template>
  <div class="classify_details">
    <div class="title">
      <span @click='back'>&lt</span>
      <p>{{this.$route.params.name}}</p>
    </div>
    <div class="type">
      <a :class='{active:"hot" == type}' @click="changeType('hot')">热门</a>
      <a :class='{active:"new" == type}' @click="changeType('new')">新书</a>
      <a :class='{active:"repulation" == type}' @click="changeType('repulation')">好评</a>
      <a :class='{active:"over" == type}' @click="changeType('over')">完结</a>
      <a :class='{active:"month" == type}' @click="changeType('month')">包月</a>
      <div class='toggle'  @click='toggle' v-show='mins.length!=0'><span ref='toggle'>&lt</span></div>
    </div>
    <transition name='slide'>
      <div class="minor" v-show='isShow'>
        <div>
          <a href="#" v-for='(i,index) in mins' :key='i.key' :class='{active:i == min}' @click="changeMinor(i)">{{i}}</a>
        </div>
      </div>
    </transition>
    <div class="list"
    ref='list'
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10">
    <ul>
      <li v-for='(i,index) in list' :key='i.key' @click='add(i._id)'>
        <img :src="'http://statics.zhuishushenqi.com'+i.cover" alt="">
        <div class="r">
          <p><span class="book_name">{{i.title}}</span><span class="author">-{{i.author}}-</span> </p>
          <p>{{i.shortIntro}}</p>
          <p><span>{{(i.latelyFollower/10000).toFixed(1)}}万</span><span>{{i.minorCate}}</span> </p>
        </div>
      </li>
      <mt-spinner class='loading' color="#26a2ff" v-show='loading' type="double-bounce"></mt-spinner>
    </ul>
  </div>
  <transition name='slide-view'>
    <router-view />
  </transition>
  <mt-spinner class='loadingBottom' color="#26a2ff" v-show='loadingBottom' type="double-bounce"></mt-spinner>
</div>
</template>

<script>
import Axios from 'axios'
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      type:'hot',
      isShow:false,
      start:0,
      maxP:0,
      list:[],
      mins:[],
      loading:false,
      loadingBottom:false,
      min:'全部',
    }
  },
  created(){
    this.loadingBottom = true;
    this.getDataClassifyMinor()
    this.getDataClassifyDetail()
  },
  methods:{
    back(){
      this.$router.back(-1)
    },
    getDataClassifyDetail(){
      let min = ''
      if(this.min!='全部'){
        min = this.min
      }
      let url = `/api/book/by-categories?&limit=20&major=${this.$route.params.name}&gender=${this.$route.params.type}&type=${this.type}&start=${this.start}&minor=${min}`
      Axios(url).then((res)=>{
        if(res.data.ok){
          this.list = this.list.concat(res.data.books)
          this.maxP = res.data.total/res.data.total.length;
          this.loading = false;
          this.loadingBottom = false;
        }else{
          this.loadingBottom = false;
          Toast({
            message: '没有该数据',
            duration: 2000
          });
        }
      })
    },
    getDataClassifyMinor(){
      let url = `/api/cats/lv2`
      Axios(url).then((res)=>{
        let type = this.$route.params.type
        let name = this.$route.params.name
        this.mins = res.data[type].filter(x=>x.major===name)[0].mins
        this.mins.unshift('全部')
      })
    },
    changeType(type){
      this.list = []
      this.type = type;
      this.loadingBottom = true;
      this.getDataClassifyDetail()
    },
    changeMinor(i){
      this.list = []
      this.min = i
      this.loadingBottom = true;
      this.getDataClassifyDetail()
    },
    toggle(){
      this.isShow = ! this.isShow
      this.$refs.toggle.style.transform = this.isShow ? 'rotate(90deg)':'rotate(-90deg)'
      this.$refs.list.style.transform = this.isShow ? 'translateY(40px)':'translateY(0)'
    },
    loadMore() {
      if(this.list.length){
        this.loading = true;
      }
      setTimeout(() => {
        // if(this.start >= this.maxP){
        //   this.loading = false;
        //   return
        // }
        this.start += 20
        this.getDataClassifyDetail()
      }, 3000);
    },
    add(id){
      console.log(id)
      this.$router.push({
        path:`/classify/${this.$route.params.type}/${this.$route.params.name}/${id}`
      })
    }
  },
}
</script>

<style lang='less'>
.classify_details{
  position: fixed;
  width: 100%;
  background: #fff;
  top:0;
  bottom:0;
  .title{
    position: relative;
    height:40px;
    background: #46C6BE;
    font-size: 30px;
    line-height: 40px;
    font-family: '宋体';
    font-weight: 900;
    color: #fff;
    span{
      margin-left: 10px;
    }
    p{
      position: absolute;
      top:0;
      left:50%;
      transform: translate(-50%,0);
      margin: 0;
      font-size: 16px;
    }
  }
  .type,.minor{
    position: relative;
    height:36px;
    font-size: 14px;
    line-height: 36px;
    border-bottom: 1px solid #46C6BE;
    .toggle{
      text-align: center;
      position: absolute;
      box-shadow: 0 0 4px #aaa;
      top:50%;
      right:8px;
      transform: translate(0,-50%);
      font-family: '宋体';
      font-size: 18px;
      width: 31px;
      height:18px;
      line-height: 18px;
      background: #46C6BE;
      color:#fff;
      border-radius: 10px;
      span{
        transition: all 0.5s;
        transform: rotate(-90deg);
        display: inline-block;
      }
    }
    a{
      margin-left: 20px;
      color:#212121;
      text-decoration: none;
      &.active{
        color:#009788;
        text-decoration: underline;
      }
    }
  }
  .minor{
    overflow-x: auto;
    overflow-y: hidden;
    box-shadow: 0 0 8px #ddd;
    div{
      white-space:nowrap;
      text-overflow:ellipsis;
      width: auto;
    }
  }
  .list{
    position: fixed;
    width: 100%;
    top:76px;
    bottom:0;
    overflow-x: hidden;
    overflow-y: auto;
    transition: all 0.3s;
    background: #F5F5F5;
    ul{
      padding: 0 12px 20px 12px;
      .loading{
        div{
          margin: 2px auto;
        }
      }
      li{
        margin-top: 14px;
        background: #fff;
        display: flex;
        padding: 12px;
        box-shadow: 0 0 10px #ddd;
        border-radius: 8px;
        /* image[lazy=loading] {
        width: 50px;
        height:71px;
        margin-right: 12px;
        box-shadow: 0 0 4px #aaa;
        } */
        img{
          width: 50px;
          height:71px;
          display: block;
          margin-right: 12px;
          box-shadow: 0 0 4px #aaa;
        }
        .r{
          flex: 1;
          font-size: 13px;
          white-space:nowrap;
          text-overflow:ellipsis;
          overflow:hidden;
          p{
            &:nth-child(1){
              margin: 0;
              display: flex;
              justify-content: space-between;
              .book_name{
                white-space:nowrap;
                text-overflow:ellipsis;
                overflow:hidden;
              }
              .author{
                font-size: 12px;
                color:#46C6BE;
              }
            }
            &:nth-child(2){
              margin: 0;
              white-space:nowrap;
              text-overflow:ellipsis;
              overflow:hidden;
              color:#888;
              margin-top: 10px;
              font-size: 12px;
            }
            &:nth-child(3){
              display:flex;
              justify-content: flex-end;
              margin-top: 10px;
              font-size: 10px;
              span{
                &:nth-child(1){
                  background: #F44336
                }
                &:nth-child(2){
                  background:#A9E3F9;
                  color:#000;
                }
                padding: 0 6px;
                color:#fff;
                border-radius: 25px;
                margin-right: 8px;
                box-shadow: 0 0 4px #aaa;
              }
            }
          }
        }
      }
    }
  }
}

.loadingBottom{
  div{
    margin: 50% auto;
  }
}
.slide-enter-active,.slide-leave-active {
  transition: all .3s;
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
