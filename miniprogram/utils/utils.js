
const utils = {
  /**
   * 消息反馈（轻提示）
   * @param {string} title 文字提示内容 
   */
  toast(title="数据加载失败..."){
    wx.showToast({
      title,
      mask: true,
      icon: 'none'
    })
  },
    /**
   * 判断页面是否为 tabBar 页面
   * @param {string} path 页面路径
   */
    isTabBarPage(path = '') {
      // 获取到 tabbar 页面信息
      const tabBarList = __wxConfig.tabBar.list
  
      // 获取 tabBar 页面的路径
      const tabBarPages = tabBarList.map(({ pagePath }) => {
        return pagePath.split('.')[0]
      })
  
      // 是否为 tabBar 页面
      return tabBarPages.includes(path)
    },
}

// 正常的模块导出
export default utils
// 也可以放在全局对象 wx 上
wx.utils = utils