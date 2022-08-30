export const mixin = {
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    // 弹出删除窗口
    handleDelete (id) {
      this.idx = id;
      this.delVisible = true;
    },
    // 批量删除
    delAll () {
      for (let item of this.mutipleSelection) {
        this.handleDelete(item.id);
        this.deleteRow();
      }
      // 将保存选择的数组清空
      this.mutipleSelection = [];
      // this.delVisible = false;
      location.reload()
    },
    // 根据相对地址获取绝对地址
    getUrl (url) {
      return `${this.$store.state.HOST}/${url}`
    },
    // 上传图片之前校验
    beforeAvatorUpload (file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
      if (!isJPG) {
        this.$message.error('上传的图片头像只能是jpg或者png格式');
        return false;
      }
      const isLt2M = (file.size / 1024 / 1024) < 2;
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过2MB');
        return false
      }
      return true
    },
    // 上传图片成功
    handleAvatorSuccess (res) {
      let _this = this;
      if (res.code == 1) {
        _this.getData();
        _this.$notify({
          title: '上传成功',
          type: 'success'
        })
      } else {
        _this.$notify({
          title: '上传失败',
          type: 'error'
        })
      }
    },
    // 把已经选择的项赋值给multipleSelection
    handleSelectionChange (val) {
      this.mutipleSelection = val
    },
    // 获取性别中文
    changeSex (value) {
      if (value == 0) {
        return '女';
      }
      if (value == 1) {
        return '男';
      }
      if (value == 2) {
        return '组合';
      }
      if (value == 3) {
        return '不明';
      }
      return value;
    },
    // 获取生日
    attachBirth (val) {
      return String(val).substr(0, 10)
    },
    // 弹出删除窗口
    handleDelete (id) {
      this.idx = id;
      this.delVisible = true;
    }

  },

}