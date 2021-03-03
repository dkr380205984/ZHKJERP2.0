<template>
  <div id="login">
    <img class="rightTop"
      :src="require('../assets/image/login/圆圈.png')" />
    <img class="leftBottom"
      :src="require('../assets/image/login/圆圈.png')" />
    <img class="atCenter"
      :src="require('../assets/image/login/线条.png')" />
    <div class="main">
      <div class="title">
        <img :src="require('../assets/image/login/标题.png')" />
      </div>
      <div class="btnList">
        <div class="btn active">登陆</div>
        <div class="btn"
          @click="noOpr">注册</div>
      </div>
      <div class="userName">
        <zh-input placeholder="请输入用户名"
          v-model="telephone"
          @keydown.enter="goLogin">
          <template slot="prepend">
            <i class="icons el-icon-user"></i>
          </template>
        </zh-input>
      </div>
      <div class="password">
        <zh-input type="password"
          placeholder="请输入密码"
          v-model="password"
          @keydown.enter="goLogin">
          <template slot="prepend">
            <i class="icons el-icon-lock"></i>
          </template>
        </zh-input>
      </div>
      <div class="psdOp">
        <el-checkbox v-model="remPsd">记住密码</el-checkbox>
        <div class="fogotPsd"
          @click="forgetPsd">忘记密码？</div>
      </div>
      <div class="subBtn"
        @click="goLogin">登录</div>
    </div>
    <!-- 备案信息 -->
    <div class="bottomInfo">
      <div class="line">©zwyknit.com版权所有 数据应用服务：浙ICP备 <a target="_blank"
          href="http://www.miit.gov.cn/">19041626号</a></div>
      <!-- <div class="line">浙公网安备 33010602009975号</div> -->
    </div>
    <!-- 忘记密码弹窗 -->
    <div class="popup"
      v-if="showPopup">
      <div class="popupMain">
        <div class="popupTitle">
          忘记密码
          <span class="el-icon-close"
            @click="showPopup = false"></span>
        </div>
        <div class="popupContent">
          <div class="row">
            <span class="label">手机号：</span>
            <span class="info">
              <zh-input placeholder='请输入手机号'
                v-model="forgetEdit.tel"
                type='mobile'
                class="getVerification">
                <template slot="append">
                  <span class="getVerificationBtn"
                    @click="getVerificationCode(60)">{{waitTime ? `${waitTime}s后重新获取` : '获取验证码'}}</span>
                </template>
              </zh-input>
            </span>
          </div>
          <div class="row">
            <span class="label">手机验证码：</span>
            <span class="info">
              <el-input placeholder='请输入手机验证码'
                v-model="forgetEdit.tel_VC"></el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">新密码：</span>
            <span class="info">
              <el-input placeholder='请输入新密码'
                type="password"
                v-model="forgetEdit.first_psd"></el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">确认密码：</span>
            <span class="info">
              <el-input placeholder='请再次输入密码验证'
                type="password"
                v-model="forgetEdit.second_psd"></el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">安全验证：</span>
            <span class="info">
              <el-input placeholder='请输入左侧的4位安全验证码'
                class="safetyVC"
                v-model="forgetEdit.safety_VC">
                <template slot="prepend">
                  <img :src="verificationCode.canvas"
                    @click="verificationCode.updatedCode()"
                    style="height:60px"
                    title="点击换一个"
                    alt="4位安全验证码">
                </template>
              </el-input>
            </span>
          </div>
        </div>
        <div class="opr">
          <span class="oprBtn gray"
            @click="showPopup = false">取消</span>
          <span class="oprBtn blue"
            @click="submitPsd">提交</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getAuthorization, forgetPasd } from '@/assets/js/api.js'
export default {
  name: 'home',
  data () {
    return {
      telephone: window.localStorage.getItem('zhUsername'),
      password: window.localStorage.getItem('zhPassword'),
      remPsd: true,
      verificationCode: {
        canvas: ''
      },
      forgetEdit: {
        tel: '',
        tel_VC: '',
        first_psd: '',
        second_psd: '',
        safety_VC: ''
      },
      waitTime: 0,
      showPopup: false
    }
  },
  methods: {
    noOpr () {
      this.$message.warning('暂无注册功能，请联系管理员添加账号')
    },
    // 登录
    goLogin () {
      let _this = this
      login({
        user_name: _this.telephone,
        password: _this.password
      }).then((res) => {
        if (res.data.code === 200) {
          window.sessionStorage.setItem('token', res.data.data.access_token)
          window.sessionStorage.setItem('token_type', res.data.data.token_type)
          getAuthorization.get().then((res) => {
            this.$message.success({
              message: '登录成功',
              duration: 1000
            })
            const moduleId = (res.data.data.module_id ? JSON.parse(res.data.data.module_id) : []).concat(res.data.data.module_id_detail ? JSON.parse(res.data.data.module_id_detail) : [])
            window.sessionStorage.setItem('user_name', res.data.data.user_name)
            window.sessionStorage.setItem('company_id', res.data.data.company_id)
            window.sessionStorage.setItem('company_name', res.data.data.company_name)
            window.sessionStorage.setItem('full_name', res.data.data.full_name)
            window.sessionStorage.setItem('module_id', JSON.stringify(moduleId))
            window.sessionStorage.setItem('logo', res.data.data.company_logo)
            window.sessionStorage.setItem('has_check', res.data.data.has_check)
            window.sessionStorage.setItem('user_id', res.data.data.user_id)
            window.sessionStorage.setItem('group_name', res.data.data.group_name)
            window.sessionStorage.setItem('telephone', res.data.data.telephone)
            window.localStorage.setItem('zhUsername', _this.telephone)
            if (_this.remPsd) {
              window.localStorage.setItem('zhPassword', _this.password)
            } else {
              window.localStorage.setItem('zhPassword', '')
            }
            if (_this.$route.query.nextUrl) {
              _this.$router.push(_this.$route.query.nextUrl)
            } else {
              _this.$router.push('/homePage/homePage')
            }
          })
        } else {
          _this.password = ''
        }
      })
    },
    // 注册
    goRegister () {
      this.$message.warning({
        message: '注册功能暂不开放'
      })
    },
    // 忘记密码
    forgetPsd () {
      if (!this.verificationCode.canvas) {
        const { VerificationCode } = require('@/assets/js/common.js')
        this.verificationCode = new VerificationCode({ W: 200, H: 100 })
      }
      this.forgetEdit = {
        tel: '',
        tel_VC: '',
        first_psd: '',
        second_psd: '',
        safety_VC: ''
      }
      this.verificationCode.updatedCode()
      this.showPopup = true
    },
    // 获取验证码
    getVerificationCode (time = 60) {
      if (!(/^1[3456789]\d{9}$/.test(this.forgetEdit.tel))) {
        this.$message.warning('请输入正确的手机号')
        return
      }
      if (!this.verificationCode.checkCode(this.forgetEdit.safety_VC)) {
        this.$message.warning('请先输入安全验证码')
        this.verificationCode.updatedCode()
        this.forgetEdit.safety_VC = ''
        return
      }
      if (!this.waitTime) {
        this.waitTime = time
        forgetPasd.sendVerificationCode({
          telephone: this.forgetEdit.tel
        }).then(res => {
          if (res.data.status === false) return
          this.$message.success(`已向手机号“${this.forgetEdit.tel}”发送验证码`)
          const timer = setInterval(() => {
            --this.waitTime
            if (this.waitTime === 0) {
              clearInterval(timer)
            }
          }, 1000)
        })
      }
    },
    submitPsd () {
      if (!this.forgetEdit.tel) {
        this.$message.warning('请输入手机号')
        return
      }
      if (!this.forgetEdit.tel_VC) {
        this.$message.warning('请输入手机验证码')
        return
      }
      if (!this.forgetEdit.first_psd) {
        this.$message.warning('请输入新密码')
        return
      }
      if (this.forgetEdit.first_psd !== this.forgetEdit.second_psd) {
        this.$message.warning('两次密码不一致，请重新输入')
        this.forgetEdit.first_psd = ''
        this.forgetEdit.second_psd = ''
        return
      }
      if (!this.verificationCode.checkCode(this.forgetEdit.safety_VC)) {
        this.$message.warning('安全验证码不正确')
        this.verificationCode.updatedCode()
        this.forgetEdit.safety_VC = ''
        return
      }
      forgetPasd.updated({
        telephone: this.forgetEdit.tel,
        sms_code: this.forgetEdit.tel_VC,
        new_pass: this.forgetEdit.first_psd
      }).then(res => {
        if (res.data.status === false) return
        this.showPopup = false
        this.$message.success('修改密码成功，请用新密码重新登录')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/loginNew.less";
</style>
<style lang="less">
#login {
  .main {
    .zhInputBox {
      height: 40px !important;
    }
    .zhInput {
      padding-left: 36px;
      border-radius: 4px !important;
      color: rgba(0, 0, 0, 0.65);
    }
    .zhInputPrepend {
      position: absolute;
      background: transparent;
      border: 0;
      line-height: 40px;
    }
  }
  .getVerification {
    .zhInputAppend {
      padding: 0;
      .getVerificationBtn {
        display: block;
        padding: 0 12px;
        cursor: pointer;
        &.active {
          cursor: not-allowed;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }
  .safetyVC {
    .el-input-group__prepend {
      padding: 0;
      overflow: hidden;
      font-size: 0;
    }
  }
}
</style>
