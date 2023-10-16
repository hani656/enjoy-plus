Page({
  data:{
    passport: {}
  },
  onLoad({ id, encryptedData }){
    // console.log(id)
    this.getPassport(id)
    this.getPassportShare(encryptedData)
  },

  async getPassportShare(encryptedData){
    // 检测是否存在 id
    if(!encryptedData) return
    // 调用接口
    const {code, data: passport} = await wx.http.get('/visitor/share/' + encryptedData)
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({passport})
  },

  // 获取访客详情（通行证）
  async getPassport(id){
    // 检测是否存在 id
    if(!id) return
    // 调用接口
    const {code, data: passport} = await wx.http.get('/visitor/' + id)
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({passport})
  },

  onShareAppMessage() {
    // 获取加密数据
    const {encryptedData} = this.data.passport
    return {
      title: '查看通行证',
      path: '/visitor_pkg/pages/passport/index?encryptedData=' + encryptedData,
      imageUrl: 'https://enjoy-plus.oss-cn-beijing.aliyuncs.com/images/share_poster.png',
    }
  },
  // 保存图片
  async saveQRCode(){
    try{
      // 读取图片信息
      const { path } = await wx.getImageInfo({
        src: this.data.passport.url,
      })
      // 保存图片
      wx.saveImageToPhotosAlbum({filePath: path})
    }catch(err){
      wx.utils.toast('保存图片失败，稍后重试！')
    }
  },
})
