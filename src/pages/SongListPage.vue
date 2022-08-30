<template>
  <div class="table">
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
                   @click="centerDialogVisible=true">添加歌单</el-button>
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
      <el-table-column label="歌单图片"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)"
                 style="width:100%" />
          </div>
          <el-upload :action="uploadUrl(scope.row.id)"
                     :before-upload="beforeAvatorUpload"
                     :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="title"
                       label="标题"
                       width="120"
                       align="center"></el-table-column>
      <el-table-column label="简介"
                       align="center">
        <template slot-scope="scope">
          <p style="height:100px;overflow:scroll;">{{scope.row.introduction}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="style"
                       label="风格"
                       width="120"
                       align="center"></el-table-column>

      <!-- 歌曲管理 -->
      <el-table-column label="歌曲管理"
                       width="110"
                       align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="songEdit(scope.row.id)">歌曲管理</el-button>
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
    <!-- 添加歌单 -->
    <el-dialog title="添加歌单"
               :visible.sync="centerDialogVisible"
               width="400px"
               center>
      <el-form :model="registerForm"
               ref="registerForm"
               label-width="80px">
        <el-form-item prop="title"
                      label="标题"
                      size="mini">
          <el-input v-model="registerForm.title"
                    placeholder="歌单标题"></el-input>
        </el-form-item>
        <el-form-item prop="introduction"
                      label="简介"
                      size="mini">
          <el-input v-model="registerForm.introduction"
                    type="textarea"
                    placeholder="简介"></el-input>
        </el-form-item>
        <el-form-item prop="style"
                      label="风格"
                      size="mini">
          <el-input v-model="registerForm.style"
                    placeholder="风格"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini"
                   @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini"
                   @click="addSongList">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改歌单 -->
    <el-dialog title="修改歌单"
               :visible.sync="editVisible"
               width="400px"
               center>
      <el-form :model="form"
               ref="form"
               label-width="80px">
        <el-form-item prop="title"
                      label="标题"
                      size="mini">
          <el-input v-model="form.title"
                    placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item prop="introduction"
                      label="简介"
                      size="mini">
          <el-input type="textarea"
                    v-model="form.introduction"
                    placeholder="简介"></el-input>
        </el-form-item>
        <el-form-item prop="style"
                      label="风格"
                      size="mini">
          <el-input resize="none"
                    v-model="form.style"
                    placeholder="风格"></el-input>
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
import '@/assets/js/iconfont.js'
import { setSongList, getAllSongList, updateSongList, deleteSongList } from '../api/index'

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
        title: '',
        introduction: '',
        style: ''
      },
      // 修改框
      form: {
        id: '',
        title: '',
        introduction: '',
        style: ''
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
    }
  },
  computed: {
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
          if (item.title.includes(this.select_word)) {
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
  methods: {
    // 获得当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    //查询所有歌手
    getData () {
      this.tempData = [];
      this.tableData = [];
      getAllSongList().then(res => {
        this.tempData = res;
        this.tableData = res;
        this.currentPage = 1;
      })
    },
    // 添加歌曲
    addSongList () {
      let params = new URLSearchParams();
      params.append('title', this.registerForm.title)
      // 默认歌单图片
      params.append('pic', '/img/songListPic/123.jpg');
      params.append('introduction', this.registerForm.introduction);
      params.append('style', this.registerForm.style);
      setSongList(params).then(res => {
        if (res.code == 1) {
          this.getData();
          this.notify('添加成功', 'success')
        } else {
          this.notify('添加失败', 'error')
        }
      })
        .catch(err => {
          console.log('添加歌单异常' + err);
        })
      this.centerDialogVisible = false;
      // 添加后跳转到最后一页
      this.currentPage = Math.ceil(++this.tableData.length / this.pageSize)
      console.log(this.currentPage);
    },
    // 转向歌单歌曲管理页面
    songEdit (id) {
      // console.log(id);
      this.$router.push({ path: `/ListSong`, query: { id } });
    },
    // 弹出编辑弹窗
    handleEdit (row) {
      this.editVisible = true;
      this.form = {
        id: row.id,
        title: row.title,
        introduction: row.introduction,
        style: row.style
      }
    },
    // 保存编辑结果
    editSave () {
      let params = new URLSearchParams();
      params.append('id', this.form.id);
      params.append('title', this.form.title);
      params.append('introduction', this.form.introduction);
      params.append('style', this.form.style)
      updateSongList(params).then(res => {
        if (res.code == 1) {
          this.getData();
          this.notify('修改成功', 'success');
        } else {
          this.notify('修改失败', 'error')
        }
      })
        .catch(err => {
          console.log('修改歌单异常' + err);
        })
      this.editVisible = false;
    },
    // 更新图片
    uploadUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
    },
    // 删除一页歌单
    deleteRow () {
      deleteSongList(this.idx)
        .then(res => {
          if (res) {
            this.getData();
            this.notify('删除成功', 'success');
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(err => {
          console.log('删除歌单异常' + err);
        })
      this.delVisible = false
    },
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