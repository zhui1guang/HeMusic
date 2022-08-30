import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    HOST: 'http://127.0.0.1:8888',
    // 音乐播放器状态控制
    isPlay: false, //是否播放
    url: '',//歌曲地址
    id: '' //歌曲id
  },
  getters: {
    isPlay: state => state.isPlay,
    url: state => state.url,
    id: state => state.id
  },
  // 更改状态的唯一方法——提交mutation
  mutations: {
    setIsPlay: (state, isPlay) => { state.isPlay = isPlay },
    setUrl: (state, url) => { state.url = url },
    setId: (state, id) => { state.id = id }
  }
})
export default store