// 导入 wechat-validate 模块
import wxValidate from 'wechat-validate'
// 获取应用实例
const app = getApp()

Page({
  behaviors: [wxValidate],
  data: {
    countDownVisible: false,
    mobile: '',
    code: ''
  },

  onLoad({redirectURL, routeType}){
    // 获取跳转路径
    this.redirectURL = redirectURL
    this.routeType = routeType
    // console.log(routeType)
  },

  // wxValidate 提供了属性，用来定义验证规则
  rules: {
    mobile: [
      {required: true, message: '请填写手机号码！'},
      {pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号码！'}
    ],
    code: [
      {required: true, message: '请填写验证码！'},
      {pattern: /^\d{6}$/, message: '请填写正确的验证码！'}
    ]
  },
// 监听时间的变化
  countDownChange(ev) {
    this.setData({
      timeData: ev.detail,
      countDownVisible: ev.detail.minutes === 1 || ev.detail.seconds > 0,
    })
    // 00:01:00
  },
  // 获取短信验证码
  async getSMSCode() {
    // 获取验证结果
   const {valid, message} = this.validate('mobile')
    if(!valid) return wx.utils.toast(message)
    // 显示倒计时
    this.setData({countDownVisible: true})

    // 发送手机号获取验证码
    const {code, data} = await wx.http.get('/code',{mobile: this.data.mobile})
    // 检测验证码是否发送成功
    if(code !== 10000) return wx.utils.toast('发送失败，稍后重试！')
  },
// 提交表单数据，完成登录/注册的功能
 async submitForm(){
    // 验证数据是否合法
    if(!this.validate()) return
    // 调用登录接口
   const {code, data} = await wx.http.post('/login', {
      mobile: this.data.mobile,
      code: this.data.code
    })
    // 检验登录是否成功
    if(code !== 10000) return wx.utils.toast('登录失败，稍后重试！')
    
    // 存储 token 数据
    app.setToken('token',data.token)
    app.setToken('refreshToken',data.refreshToken)


    // 跳转到新的页面
    wx[this.routeType]({ url: this.redirectURL })
  }
})