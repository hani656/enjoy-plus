Page({
  data: {
    houseList: [],
    isEmpty: false,
    dialogVisible: false,
  },

  onShow(){
    // 获取用户房屋列表
    this.getHouseList()
  },

  // 用户房屋列表
  async getHouseList(){
    // 调用接口
    const {code, data: houseList} = await wx.http.get('/room')
    // 检测接口是否调用成功
    if(code  !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({
      houseList,
      isEmpty: houseList.length === 0
    })
  },

  // 删除房屋
 async deleteHouse(){

    // 检查id是否存在
    if(!this.cellId) return wx.utils.toast('参数有误！')

    // 调用接口
    const {code} = await wx.http.delete('/room/' + this.cellId)
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 在 AppData 中将删除的房屋从数组中删除
    this.data.houseList.splice(this.cellIndex, 1)
    // 渲染数据
    this.setData({
      houseList: this.data.houseList,
      isEmpty: this.data.houseList.length === 0
    })
  },

  swipeClose(ev) {
    const { position, instance } = ev.detail

    if (position === 'right') {
      // 显示 Dialog 对话框
      this.setData({
        dialogVisible: true,
      })

      // 记录房屋的 id 和索引值，在调用接口的时候用
      this.cellId = ev.mark.id
      this.cellIndex = ev.mark.index

      // swiper-cell 滑块关闭
      instance.close()
    }
  },

  dialogClose(ev){
    // 当用户点了确认按钮时调用方法删除数据
    if(ev.detail === 'confirm') this.deleteHouse()
  },

  goDetail(ev) {
    wx.navigateTo({
      url: '/house_pkg/pages/detail/index?id=' + ev.mark.id,
    })
  },

  addHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/locate/index',
    })
  },
})
