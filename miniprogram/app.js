// app.js
// 执行 utils.js
import './utils/utils.js'
// 执行 http.jss
import './utils/http.js'

App({
  globalData: {},
  onLaunch(){
    // 读取 token
    this.getToken()
  },
  getToken(){
    // 读取本地的token
   this.token =  wx.getStorageSync('token')
   this.refreshToken = wx.getStorageSync('refreshToken')
  },
  setToken(key, token){
    // 存储到应用实例当中
    this[key] = token
    // 存储到本地存储当中
    wx.setStorageSync(key, token)
  }
})
