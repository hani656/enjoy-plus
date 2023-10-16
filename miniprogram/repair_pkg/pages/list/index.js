Page({
  data:{
    repairList: [],
    isEmpty: false,
  },

  onLoad(){
    // 获取报修列表数据
    this.getRepairList()
  },

  // 报修列表接口
  async getRepairList(){
    // 调用接口
    const {code, data: {rows: repairList}} = await wx.http.get('/repair', {current: 1, pageSize: 10})
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({
      repairList,
      isEmpty: repairList.length === 0
    })
  },

  goDetail(ev) {
    wx.navigateTo({
      url: '/repair_pkg/pages/detail/index?id=' + ev.mark.id,
    })
  },
  addRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index',
    })
  },
})
