<template>
  <div class="login-wrap">
    <!-- 标题 -->
    <div class="ms-title">music 后台管理系统</div>
    <!-- 登录框  status-icon输入框添加了表示校验结果的反馈图标-->
    <div class="ms-login">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               status-icon>
        <el-form-item prop="username">
          <el-input placeholder="用户名"
                    v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    placeholder="密码"
                    v-model="ruleForm.password"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary"
                     @click="submitFrom">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mixin } from '../mixins/index'
import { getLoginStatus } from '../api/index'
export default {
  // 混入===工具
  mixins: [mixin],
  data: function () {
    return {
      ruleForm: {
        username: 'admin',
        password: '1'
      },
      rules: {
        username: [
          { require: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { require: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },

  methods: {
    submitFrom () {
      let params = new URLSearchParams();
      params.append("name", this.ruleForm.username);
      params.append("password", this.ruleForm.password);
      getLoginStatus(params)
        .then((res) => {
          // 登录成功跳转到首页
          if (res.code == 1) {
            this.$router.push('Home');
            this.notify("登录成功", "success");
          } else {
            this.notify("账号或密码错误", "error");
          }
        })
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../assets/img/background.jpg");
  /* 背景图片不会随着页面滚动 */
  background-attachment: fixed;
  background-position: center;
  /* 保持图片的纵横比并缩放成完全覆盖背景定位区域的最小大小 */
  background-size: cover;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -140px;
  margin-top: -150px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
}
</style>