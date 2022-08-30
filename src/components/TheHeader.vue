<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn"
         @click="collapseChange">
      <i class="el-icon-menu"></i>
    </div>

    <div class="logo">music后台管理</div>
    <div class="header-right">
      <div class="btn-fullscreen"
           @click="handleFullScreen">
        <!-- 鼠标 hover 时的提示信息。 -->
        <el-tooltip placement="bottom"
                    :content="fullscreen?`取消全屏`:`全屏`">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </div>
      <!-- 头像 -->
      <div class="user-avator">
        <img src="../assets/img/user.jpg" />
      </div>
      <!-- 下拉菜单 command点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作 -->
      <el-dropdown class="user-name"
                   trigger="click"
                   @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from '../assets/js/bus'
export default {
  data () {
    return {
      // 折叠
      collapse: false,
      // 全屏
      fullscreen: false
    };
  },
  computed: {
    username () {
      return localStorage.getItem('username')
    }
  },
  methods: {
    collapseChange () {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse)
    },
    // 全屏
    handleFullScreen () {
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          // Safari/Chrome
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();//火狐
        } else if (document.msExitFullScreen) {
          document.msExitFullScreen()//ie
        }
      } else {
        let element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {      //safari 、Chrome
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {         //firefox
          element.mozRequestFullScreen();
        } else if (element.msRequestFullScreen) {         //ie
          element.msRequestFullScreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    handleCommand (command) {
      // 退出登录
      if (command == "logout") {
        localStorage.removeItem('username');
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  background: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: #ffffff;
  cursor: pointer;
}
</style>