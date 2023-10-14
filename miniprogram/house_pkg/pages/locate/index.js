// house_pkg/pages/locate/index.ts

// 导入位置服务实例
import QQMap from '../../../utils/qqmap'

Page({
  data: {
    points: [],
    address: '',
  },
  onLoad() {
    // 获取用户经纬度
    this.getLocation()
  },

  // 获取用户的位置
  async getLocation() {
    // 调用小和序 API 获取用户位置
    const { latitude, longitude } = await wx.getLocation()
    // console.log(latitude, longitude)
    this.getPoint(latitude, longitude)
  },

  // 选择新的位置
  async chooseLocation() {
    // 调用小程序 API 获取新的位置
    const { latitude, longitude } = await wx.chooseLocation()

    // 获取新的位置附近的小区
    this.getPoint(latitude, longitude)
  },

  getPoint(latitude, longitude) {
    // 显示loading提示
    wx.showLoading({
      title: '正在加载...',
    })

    // 逆地址解析（根据经纬度来获取地址）
    QQMap.reverseGeocoder({
      location: [latitude, longitude].join(','),
      success: ({ result: { address } }) => {
        // console.log(address)
        // 数据数据
        this.setData({ address })
      },
    })

    QQMap.search({
      keyword: '住宅小区', //搜索关键词
      location: [latitude, longitude].join(','), //设置周边搜索中心点
      page_size: 5,
      success: (result) => {
        // console.log(result)
        // 过滤掉多余的数据
        const points = result.data.map(({ id, title, _distance }) => {
          return { id, title, _distance }
        })

        // console.log(points)
        // 渲染数据
        this.setData({ points })
      },
      fail: (err) => {
        console.log(err.message)
      },
      complete: () => {
        // 隐藏loading提示
        wx.hideLoading()
      },
    })
  },
})
