Page({
  data:{
    houseDetail: {}
  },
  onLoad({id}){
    // 获取房屋详情
    this.getHouseDetail(id)
  },

  // 房屋详情接口
  async getHouseDetail(id){
    if(!id) return wx.utils.toast('参数有误！')
    // 调用接口
    const {code, data: houseDetail} = await wx.http.get('/room/' + id)
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({houseDetail})
  },
  editHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/form/index',
    })
  },
})
