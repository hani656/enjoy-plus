// map.js
// 导入位置服务SDK
import qqMap from '../../../utils/qqmap'

Page({
  data: {
    repairDetail: {},
    latitude: 32.89664,
    longitude: 115.79076,
    markers: [
      {
        id: 1,
        latitude: 32.88327,
        longitude: 115.80672,
        width: 24,
        height: 30,
      },
      {
        id: 2,
        latitude: 32.898664000000004,
        longitude: 115.80979299999998,
        iconPath: '/static/images/marker.png',
        width: 40,
        height: 40,
      },
  ],
  },
  onLoad({id}){
    // console.log(id)
    // 获取报修详情数据
    this.getRepairDetail(id)
    // 获取路线坐标
    this.getPolyline()
  },
  // 报修详情接口
  async getRepairDetail(id) {
    if(!id) return wx.utils.toast('参数有误！')
    // 调用接口
    const {code, data: repairDetail} = await wx.http.get('/repair/' + id)
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({repairDetail})
  },
  // 调用位置服务
  getPolyline(){
    qqMap.direction({
      mode: 'bicycling',
      from: '32.899666,115.808694',
      to: '32.88327,115.80672',
      success: ({ result }) => {
        // console.log(result)
        const coors = result.routes[0].polyline;
        const points = []
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        const kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }

        // 获取经纬度
        for (let i = 0; i < coors.length; i += 2) {
          points.push({ latitude: coors[i], longitude: coors[i + 1] })
        }

        // console.log(points)
        // 渲染数据
      this.setData({
        latitude: points[30].latitude,
        longitude: points[30].longitude,
        polyline: [
          {
            points,
            color: '#5591af',
            width: 4,
          }
        ]
      })
      },
      fail:(res)=>{
        console.log(res)
      },
    })
  },
  // 修改报修信息
  editRepair(ev){
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index?id=' + ev.mark.id,
    })
  },
  // 取消报修
  async cancelRepair(ev){
    // 调用接口
    const {code} = await wx.http.put('/cancel/repaire/' + ev.mark.id)
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 跳转到报修列表页面
    wx.navigateTo({
      url: '/repair_pkg/pages/list/index'
    })
  }
})
