<template>
  <div class="reader" :style='{fontSize:currentChapterFontSize,background:neight?neightTheme.background:currentTheme.background,color:neight?neightTheme.color:currentTheme.color}'>
    <ul
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10"
    ref='readerList'
    class='readerList'
    @click='menu'>
    <li v-for='(i,index) in list'>
      <h3>{{i.title}}</h3>
      <p v-for='(_i,_index) in i.txt'>{{_i}}</p>
    </li>
    <mt-spinner type="triple-bounce" class='read_loading' color="#26a2ff" v-show='loading'></mt-spinner>
  </ul>

  <div class="menu" @click='menu'>
    <transition name='header'>
      <div class="header" v-show='menuShow' :style='{background:neight? "rgba(0,0,0,0.9)":"rgba(70,198,190,0.9)"}'>
        <span @click='close'>&lt</span>
        <p>{{title}}</p>
        <span class="iconfont icon-caidanmenu42" @click.stop='more'></span>
        <transition name='more'>
          <div class="more" v-show='moreShow'>
            <ul>
              <li>
                <i class="iconfont icon-37"></i>
                <router-link to='/classify' @click.native='home'>首页</router-link>
              </li>
              <li>
                <i class="iconfont icon-books"></i>
                <a href="#">书架</a>
              </li>
            </ul>
          </div>
        </transition>
        <transition name='night'>
          <div class="night" v-show='nightShow'>
            <div
             @touchstart.stop='night1'
             @touchmove.stop='night2'
             @touchend.stop='night3'>
              <span ref='string' :style="{height:'20px'}"></span>
              <span></span>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <transition name='footer'>
      <div class="footer"  v-show='menuShow' :style='{background:neight? "rgba(0,0,0,0.9)":"rgba(70,198,190,0.9)"}'>
        <div class="font">
          <span :class='{active:currentChapterFontSize==="12px"}' @click.stop='fontSize(-1)'>A-</span>
          <span>{{currentChapterFontSize}}</span>
          <span :class='{active:currentChapterFontSize==="28px"}' @click.stop='fontSize(1)'>A+</span>
        </div>
        <div class="theme">
          <div class="list">
            <span v-for='(i,index) in themes' :style="{background:i.background}" @click.stop='reTheme(index)'></span>
          </div>
        </div>
        <div class="bottom">
          <span @click.stop='prev'>上一章</span>
          <span @click.stop='content'>目录</span>
          <span @click.stop='next'>下一章</span>
        </div>
        <div class="addOrRemove">
          <i class="iconfont icon-wuuiconxiangjifangda"></i>
        </div>
      </div>
    </transition>
  </div>
  <transition name='content'>
    <div class="content" v-show='contentShow' @click.stop='content'>
      <div>
        <ul>
          <li v-for='(i,index) in chapters'><a href="#" @click='chapter(index)'>{{i.title}}</a></li>
        </ul>
      </div>
    </div>
  </transition>
  <mt-spinner type="snake" color="#26a2ff" class="book_loading" v-show='bookLoading'></mt-spinner>
</div>
</template>

<script>
import Axios from 'axios'
import {mapGetters,mapMutations,mapActions} from 'vuex'

export default {
  data() {
    return {
      list:[],
      loading:false,
      menuShow:false,
      title:'',
      size:'12px',
      bookLoading:true,
      contentShow:false,
      chapters:[],
      moreShow:false,
      nightShow:true,
      neight:false,
      neightTheme:{
        background:'#222',
        color:'#ddd',
      },
      themes:[
        {
          background:'#E3EDCD',
          color:'#111',
        },
        {
          background:'#FAF9DE',
          color:'#111',
        },
        {
          background:'#FFF2E2',
          color:'#111',
        },
        {
          background:'#FDE6E0',
          color:'#111',
        },
        {
          background:'#DCE2F1',
          color:'#111',
        },
        {
          background:'#EAEAEF',
          color:'#111',
        },
      ]
    }
  },
  computed:{
    ...mapGetters(['currentBookList','currentShow','currentId','currentChapterIndex','currentChapterFontSize','currentTheme'])
  },
  methods: {
    getData(){
      this.chapters = this.currentBookList.filter(x=>x.id===this.currentId)[0].chapters
      this.title = this.currentBookList.filter(x=>x.id===this.currentId)[0].name
      let link = this.currentBookList.filter(x=>x.id===this.currentId)[0].chapters[this.currentChapterIndex].link
      let url = `/juhe/chapters/${encodeURIComponent(link)}`
      Axios(url).then((res)=>{
        let txt =  res.data.chapter.cpContent.split('\n')
        let chapter = {
          title:res.data.chapter.title,
          txt:txt
        }
        this.list = this.list.concat(chapter)
        this.loading = false
        this.bookLoading = false
      })
    },
    menu(){
      this.menuShow = !this.menuShow
    },
    loadMore(){
      if(!this.list[0]){
        return
      }
      this.loading = true
      setTimeout(()=>{
        let index = this.currentChapterIndex
        index++
        this.changeChapterIndex(index)
        this.getData()
      },1000)
    },
    close(){
      this.changeShow(false)
    },
    fontSize(x){
      let size = parseInt(this.currentChapterFontSize)
      size += x
      if(size < 12){
        size = 12
      }else if(size>28){
        size = 28
      }
      this.changeFontSize(`${size}px`)
    },
    reTheme(index){
      let theme = this.themes[index]
      this.changeTheme(theme)
    },
    prev(){
      this.list = []
      this.bookLoading = true
      let index = this.currentChapterIndex
      index--
      if(index===0){
        return
      }
      this.changeChapterIndex(index)
      this.getData()
    },
    next(){
      this.list = []
      this.bookLoading = true
      let index = this.currentChapterIndex
      index++
      this.changeChapterIndex(index)
      this.getData()
    },
    content(){
      this.contentShow = !this.contentShow
    },
    chapter(index){
      this.list = []
      this.bookLoading = true
      this.changeChapterIndex(index)
      this.getData()
    },
    more(){
      this.moreShow = !this.moreShow
      this.nightShow = !this.nightShow
    },
    night1(e){
      this.y = e.touches[0].pageY
       //console.log(e.touches[0].pageY)
    },
    night2(e){
     this.y2 = e.touches[0].pageY
     let offset = this.y2 - this.y
     let h = parseInt(this.$refs.string.style.height)
     if(this.y2 < this.y){
       return
     }
     if(h>=60){
       return
     }
     this.$refs.string.style.height = `${h+offset/10}px`
    },
    night3(e){
      let h = parseInt(this.$refs.string.style.height)
      if(h < 59){
        this.$refs.string.style.height = '20px'
      }else{
        this.neight = !this.neight
        this.$refs.string.style.height = '20px'
      }
    },
    home(){
      console.log(111)
      this.changeShow(false)
    },
    ...mapMutations(['changeChapterIndex','changeShow','changeFontSize','changeTheme'])
  },
  watch:{
    currentShow(val){
      this.list = []
      this.getData()
    }
  }
}
</script>

<style lang='less' scoped>
@import '//at.alicdn.com/t/font_899698_77ae7jj8iai.css';
.reader{
  position: fixed;
  top:0;
  bottom:0;
  width: 100%;
  overflow-y: auto;
  ul{
    padding-bottom: 20px;
    h3{
      padding: 0 24px;
      font-family: '微软雅黑';
      font-weight: 500;
      font-size:1.2rem;
    }
    p{
      font-family: '微软雅黑';
      font-weight: 200;
      padding: 0 12px;
      margin: 8px 12px;
      font-size: 1em;
    }
    .read_loading{
      display: flex;
      justify-content: center;
    }
  }
  .menu{
    position: fixed;
    top:0;
    bottom:0;
    width:100%;
    pointer-events: auto;
    .header{
      position: relative;
      height:40px;
      background: rgba(70,198,190,0.9);
      font-size: 30px;
      line-height: 40px;
      font-family: '宋体';
      font-weight: 900;
      color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 5px #555;
      span{
        margin-left: 10px;
      }
      .icon-caidanmenu42{
        float: right;
        margin-right: 12px;
        font-size: 20px;
      }
      p{
        position: absolute;
        top:0;
        left:50%;
        transform: translate(-50%,0);
        margin: 0;
        font-size: 16px;
      }
      .more{
        position: fixed;
        top:50px;
        right:10px;
        font-size: 12px;
        width: 100px;
        height:60px;
        background: rgba(70,198,190,0.9);
        border-radius: 8px;
        box-shadow: 0 0 5px #555;
        ul{
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          margin: 0;
          padding: 0;
          height:100%;
          li{
            margin: 0;
            height:20px;
            display: flex;
            justify-content: center;
            align-items: center;
            &:nth-child(2){
              margin-top: 12px;
            }
            i{
              display: block;
            }
            a{
              display: block;
              margin-left: 10px;
              color:#fff;
              text-decoration: none;
            }
          }
        }
      }
      .night{
        position: fixed;
        top:40px;
        right:10px;
        div{
          span:nth-child(1){
            margin: 0 auto;
            display: block;
            width: 6px;
            height:20px;
            background: #fff;
            box-shadow: 0 0 2px #666 inset;
          }
          span:nth-child(2){
            &:after{
              content:'';
              display: block;
              margin: 2px auto;
              width: 10px;
              height: 10px;
              background: #fff;
              box-shadow: 0 0 10px rgb(70,198,190) inset;
              border-radius: 50%;
            }
            margin: 0 auto;
            display: block;
            width: 18px;
            height: 18px;
            background: rgb(70,198,190);
            box-shadow: 0 0 2px #666 inset;
            border-radius: 50%;
            overflow:hidden;
          }
        }
      }
    }
    .footer{
      position: absolute;
      bottom:0;
      height:80px;
      width: 100%;
      border-radius: 10px;
      background: rgba(70,198,190,0.9);
      box-shadow: 0 0 5px #555;
      .font{
        width: 60%;
        margin: 0 auto;
        height:30px;
        color:#fff;
        font-weight: 200;
        font-size: 18px;
        display: flex;
        justify-content:space-between;
        align-items: center;
        span{
          text-shadow: 0 0 4px #888;
        }
        span:nth-child(2){
          font-size: 12px;
        }
        .active{
          color:#ddd;
        }
      }
      .theme{
        position: fixed;
        height:26px;
        bottom:24px;
        background: #fff;
        width: 100%;
        border-radius: 5px;
        box-shadow: 0 0 5px #aaa;
        overflow-x: auto;
        div{
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        span{
          display: inline-block;
          width: 60px;
          height:20px;
          border-radius: 4px;
          box-shadow: 0 0 5px #888;
          margin: 3px 6px;
        }
      }
      .bottom{
        width: 80%;
        margin:0 auto;
        height:24px;
        display: flex;
        justify-content: space-between;
        margin-top: 26px;
        color:#fff;
        font-size: 12px;
        line-height: 24px;
      }
      .addOrRemove{
        position: fixed;
        bottom:94px;
        right:20px;
        .iconfont{
          font-size:34px;
          color:rgba(70,198,190,0.9);
        }
      }
    }
  }
  .content{
    position: fixed;
    top:0;
    bottom:0;
    width: 100%;
    bottom:0;
    background: rgba(0, 0, 0, 0.4);
    div{
      position: absolute;
      z-index: 6;
      bottom:20px;
      left:50%;
      transform: translateX(-50%);
      width: 85%;
      height:80%;
      background: #fff;
      border-radius: 8px;
      overflow-y: auto;
      box-shadow: 0 0 10px #555;
      ul{
        padding: 0 20px;
        font-size: 12px;
        li{
          margin: 6px 0;
          border-bottom: 1px solid #ddd;
          height:30px;
          line-height: 30px;
          a{
            color:#333;
            text-decoration: none;
          }
        }
      }
    }
  }
}
.book_loading{
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-enter-active,.header-leave-active {
  transition: all .3s ease;
}
.header-enter, .header-leave-to{
  opacity: 0;
  transform: translateY(-100%);
}
.footer-enter-active,.footer-leave-active {
  transition: all .3s ease;
}
.footer-enter, .footer-leave-to{
  opacity: 0;
  transform: translateY(100%);
}
.content-enter-active,.content-leave-active {
  transition: all .3s ease;
}
.content-enter, .content-leave-to{
  opacity: 0;
  transform: translateX(100%);
}
.more-enter-active,.more-leave-active {
  transition: all .3s ease;
}
.more-enter, .more-leave-to{
  opacity: 0;
  transform: translateX(100%);
}
</style>
