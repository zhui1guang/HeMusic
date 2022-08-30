<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>歌曲信息
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
          <el-upload :action="uploadUrl(scope.row.id)"
                     :before-upload="beforeAvatorUpload"
                     :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="歌手-歌曲"
                       width="120"
                       align="center"></el-table-column>
      <el-table-column label="歌词"
                       align="center">
        <template slot-scope="scope">
          <ul style="height:100px;overflow:scroll;">
            <li v-for="(item,index) in parseLyric(scope.row.lyric)"
                :key="index">
              {{item}}
            </li>
          </ul>
        </template>
      </el-table-column>

      <!-- 资源更新 -->
      <el-table-column label="资源更新"
                       width="110"
                       align="center">
        <template slot-scope="scope">
          <el-upload :action="uploadSongUrl(scope.row.id)"
                     :before-upload="beforeSongUpload"
                     :on-success="handleSongSuccess">
            <el-button size="mini">更新歌曲</el-button>
          </el-upload>

        </template>
      </el-table-column>

      <!-- 操作数据 -->
      <el-table-column label="操作"
                       width="150"
                       align="center">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)"
                     size="mini">编辑</el-button>
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
        <div>
          <label>歌名</label>
          <!-- el-input 中没有 v-model， 记住一定要加 v-model 没有加会输入不了内容 -->
          <el-input name="name"
                    v-model="registerForm.name"></el-input>
        </div>
        <div>
          <label>专辑</label>
          <el-input type="text"
                    name="introduction"
                    v-model="registerForm.introduction"></el-input>
        </div>
        <div>
          <label>歌词</label>
          <el-input type="textarea"
                    name="lyric"
                    v-model="registerForm.lyric"
                    resize="none"></el-input>
        </div>
        <div>
          <label>歌曲上传</label>
          <input type="file"
                 name="file">
        </div>
      </el-form>
      <span slot="footer">
        <el-button size="mini"
                   @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini"
                   @click="addSong">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改歌手 -->
    <el-dialog title="修改歌曲"
               :visible.sync="editVisible"
               width="400px"
               center>
      <el-form :model="form"
               ref="form"
               label-width="80px">
        <el-form-item prop="name"
                      label="歌手-歌曲名"
                      size="mini">
          <el-input v-model="form.name"
                    placeholder="歌手-歌曲名"></el-input>
        </el-form-item>
        <el-form-item prop="introduction"
                      label="专辑"
                      size="mini">
          <el-input type="textarea"
                    v-model="form.introduction"
                    placeholder="专辑"></el-input>
        </el-form-item>
        <el-form-item prop="lyric"
                      label="歌词"
                      size="mini">
          <el-input type="textarea"
                    resize="none"
                    v-model="form.lyric"
                    placeholder="歌词"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini"
                   @click="editVisible=false">取消</el-button>
        <el-button size="mini"
                   @click="editSave">确定</el-button>
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
import { songOfSingerId, updateSong, delSong } from '../api/index'

export default {
  mixins: [mixin],
  data () {
    return {
      singerId: '',
      singerName: '',
      centerDialogVisible: false,//添加弹窗是否显示
      editVisible: false,
      delVisible: false,
      // 添加框
      registerForm: {
        name: '',
        singerName: '',
        introduction: '',
        lyric: ''
      },
      form: {
        id: '',
        name: '',
        introduction: '',
        lyric: ''
      },
      // 记录选择的记录
      multipleSelection: [],
      tableData: [],
      // 当前页的记录
      tempData: [],
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
    }
  },
  created () {
    this.singerId = this.$route.query.id;
    this.singerName = this.$route.query.name;
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
      songOfSingerId(this.singerId).then(res => {
        this.tempData = res;
        this.tableData = res;
        this.currentPage = 1;
      })
    },
    // 添加歌曲
    addSong () {
      let _this = this;
      var form = new FormData(document.getElementById('tf'));
      form.append('singerId', this.singerId);
      form.set('name', this.singerName + '-' + form.get('name'));
      if (!form.get('lyric')) {
        form.set('lyric', '[00:00:00]暂无歌词');
      }
      // ajax请求
      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
          let res = JSON.parse(req.response)

          if (res.code) {
            _this.getData();
            _this.registerForm = {};
            _this.notify(res.msg, 'success');
          } else {
            _this.notify('添加失败', 'error')
          }
        }
      }
      req.open('post', `${_this.$store.state.HOST}/song/add`, false);
      req.send(form);
      _this.centerDialogVisible = false;
      // 添加后跳转到最后一页
      this.currentPage = Math.ceil(++this.tableData.length / this.pageSize)
    },
    // 转向歌曲管理页面
    songEdit (id, name) {
      this.$router.push({ path: '/Song', query: { id, name } })
    },
    // 弹出编辑弹窗
    handleEdit (row) {
      this.editVisible = true;
      this.form = {
        id: row.id,
        name: row.name,
        introduction: row.introduction,
        lyric: row.lyric
      }
    },
    // 保存编辑结果
    editSave () {
      let params = new URLSearchParams();
      params.append('id', this.form.id);
      params.append('name', this.form.name);
      params.append('introduction', this.form.introduction);
      params.append('lyric', this.form.lyric)
      updateSong(params).then(res => {
        if (res.code == 1) {
          this.getData();
          this.notify('修改成功', 'success');
        } else {
          this.notify('修改失败', 'error')
        }
      })
        .catch(err => {
          console.log('修改歌曲异常' + err);
        })
      this.editVisible = false;
    },
    // 更新图片
    uploadUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
    },
    // 删除一首歌曲
    deleteRow () {
      delSong(this.idx)
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
    // 更新歌曲url
    uploadSongUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
    },
    // 上传歌曲前的校验
    beforeSongUpload (file) {
      var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (testMsg != 'mp3') {
        this, $message({
          message: '只能上传mp3格式的文件',
          type: 'error'
        });
        return false;
      }
      return true;
    },
    // 上传成功后要做的工作
    handleSongSuccess (res) {
      let _this = this;
      if (res.code == 1) {
        _this.getData();
        _this.notify('上传成功', 'success');
      } else {
        _this.notify('上传失败', 'error'
        )
      }
    },
    // 解析歌词
    parseLyric (text) {
      // 分解成数组
      let lines = text.split("\n");
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
      let result = []
      for (let item of lines) {
        let value = item.replace(pattern, '')
        if (value != null) {
          result.push(value)
        }
      }
      return result
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