<template>
  <div class="song-audio">
    <audio id="player"
           controls
           :src="url"
           preload="true"
           @canplay="startPlay"
           @ended="ended"
           loop></audio>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'song-audio',
  computed: {
    ...mapGetters([
      'id',
      'url',
      'isPlay'
    ])
  },
  watch: {
    // 监听播放还是暂停
    isPlay: function () {
      this.togglePlay()
    }
  },
  methods: {
    startPlay () {
      let player = document.getElementById('player')
      player.play();
    },
    ended () {
      this.isPlay = false;
    },
    // 播放、暂停
    togglePlay () {
      let player = document.getElementById('player')
      if (this.isPlay) {
        player.play()
      } else {
        player.pause();
      }
    }
  }
}
</script>
<style >
.song-audio {
  display: none;
}
</style>