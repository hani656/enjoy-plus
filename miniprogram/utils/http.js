
// 导入 wechat-http 模块
import http from 'wechat-http'

// 配置接口基础路径
http.baseURL = 'https://live-api.itheima.net'

// 配置请求拦截器
http.intercept.request = function(options){
  // 扩展头信息
  const defaultHeader = {}
  // 身份认证
  defaultHeader.Authorization = 'Bearer ' + getApp().token
  // 与默认头信息合并
  options.header = Object.assign({}, defaultHeader, options.header)
  // 处理后的请求参数
  return options
}

// 配置响应拦截器
http.intercept.response = async function({data, config}) {
  // 如果状态码为 401，则表明token已失效
  if(data.code === 401){
    // 获取应用实例
    const app = getApp()

    // 状态为 401 且接口为 /refreshToken 表明 refreshToken 也过期了
    if(config.url.includes('/refreshToken')) {
      // 获取当前页面的路径，保证登录成功后能跳回到原来的页面
      const pageStack = getCurrentPages()
      const currentPage = pageStack.pop()
      const redirectURL = currentPage.route
      // console.log(redirectURL)

      // // 判断 redirectURL 是不是 tabBar 页面
      const isTabBarPage = wx.utils.isTabBarPage(redirectURL)
      // // 如果是则使用 wx.switchTab
      const routeType = isTabBarPage ? 'switchTab' : 'redirectTo'
      
      // 路由跳转（登录页面）
     return wx.redirectTo({
      url: `/pages/login/index?redirectURL=/${redirectURL}&routeType=${routeType}`,
      })
    }

    // 调用接口 获取最新的token
  const res = await http({
      url:'/refreshToken',
      method:'POST',
      header:{
        Authorization: 'Bearer ' + app.refreshToken,
      }
    })
    // 检测接口是否调用成功
    if(res.code !== 10000) return wx.utils.toast('更新token失败!')

    // 重新存储新的 token
    app.setToken('token',  res.data.token)
    app.setToken('refreshToken',  res.data.refreshToken)
    
    // 获取到原来接口请求数据
    // console.log(config)
    config = Object.assign(config, {
      header: {
        // 更新后的 token
        Authorization: 'Bearer ' + res.data.token,
      },
    })
    // 重新发起请求
    return http(config)
  }

  // 只保留data数据，其他的都过滤掉
  return data
}

// 以模块导出
export default http
// 全局对象导出
wx.http = http