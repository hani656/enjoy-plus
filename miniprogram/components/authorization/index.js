// components/authorization/index.js
Component({

  /**
   * 组件的初始数据
   */
  data: {
    isLogin: false
  },

  lifetimes:{
    attached(){
      // 获取登录状态
      const isLogin = !!getApp().token
      // 变更登录状态
      this.setData({isLogin})

      // 获取页面栈
      const pageStack = getCurrentPages()
      // 获取页面路径
      const currentPage = pageStack.pop()

      console.log(currentPage)

      // 未登录情况下跳转到登录页面
      if(!isLogin){
        // 使用空白函数覆盖原生的生命周期 onLoad onShow
        currentPage.onLoad = () => {}
        currentPage.onShow = () => {}

        // 判断 redirectURL 是不是 tabBar 页面
        const isTabBarPage = wx.utils.isTabBarPage(currentPage.route)
        // 如果是则使用 wx.switchTab
        const routeType = isTabBarPage ? 'switchTab' : 'redirectTo'

        wx.redirectTo({
          url: `/pages/login/index?redirectURL=/${currentPage.route}&routeType=${routeType}`,
        })
      }
    }
  },

})