// [\u4e00-\u9fa5] 中文验证规则

// 导入表单校验插件
import wxValidate from 'wechat-validate'

Page({
  behaviors: [wxValidate],
  data: {
    point: '', 
    building: '', 
    room: '',
    name: '',
    gender: '1',
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },
  rules:{
    name:[
      {required: true, message: '业主姓名不能为空！'},
      {pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '业主姓名只能为中文！'}
    ],
    mobile:[
      {required: true, message: '业主手机号不能为空！'},
      {pattern: /^1[3-8]\d{9}$/, message: '请填写正确的手机号码！'}
    ],
    idcardFrontUrl:[
      {required: true, message: '请上传身份证国徽面！'}
    ],
    idcardBackUrl:[
      {required: true, message: '请上传身份证照片面！'}
    ],
  },
  onLoad({point, building, room}){
    // 渲染数据
    this.setData({point, building, room})
  },
  async submitForm() {
    // 验证数据
    if(!this.validate()) return
    // 获取全部数据(剔除可能多余参数)
    const {__webviewId__, ...data} = this.data
    // 调用接口
    const {code} = await wx.http.post('/room', data)
    // 检测接口是否调用成功
    if(code !== 10000) return wx.utils.toast('提交数据失败！')

    // 返回房屋列表页面
    wx.navigateBack({
      delta: 4,
    })
  },

  // 上传身份证照片
  async uploadPictrue(ev){
    // 区分用户上传的是正面还是反面
    console.log(ev.mark.type)
    const type = ev.mark.type

    try{
      // 打开相册或拍照
      const media = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed']
      })

      // 调用API 上传图片
      wx.uploadFile({
        url: wx.http.baseURL + '/upload',
        filePath: media.tempFiles[0].tempFilePath,
        name: 'file',
        header: {
          Authorization: 'Bearer ' + getApp().token
        },
        success: (result)=>{
          // 处理返回的 json 数据
          const data = JSON.parse(result.data)
          // 判断接口是否调用成功
          if(data.code !== 10000) return wx.utils.toast('上传图片失败！')
          // 渲染数据
        this.setData({
          [type]: data.data.url
        })
        },
      })
    }catch(err){
      // 获取图片失败
      console.log(err)
    }
  },
  removePicture(ev) {
    // 移除图片的类型（身份证正面或反面）
    const type = ev.mark?.type
    this.setData({ [type]: '' })
  },
  genderChange(ev){
    // console.log(ev.detail)
    // 更新性别信息
    this.setData({gender: ev.detail})
  },

  mobileChange(ev){
    // console.log(ev.detail)
    // 更新手机号码
    this.setData({mobile: ev.detail})
  },
})
