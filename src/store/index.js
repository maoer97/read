import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state:{
    bookList:[],
    bookshelf:[],
    isShow:false,
    bookId:'',
    chapterIndex:0,
    //chapters:[],
    theme:{
      background:'#E3EDCD',
      color:'#111',
    },
    fontSize:'14px',
  },
  getters:{
    currentBookList:state=>state.bookList,
    currentBookshelf:state=>state.bookshelf,
    currentId:state=>state.bookId,
    currentShow:state=>state.isShow,
    currentTheme:state=>state.theme,
    // currentChapters:state=>state.chapters,
    currentChapterIndex:state=>state.chapterIndex,
    currentChapterFontSize:state=>state.fontSize,
    // currentChapter:state=>state.chapters[state.chapterIndex],
  },
  mutations:{
    changeList(state,bookList){
      state.bookList = bookList
    },
    changeId(state,bookId){
      state.bookId = bookId
    },
    changeChapterIndex(state,chapterIndex){
      state.chapterIndex = chapterIndex
    },
    changeBookshelf(state,bookshelf){
      state.bookshelf = bookshelf
    },
    // changeChapters(state,chapters){
    //   state.chapters = chapters
    // },
    // changeChapterIndex(state,chapterIndex){
    //   state.chapterIndex = chapterIndex
    // },
    changeShow(state,isShow){
      state.isShow = isShow
    },
    changeTheme(state,theme){
      state.theme = theme
    },
    changeFontSize(state,fontSize){
      state.fontSize = fontSize
    },
  },
  actions:{
    addBookList({commit,state},list){
      let nlist = state.bookList
      nlist.push(list)
      commit('changeList',nlist)
    },
    addBookshelf({commit,state},list){
      let nlist = state.bookshelf
      nlist.push(list)
      commit('changeBookshelf',nlist)
    },
    // del({commit,state},item){
    //   let index = 0;
    //   let playlist = state.playList
    //   let currentindex = state.currentIndex
    //   for(let i=0 ; i< playlist.length; i++){
    //     if(playlist[i].id == item.id){
    //       index = i
    //     }
    //   }
    //   if(currentindex === playlist.length){
    //     currentindex --
    //   }
    //   playlist.splice(index,1)
    //   commit('changePlayList',playlist)
    //   commit('changePlaying',true)
    //   commit('changeCurrentIndex',currentindex)
    // },
  },
})
