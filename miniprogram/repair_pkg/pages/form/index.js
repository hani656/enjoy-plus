
// 导入表单校验插件
import wxValidate from 'wechat-validate'

Page({
  behaviors: [wxValidate],
  data: {
    currentDate: Date.now(),
    houseLayerVisible: false,
    repairLayerVisible: false,
    dateLayerVisible: false,
    houseList: [],
    repairItem: [],
    mobile: '',
    description: '',
    appointment: '',
    houseId: '',
    houseInfo: '',
    repairItemId: '',
    repairItemName: '',
    attachment: [],
  },
  rules: {
    houseId:[
      {required: true, message: '请选择报修房屋！'}
    ],
    repairItemName: [
      {required: true, message: '请选择维修项目！'}
    ],
    mobile: [
      {required: true, message: '请填写手机号！'},
      {pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号！'}
    ],
    appointment: [
      {required: true, message: '请选择预约日期！'}
    ],
    description: [
      {required: true, message: '请填写问题描述！'}
    ]
  },

  onLoad({ id }){
    // 获取可报修的房屋列表
    this.getHouseList()
    // 获取维修项目
    this.getRepairItem()
    
    // console.log(id)
    // 如果有id表明是修改操作
    if(id) this.getRepairDetail(id)
  },

  // 获取待修改的报修信息
  async getRepairDetail(id){
    // 调用接口
    const {code, data: repairDetail} = await wx.http.get('/repair/' + id)
    // 检测是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({...repairDetail})
  },

  // 获取房屋列表（必须是通过审核的房屋）
  async getHouseList(){
    // 调用接口
    const {code, data: houseList} = await wx.http.get('/house')
    // 检测接口是否调用成功
    if(code !== 10000) wx.utils.toast()
    // 渲染数据
  this.setData({houseList}) 
  }, 

  // 获取用户选择的房屋
  selectHouseInfo(ev){
    // console.log(ev)
    // 数据渲染
    this.setData({
      houseId: ev.detail.id,
      houseInfo: ev.detail.name
    })
  },

  // 获取用户选择的维修项目
  selectRepairItemInfo(ev){
    // console.log(ev)
    // 数据渲染
    this.setData({
      repairItemId: ev.detail.id,
      repairItemName: ev.detail.name
    })
  },

  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
  },
  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },

  // 获取维修项目
  async getRepairItem(){
    // 调用接口
    const {code, data: repairItem} = await wx.http.get('/repairItem')
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({repairItem})
  },

  openRepairLayer() {
    this.setData({ repairLayerVisible: true })
  },
  closeRepairLayer() {
    this.setData({repairLayerVisible: false,})
  },

  //获取用户选择的预约日期
  selectDateInfo(ev){
    // console.log(ev)
    // 渲染数据
    this.setData({ 
      appointment: wx.utils.dataFormat(ev.detail),
      dateLayerVisible: false 
    })
  },

  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },
  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },

  // 上传文件
  uploadPicture(ev){
    // console.log(ev)
    // 上传文件的信息
    const {file} = ev.detail
    // 调用 API 实现文件上传
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: file.url,
      name: 'file',
      header: {
        Authorization: 'Bearer ' + getApp().token
      },
      success: (result) => {
        // console.log(result)
        // 返回数据 json 数据
        const data = JSON.parse(result.data)
        // 检测接口是否调用成功
        if(data.code !== 10000) return wx.utils.toast('文件上传失败！')
        // 先获取原来已经上传的图片
        const {attachment} = this.data
        // 追加新的上传的图片
        attachment.push(data.data)
        // 渲染数据
        this.setData({attachment})

      }
    })
  },

  async submitForm() {
    // 验证表单数据
    if(!this.validate()) return
    // 提取接口需要的数据
    const {id, houseId, repairItemId, mobile, appointment, description,attachment} = this.data
    // 调用接口
   const {code} = await wx.http.post('/repair', {
      id,
      houseId,
      repairItemId,
      mobile,
      appointment,
      description,
      attachment,
    })
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast('在线报修失败！')
    // 跳转到报修列表页面
    wx.redirectTo({
      url: '/repair_pkg/pages/list/index'
    })
  },
})
