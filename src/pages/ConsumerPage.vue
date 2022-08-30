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
                  placeholder="筛选相关用户"></el-input>
        <el-button type="primary"
                   size="mini"
                   @click="centerDialogVisible=true">添加新用户</el-button>
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
      <el-table-column label="用户头像"
                       width="110"
                       align="center">
        <template slot-scope="scope">
          <div class="consumer-img">
            <img :src="getUrl(scope.row.avator)"
                 style="width:100%" />
          </div>
          <el-upload :action="uploadUrl(scope.row.id)"
                     :before-upload="beforeAvatorUpload"
                     :on-success="handleAvatorSuccess">
            <el-button size="mini">更新头像</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="username"
                       label="用户名"
                       width="120"
                       align="center"></el-table-column>
      <el-table-column label="性别"
                       width="50"
                       align="center">
        <template slot-scope="scope">
          {{changeSex(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column prop="phoneNum"
                       align="center"
                       label="手机号"
                       width="120"></el-table-column>
      <el-table-column label="生日"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          {{attachBirth(scope.row.birth)}}
        </template>
      </el-table-column>
      <el-table-column prop="location"
                       label="地区"
                       width="100"
                       align="center"></el-table-column>
      <el-table-column label="个性签名"
                       align="center"
                       prop="introduction">
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
    <!-- 添加歌手 -->
    <el-dialog title="添加新用户"
               :visible.sync="centerDialogVisible"
               width="400px"
               center>
      <el-form :model="registerForm"
               ref="registerForm"
               label-width="80px"
               :rules="rules">
        <el-form-item prop="username"
                      label="用户名"
                      size="mini">
          <el-input v-model="registerForm.username"
                    placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password"
                      label="密码"
                      size="mini">
          <el-input type="password"
                    v-model="registerForm.password"
                    placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="性别"
                      size="mini">
          <input type="radio"
                 name="sex"
                 value="0"
                 v-model="registerForm.sex">&nbsp;女&nbsp;&nbsp;
          <input type="radio"
                 name="sex"
                 value="1"
                 v-model="registerForm.sex">&nbsp;男
        </el-form-item>
        <el-form-item prop="phoneNum"
                      label="手机号"
                      size="mini">
          <el-input v-model="registerForm.phoneNum"
                    placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email"
                      label="电子邮箱"
                      size="mini">
          <el-input v-model="registerForm.email"
                    placeholder="电子邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="birth"
                      label="生日"
                      size="mini">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="registerForm.birth"
                          style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction"
                      label="签名"
                      size="mini">
          <el-input v-model="registerForm.introduction"
                    placeholder="签名"></el-input>
        </el-form-item>
        <el-form-item prop="location"
                      label="地区"
                      size="mini">
          <el-input v-model="registerForm.location"
                    placeholder="地区"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini"
                   @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini"
                   @click="addConsumer">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改歌手 -->
    <el-dialog title="修改歌手"
               :visible.sync="editVisible"
               width="400px"
               center>
      <el-form :model="form"
               ref="form"
               label-width="80px">
        <el-form-item prop="username"
                      label="歌手名"
                      size="mini">
          <el-input v-model="form.username"
                    placeholder="歌手名"></el-input>
        </el-form-item>
        <el-form-item label="性别"
                      size="mini">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">不明</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日"
                      size="mini">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="form.birth"
                          style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="loaction"
                      label="地区"
                      size="mini">
          <el-input v-model="form.location"
                    placeholder="地区"></el-input>
        </el-form-item>
        <el-form-item prop="introduction"
                      label="简介"
                      size="mini">
          <el-input type="textarea"
                    v-model="form.introduction"
                    placeholder="简介"></el-input>
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
    <el-dialog title="删除歌手"
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
import { mixin } from '../mixins/index'
import { getAllConsumer, setConsumer, updateConsumer, delConsumer } from '../api/index'
export default {
  mixins: [mixin],
  data () {
    return {
      centerDialogVisible: false,//添加弹窗
      editVisible: false,//编辑弹窗
      delVisible: false,//删除弹窗
      // 添加框
      registerForm: {
        username: '',
        password: '',
        sex: '',
        phoneNum: '',
        email: '',
        birth: '',
        introduction: '',
        location: ''
      },
      form: {
        id: '',
        username: '',
        password: '',
        sex: '',
        phoneNum: '',
        email: '',
        birth: '',
        introduction: '',
        location: ''
      },
      select_word: '',//搜索用户关键词
      // 表格里存储全部数据
      tableData: [],
      // 当前页的数据
      tempData: [],
      // 每页存储的记录数
      pageSize: 5,
      // 当前页
      currentPage: 1,
      idx: -1,
      multipleSelection: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的电子邮箱地址', trigger: ['blur', 'change'] }
        ],
        introduction: [
          { required: true, message: '请输入签名', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入地区', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  // 计算属性
  computed: {
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  watch: {
    select_word: function () {
      if (this.select_word == '') {
        this.tableData = this.tempData
      } else {
        this.tableData = []
        for (let item of this.tempData) {
          if (item.username.includes(this.select_word)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  methods: {
    // 切换页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 获取全部用户
    getData () {
      this.tempData = []
      this.tableData = []
      getAllConsumer()
        .then(res => {
          // console.log('getAllConsumer' + res);
          this.tempData = res
          this.tableData = res
          this.currentPage = 1
        })
    },

    // 添加新用户
    addConsumer () {
      // 获取添加框的实例
      this.$refs['registerForm'].validate(valid => {
        // valid表示验证是否通过 输出一个布尔值
        if (valid) {
          // 日期转换成年月日的形式
          let d = this.registerForm.birth;
          let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
          let params = new URLSearchParams()
          params.append('username', this.registerForm.username);
          params.append('password', this.registerForm.password);
          params.append('sex', this.registerForm.sex)
          params.append('phoneNum', this.registerForm.phoneNum)
          params.append('email', this.registerForm.email)
          params.append('birth', datetime)
          params.append('introduction', this.registerForm.introduction)
          params.append('location', this.registerForm.location)
          params.append('avator', '/img/user.jpg')
          setConsumer(params)
            .then(res => {
              if (res.code == 1) {
                this.getData()
                this.notify('添加成功', 'success')
              } else {
                this.notify('添加失败', 'error')
              }
            })
            .catch(err => {
              console.log('添加用户异常' + err);
            })
          this.centerDialogVisible = false
          this.currentPage = Math.ceil(++this.tableData.length / this.pageSize)
          // handleCurrentChange(this.currentPage)
        }
      })
    },
    //修改用户
    handleEdit (row) {
      this.editVisible = true
      this.form = {
        id: row.id,
        username: row.username,
        password: row.password,
        sex: row.sex,
        phoneNum: row.phoneNum,
        email: row.email,
        birth: row.birth,
        introduction: row.introduction,
        location: row.location
      }
    },
    // 保存修改用户的结果
    editSave () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 转换成Date格式
          let d = new Date(this.form.birth)
          let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          let params = new URLSearchParams()
          params.append('id', this.form.id)
          params.append('username', this.form.username)
          params.append('password', this.form.password)
          params.append('sex', this.form.sex)
          params.append('phoneNum', this.form.phoneNum)
          params.append('email', this.form.email)
          params.append('birth', this.form.birth)
          params.append('introduction', this.form.introduction)
          params.append('location', this.form.location)
          updateConsumer(params)
            .then(res => {
              if (res.code == 1) {
                // 重新获取数据
                this.getData()
                this.notify('修改成功', 'success')
              } else {
                this.notify('修改失败', 'error')
              }
            })
            .catch(err => {
              console.log('修改用户异常' + err);
            })
          this.editVisible = false
        }
      })
    },
    // 删除一个用户记录
    deleteRow () {
      delConsumer(this.idx)
        .then(res => {
          if (res) {
            this.getData()
            this.notify('删除成功', 'success')
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(err => {
          this.$message.error('删除用户异常')
          console.log(err);
        })
      this.delVisible = false
    },
    // 更新头像
    uploadUrl (id) {
      return `${this.$store.state.HOST}/consumer/updateConsumerPic?id=${id}`
    }
  }
}
</script>
<style>
.handle-box {
  margin-bottom: 20px;
}
.consumer-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>