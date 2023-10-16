
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

    dataFormat(timestamp){
      // 创建时间对象
      const date = new Date(timestamp)
      // 获取年月日，以年月日的形式展示数据
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      // 日期格式为年-月-日
      return [year, month, day].map(item => item >= 10 ? item : '0' + item).join('-')
      
    }
}

// 正常的模块导出
export default utils
// 也可以放在全局对象 wx 上
wx.utils = utils