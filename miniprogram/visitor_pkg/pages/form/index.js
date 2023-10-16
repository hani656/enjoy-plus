// [\u4e00-\u9fa5] 中文验证规则

// 导入验证插件
import wxValidate from 'wechat-validate'

Page({
  behaviors: [wxValidate],
  data: {
    name: '',
    gender: 1,
    mobile: '',
    houseId: '',
    visitDate: '',
    dateLayerVisible: false,
    houseLayerVisible: false,
    houseList: [],
    currentDate: Date.now(),
    maxDate: Date.now() + 1000 * 3600 * 24 * 3,
  },
  
  rules: {
    houseId: [{required: true, message: '请选择到访的房屋！'}],
    name: [
      {required: true, message: '访客姓名不能为空！'},
      {pattern: /[\u4e00-\u9fa5]{2,5}/, message: '访客姓名只能为中文！'}
    ],
    mobile: [
      {required: true, message: '访客手机号不能为空！'},
      {pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号！'}
    ],
    visitDate: [{required: true, message: '请选择到访的日期！'}]
  },

  onLoad(){
    // 获取房屋列表
    this.getHouseList()
  },

  // 获取房屋列表
  async getHouseList(){
    const{code, data: houseList} = await wx.http.get('/house')
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({houseList})
  },

  // 获取用户选择的房屋
  selectHouseInfo(ev){
    // console.log(ev)
    // 记录获取数据
    this.setData({
      houseId: ev.detail.id,
      houseInfo: ev.detail.name
    })
  },

  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
  },
  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },
  // 获取用户选择的日期
  selectDateInfo(ev){
    // console.log(ev)
    // 记录获取的时间
    this.setData({
      visitDate: wx.utils.dataFormat(ev.detail),
      dateLayerVisible: false
    })
  },
  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },
  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },

  async goPassport() {
    // 验证表单数据
    if(!this.validate()) return
    // 获取接口需要的数据
    const {name, gender, mobile, houseId, visitDate} = this.data
    // 调用接口
    const {
      code, 
      data: {id},
    } = await wx.http.post('/visitor', {name, gender, mobile, houseId, visitDate})
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast()
    // 跳转到访客详情页面
    wx.reLaunch({
      url: '/visitor_pkg/pages/passport/index?id=' + id
    })
  },
})
