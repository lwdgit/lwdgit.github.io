<template lang="html">
  <div id="login-page" @keyup.enter="login">
    <div class="login-form">
      <div class="input-group">
        <div class="title">Login</div>
        <el-input
          :autofocus="true"
          placeholder="请输入用户名"
          auto-complete="on"
          v-model="username">
        </el-input>
      </div>
      <div class="input-group">
        <el-input
          placeholder="请输入密码"
          type="password"
          auto-complete="on"
          v-model="password">
        </el-input>
      </div>
      <div class="input-group">
        <label>记住我？</label>
        <el-switch
          v-model="rememberMe"
          on-text=""
          off-text="">
        </el-switch>
      </div>
      <div class="input-group">
        <el-button @click.native="login" type="primary" :loading="isBtnLoading">{{btnText}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Octokat from 'octokat';
import { Base64 } from 'js-base64';
export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      isBtnLoading: false
    };
  },
  computed: {
    btnText() {
      if (this.isBtnLoading) return '登录中...';
      return '登录';
    }
  },
  methods: {
    login() {
      if (!this.username) {
        this.$message.error('请填写用户名！！！');
        return;
      }
      if (!this.password) {
        this.$message.error('请填写密码');
        return;
      }
      this.isBtnLoading = true;
      this.tryLogin();
    },
    tryLogin() {
      var octo = new Octokat({
        username: this.username,
        password: this.password
      });
      octo.zen.read((err, val) => {
        if (!err) {
          this.saveCredient();
          this.$router.replace({
            path: '/'
          });
        } else {
          this.$message.error('账号或密码有误！');
        }
        setTimeout(() => {
          this.isBtnLoading = false;
        }, 10000);
      });
    },
    saveCredient() {
      let user = {
        name: this.username,
        password: Base64.encode(this.password)
      };
      if (this.rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  #login-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #efeeee;

    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 500px;
      height: 380px;
      border-radius: 2px;
      background: white;
      box-shadow: 0px 0px 5px #cac6c6;

      .title {
        color: #20a0ff;
        font-weight: bold;
        font-size: 30px;
        text-align: center;
        line-height: 2.0;
        font-family: sans-serif;
      }

      .input-group {
        margin-top: 30px;
        width: 80%;
        button {
          width: 100%;
        }
      }
    }
  }
</style>
