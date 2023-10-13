
// 获取应用实例
const app = getApp()

Page({

  onLoad(){
    // 用户未登录时不必请求
    app.token && this.getUserProfile()
  },

  async getUserProfile(){
    // 调用接口获取昵称和头像
   const {code, data: {avatar, nickName}} = await wx.http.get('/userInfo')
    // 检查接口是否正常返回结果
    if(code !== 10000) return wx.utils.toast()
    //  渲染数据
    this.setData({avatar, nickName})

    // 将头像和昵称存到应用实例当中
    app.userProfile = {avatar, nickName}
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
})
