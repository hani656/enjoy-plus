// 导入封装好的工具方法库

// import utils from "../../utils/utils"


Page({
  data:{
    notices: []
  },
 onLoad(){
    // 模块方式调用
    // utils.toast('页面加载完成了')
    // 全局对象方式调用
    // wx.utils.toast('页面加载完成了')

    wx.utils.isTabBarPage()

    // 获取公告列表数据
   this.getNotices()
  },
  async getNotices(){
    // 请求接口数据 （全局方式调用）
    const {code,data:notices} = await wx.http.get('/announcement')
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({notices})
  }
})
