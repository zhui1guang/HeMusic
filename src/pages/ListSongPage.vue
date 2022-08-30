<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>歌单歌曲信息
    </div>
    <!-- 动作容器 -->
    <div class="container">
      <div class="handle-box">
        <el-button size="mini"
                   type="danger"
                   @click="delAll">批量删除</el-button>
        <el-input v-model="select_word"
                  size="mini"
                  class="handle-input"
                  placeholder="筛选关键词"></el-input>
        <el-button type="primary"
                   size="mini"
                   @click="centerDialogVisible=true">添加歌曲</el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table size="mini"
              ref="multipleTable"
              border
              style="width:100%"
              height="680px"
              :data="data"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column label="歌曲图片"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)"
                 style="width:100%" />
          </div>
          <!-- 音乐播放器 -->
          <div class="play"
               @click="setSongUrl(scope.row.url,scope.row.name)">
            <div v-if="toggle==scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-zanting"></use>
              </svg>
            </div>
            <div v-if="toggle!=scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-bofanganniu"></use>
              </svg>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="歌手-歌曲"
                       align="center"></el-table-column>

      <!-- 操作数据 -->
      <el-table-column label="操作"
                       width="150"
                       align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.row.id)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background
                     layout="total,prev,pager,next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="tableData.length"
                     @current-change="handleCurrentChange"></el-pagination>
    </div>
    <!-- 添加歌曲 -->
    <el-dialog title="添加歌曲"
               :visible.sync="centerDialogVisible"
               width="400px"
               center>
      <el-form :model="registerForm"
               ref="registerForm"
               label-width="80px"
               id="tf">
        <el-form-item prop="singerName"
                      label="歌手名字"
                      size="mini">
          <el-input v-model="registerForm.singerName"
                    placeholder="歌手名字"></el-input>
        </el-form-item>
        <el-form-item prop="songName"
                      label="歌曲名"
                      size="mini">
          <el-input v-model="registerForm.songName"
                    placeholder="歌曲名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini"
                   @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini"
                   @click="getSongId">确定</el-button>
      </span>
    </el-dialog>

    <!-- 删除歌手 -->
    <el-dialog title="删除歌曲"
               :visible.sync="delVisible"
               width="300px"
               center>
      <div align="center">
        删除不可恢复，是否确定删除？
      </div>
      <span slot="footer">
        <el-button size="mini"
                   @click="delVisible=false">取消</el-button>
        <el-button size="mini"
                   @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../mixins/index';
import { mapGetters } from 'vuex';
import '@/assets/js/iconfont.js'
import { listSongDetail, songOfSongId, songOfSongName, listSongAdd, delListSong } from '../api/index'

export default {
  mixins: [mixin],
  data () {
    return {
      songListId: '',//歌单id
      centerDialogVisible: false,//添加弹窗是否显示
      delVisible: false,
      // 添加框
      registerForm: {
        singerName: '',
        songName: '',
      },
      // 记录选择的记录
      multipleSelection: [],
      tableData: [],
      // 歌手-歌曲名
      name: [],
      // 当前页的记录
      tempData: [],
      // 搜索歌手-歌曲
      select_word: '',
      // 每页记录数
      pageSize: 5,
      currentPage: 1,
      idx: -1,//当前选择项
      toggle: false//播放器的图表状态
    }
  },
  computed: {
    // 监听播放还是暂停
    ...mapGetters([
      'isPlay'
    ]),
    // 计算当前表里的数据
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  watch: {
    // 搜索框里的内容与表格匹配内容同步变化
    select_word: function () {
      // 搜索框为空，显示当前页的所有结果
      if (this.select_word == '') {
        this.tableData = this.tempData;
      } else {
        // 否则先清空当前页 在用includes判断是否含有匹配的名字
        this.tableData = [];
        for (let item of this.tempData) {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item)
          }
        }
      }
    },
  },
  created () {
    this.songListId = this.$route.query.id;
    this.getData();
  },
  destroyed () {
    this.$store.commit('setIsPlay', false)
  },
  methods: {
    // 获得当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    //查询所有歌手
    getData () {
      this.tempData = [];
      this.tableData = [];
      listSongDetail(this.songListId).then(res => {
        for (let item of res) {

          this.getSong(item.songId)
        }
      })
    },
    // 根据歌曲id查询歌曲对象，放到tableData和tableData里面
    getSong (id) {
      songOfSongId(id)
        .then(res => {
          // console.log('res');
          // console.log(res.name);
          this.name.push(res.name)
          this.tempData.push(res)
          this.tableData.push(res)
        })
        .catch(err => {
          console.log('根据歌曲id查询异常' + err);
        })
    },
    // 添加歌曲前要获得歌曲的id
    getSongId () {
      let _this = this
      var songOfName = _this.registerForm.singerName + '-' + _this.registerForm.songName
      if (_this.name.includes(songOfName)) {
        _this.notify('添加失败，该歌曲已存在', 'error')

      } else {
        console.log(songOfName);
        songOfSongName(songOfName)
          // 曲库有该歌曲
          .then(res => {
            // console.log('添加歌曲前要获得歌曲的id' + res);
            _this.addSong(res[0].id)
          })
          // 该歌曲不存在
          .catch(err => {
            _this.notify('抱歉，该歌曲版权正在争取中T_T', 'error')
            console.log('没有该歌曲' + err);
          })
      }
    },
    // 添加歌曲
    addSong (songId) {
      let _this = this
      let params = new URLSearchParams()
      params.append('songId', songId)
      params.append('songListId', this.songListId)
      listSongAdd(params)
        .then(res => {
          if (res.code == 1) {
            this.getData()
            this.notify('添加成功', 'success')
          } else {
            this.notify('添加失败', 'error')
          }
        })
        .catch(err => {
          console.log('添加歌单歌曲异常' + err);
        })

      _this.centerDialogVisible = false
    },
    // 删除一首歌曲
    deleteRow () {
      delListSong(this.idx, this.songListId)
        .then(res => {
          if (res) {
            this.getData();
            this.notify('删除成功', 'success');
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(err => {
          console.log('删除歌曲异常' + err);
        })
      this.delVisible = false
    },
    // 切换播放歌曲
    setSongUrl (url, name) {
      // 如果toggle不等于传入的name，则播放
      if (this.toggle != name) {
        this.toggle = name;
        this.$store.commit('setUrl', this.$store.state.HOST + url)
        this.$store.commit('setIsPlay', true)
      } else {
        this.toggle = false
        this.$store.commit('setIsPlay', false)
      }
    }
  },
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.song-img {
  width: 100%;
  height: 80%;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}
.pagination {
  display: flex;
  justify-content: center;
}
.play {
  position: absolute;
  z-index: 100;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  top: 18px;
  left: 15px;
}
.icon {
  width: 2em;
  height: 2em;
  color: #fff;
  fill: currentColor;
  overflow: hidden;
}
</style>