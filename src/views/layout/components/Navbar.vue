<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <!-- <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip> -->

      <!-- <lang-select class="international right-menu-item"></lang-select> -->

      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
          <i class="icon iconfont-ali icon-ali-ren"></i>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <!-- <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="changePassWord" style="display:block;">{{$t('navbar.changePassWord')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 修改密码弹框 start -->
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules2" ref="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" :disabled = 'true' autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="原始密码" :label-width="formLabelWidth" prop="primeval">
            <el-input v-model="form.primeval" autocomplete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveInfo('form')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改密码弹框 end -->
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import axios from '@/utils/request'
import { Base64 } from 'js-base64'

export default {
  data() {
    // var checkPassword = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('新密码不能为空'))
    //   }
    // }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入初始密码'))
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.form.primeval) {
        callback(new Error('新密码和原始密码一致! 请重新填写'))
      }
    }
    return {
      form: {
        username: '',
        primeval: '',
        password: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      rules2: {
        primeval: [
          { validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass2, trigger: 'blur' }
        ]
        // password: [
        //   { validator: checkPassword, trigger: 'blur' }
        // ]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'userid',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    // 保存信息
    saveInfo(form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var postData = {
            id: this.userid,
            username: this.form.username,
            primeval: Base64.encode(this.form.primeval),
            password: Base64.encode(this.form.password)
          }
          axios.put('/authority', postData).then((response) => {
            console.log(response.data)
            if (response.data.msg === 'success') {
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功,请重新登录',
                type: 'success'
              })
              setTimeout(() => {
                this.$store.dispatch('FedLogOut').then(() => {
                  location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
              }, 3000)
            } else {
              this.$message({
                message: response.data.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    changePassWord() {
      this.dialogFormVisible = true
      this.form.username = this.name
      this.form.primeval = ''
      this.form.password = ''
      // var url = '/user/id/'+ this.userid
      // axios.get(url).then((response) => {
      //   this.form.username = response.data.data.name
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .screenfull-svg[data-v-416a9041] {
      display: inline-block;
      cursor: pointer;
      fill: #5a5e66;
      width: 20px;
      height: 20px;
      vertical-align: 0px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
