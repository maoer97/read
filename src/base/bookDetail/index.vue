<template>
  <div class="book_detail">
    <div class="title">
      <span @click='back'>&lt</span>
      <p>BOOK</p>
    </div>
    <div class="bg">
      <img :src="'http://statics.zhuishushenqi.com'+list.cover" alt="">
      <p class="b_title">{{list.title}}</p>
      <p class='b_author'><span>{{list.author}} | </span><span>{{list.minorCate}} | </span><span>{{Math.round(list.wordCount/10000)}}万字</span> </p>
      <button class='add' :disabled='disable' @click='bookshelf'>加入书架</button>
      <button class='read' :disabled='disable' @click='read'>开始阅读</button>
    </div>
    <div class="longIntro">
      <div class="txt">
        <p class='active' ref='txt'>{{list.longIntro}}</p>
      </div>
      <div class='toggle'  @click='toggle'><span ref='toggle'>&lt</span></div>
    </div>
    <div class="lastChapter">
      <button @click='listShow' :disabled='disable'><span>获取章节</span> {{list.lastChapter}}</button>
      <transition name='slide'>
        <div class="blur" v-show='isListShow' @click='listShow'>
          <div class="c_list" >
            <ul>
              <li v-for='(i,index) in chapters'><a href='#' @click='getChapterDetail(index)'> {{i.title}}</a><span class='iconfont icon-lock' v-show='i.unreadble'></span> </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name='slide-view'>
      <router-view />
    </transition>
  </div>
</template>

<script>
import Axios from 'axios'
import { Toast } from 'mint-ui';
import {mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  data() {
    return {
      list:{},
      isShow:false,
      chapters:[],
      isListShow:false,
      sourceId:'',
      disable:true,
    }
  },
  created() {
    this.getData()
    this.changeSource()
  },
  methods: {
    back(){
      this.$router.back(-1)
    },
    getData(){
      let url = `/api/book/${this.$route.params.id}`
      Axios(url).then((res)=>{
      // console.log(res)
        this.list = res.data
      })
    },
    changeSource(){
      let url = `/api/atoc?view=summary&book=${this.$route.params.id}`
      Axios(url).then((res)=>{
        this.sourceId = res.data[0]._id
        this.getChapter()
      })
    },
    getChapter(){
      let url = `/api/atoc/${this.sourceId}?view=chapters`
      Axios(url).then((res)=>{
      //  console.log(res.data)
        this.chapters = res.data.chapters
        this.disable = false
      })
    },
    toggle(){
      if(this.isShow){
        this.$refs.txt.classList.add('active')
      }else{
        this.$refs.txt.classList.remove('active')
      }
      this.isShow = ! this.isShow
      this.$refs.toggle.style.transform = this.isShow ? 'rotate(90deg)':'rotate(-90deg)'
    },
    listShow(){
      this.isListShow = !this.isListShow
    },
    bookshelf(){
      if(this.currentBookshelf.filter(x=>x.id===this.currentId).length===0){
        let book = {
          id:this.sourceId,
          name:this.list.title,
          cover:`http://statics.zhuishushenqi.com${this.list.cover}`,
          chapters:this.chapters
        }
         this.addBookshelf(book)
      }
      this.changeId(this.sourceId)
    },
    read(){
      this.addChapterDetail()
    },
    getChapterDetail(index){
      this.addChapterDetail()
      this.changeChapterIndex(index)
    },
    addChapterDetail(){
      if(this.currentBookList.filter(x=>x.id===this.currentId).length===0){
        let book = {
          id:this.sourceId,
          name:this.list.title,
          cover:`http://statics.zhuishushenqi.com${this.list.cover}`,
          chapters:this.chapters
        }
        this.addBookList(book)
      }
        this.changeShow(true)
        this.changeId(this.sourceId)
    },
    ...mapActions(['addBookList','addBookshelf']),
    ...mapMutations([,'changeShow','changeId','changeChapterIndex'])
  },
  computed:{
    ...mapGetters(['currentBookList','currentBookshelf','currentId'])
  }
}
</script>

<style lang='less' scoped>
@import 'http://at.alicdn.com/t/font_899698_kc25c4kixpg.css';
.book_detail{
  position: fixed;
  top:0;
  bottom:0;
  width:100%;
  background: #fff;
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
  .bg{
    width: 100%;
    height:192px;
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;
    /* background: #46C6BE; */
    background: linear-gradient(180deg, #46C6BE,#7BF5E4); /* 标准的语法 */
    img{
      position:absolute;
      left:50%;
      top:10px;
      transform: translateX(-50%);
      width: 60px;
      box-shadow: 0 0 5px #999;
    }
    .b_title{
      position:absolute;
      top: 96px;
      left:50%;
      margin: 0;
      transform: translateX(-50%);
      font-size: 16px;
      color:#fff;
    }
    .b_author{
      position:absolute;
      top: 126px;
      left:50%;
      margin: 0;
      white-space:nowrap;
      transform: translateX(-50%);
      font-size: 12px;
      color:#fff;
      text-shadow: 0 0 4px #999;
    }
    button{
      &.add{
        top: 150px;
        left:16%;
      }
      &.read{
        top: 150px;
        right:16%;
      }
      position:absolute;
      margin: 0;
      font-size: 12px;
      outline: none;
      border: 0;
      width: 100px;
      height:30px;
      background: #26A2FF;
      border-radius: 8px;
      color:#fff;
      box-shadow: 0 0 4px #999;
      &:active{
        background:#188FF0;
      }
    }
  }
  .longIntro{
    position: relative;
    box-shadow: 0 0 4px #aaa;
    padding-bottom: 10px;
    .txt{
      padding: 10px 20px;
      p{
        margin: 0;
        font-size: 14px;
        color:#333;
        &.active{
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
    .toggle{
      text-align: center;
      position: absolute;
      box-shadow: 0 0 4px #aaa;
      bottom:2px;
      left:50%;
      transform: translate(-50%,0);
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
  }
  .lastChapter{
    button{
      text-align: center;
      width: 100%;
      display: block;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      margin-top:10px;
      background: #26A2FF;
      border: 0;
      outline: 0;
      border-radius: 5px;
      box-shadow: 0 0 4px #aaa;
      &:active{
        background:#188FF0;
      }
      span{
        color:#fff;
      }
    }
    .blur{
      position: fixed;
      top:0;
      bottom: 0;
      width:100%;
      background: rgba(0,0,0,0.5);
      .c_list{
        position: fixed;
        top:232px;
        bottom:0;
        width:100%;
        overflow-y: auto;
        background: #fff;
        box-shadow: 0 0 10px grey;
        border-radius: 5px;
        ul{
          li{
            display: flex;
            justify-content: space-between;
            padding: 4px 20px;
            overflow: hidden;
            a{
              overflow: hidden;
              margin: 0;
              font-size: 12px;
              color:#333;
              text-decoration: none;
            }
            span{
              color:#188FF0;
            }
          }
        }
      }
    }
  }
}
.slide-enter-active,.slide-leave-active {
  transition: all .25s;
}
.slide-enter, .slide-leave-to{
  transform: translateY(100%);
}
.slide-view-enter-active,.slide-view-leave-active {
  transition: all .3s ease;
}
.slide-view-enter, .slide-view-leave-to{
  transform: translateX(100%);
}
</style>
