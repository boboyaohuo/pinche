// release.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameValue: null, // 联系人姓名
    contactType: '点击选择', // 联系方式类型展示值
    contactArray: ['手机号','QQ','微信'], // 联系方式下拉选择值
    contactIndex: null, // 联系方式类型索引（值）
    contactValue: null, // 联系方式值
    timeType: '1', // 时效方式
    dateValue: '点击选择', // 日期值
    timeValue: '点击选择', // 时间值
    startValue: null, // 出发省市区
    startAddValue: '点击选择市区', // 出发市区
    startPointValue: null, // 出发地点
    endValue: null, // 目的省市区
    endAddValue: '点击选择市区', // 目的市区
    endPointValue: null, // 目的地点
    pathValue: null, // 途径值
    seatValue: '点击选择', // 剩余座位值
    seatArray: [1,2,3,4,5,6], // 剩余座位下拉选择值
    fareValue: null, // 车费
    remarkValue: null, // 备注值
  },

  // 时效方式
  bindTimeType: function (e) {
    this.setData({
      timeType: e.detail.value
    })
  },

  // 日期选择
  bindDate: function (e) {
    this.setData({
      dateValue: e.detail.value
    })
  },

  // 时间选择
  bindTime: function (e) {
    this.setData({
      timeValue: e.detail.value
    })
  },

  // 出发地选择
  bindStartAddPicker: function (e) {
    this.setData({
      startValue: e.detail.value,
      startAddValue: e.detail.value[1] + e.detail.value[2]
    })
  },

  // 出发地补充
  bindStartPoint: function (e) {
    this.setData({
      startPointValue: e.detail.value
    })
  },

  // 目的地选择
  bindEndAddPicker: function (e) {
    this.setData({
      endValue: e.detail.value,
      endAddValue: e.detail.value[1] + e.detail.value[2]
    })
  },

  // 出发地补充
  bindEndPoint: function (e) {
    this.setData({
      endPointValue: e.detail.value
    })
  },

  // 途径填写
  bindPath: function (e) {
    this.setData({
      pathValue: e.detail.value
    })
  },

  // 联系方式选择
  bindCantactPicker: function (e) {
    this.setData({
      contactIndex: e.detail.value
    })
    this.setData({
      contactType: this.data.contactArray[this.data.contactIndex]
    })
  },

  // 联系方式填写
  bindContact: function (e) {
    this.setData({
      contactValue: e.detail.value
    })
  },

  // 联系人填写
  bindName: function (e) {
    this.setData({
      nameValue: e.detail.value
    })
  },

  // 备注填写
  bindRemark: function (e) {
    this.setData({
      remarkValue: e.detail.value
    })
  },

  // 剩余座位选择
  bindSeatPicker: function (e) {
    this.setData({
      seatValue: this.data.seatArray[e.detail.value]
    })
  },

  // 车费
  bindFare: function (e) {
    this.setData({
      fareValue: e.detail.value
    })
  },

  // 发布方法
  bindRelease: function () {
    if (!this.data.nameValue) {
      wx.showToast({
        title: '请填写联系人',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (!this.data.contactIndex) {
      wx.showToast({
        title: '请选择联系方式',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (!this.data.contactValue) {
      wx.showToast({
        title: '请填写联系号码',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (this.data.timeValue == '点击选择' && this.data.timeType == '2') {
      wx.showToast({
        title: '请选择出发日期',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (this.data.timeValue == '点击选择') {
      wx.showToast({
        title: '请选择出发时间',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (!this.data.startValue) {
      wx.showToast({
        title: '请选择出发市区',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (!this.data.startPointValue) {
      wx.showToast({
        title: '请填写出发地址',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (!this.data.endValue) {
      wx.showToast({
        title: '请选择目的市区',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (!this.data.endPointValue) {
      wx.showToast({
        title: '请填写目的地址',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (this.data.seatValue == '点击选择') {
      wx.showToast({
        title: '请选择剩余座位',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    if (!this.data.seatValue) {
      wx.showToast({
        title: '请填写车费',
        image: '/image/warning.png',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: 'https://activity.beitaichufang.com/car/api/v1/trip/save',
      data: {
        token: wx.getStorageSync('token'),
        startProvince: this.data.startValue[0],
        startCity: this.data.startValue[1],
        startCounty: this.data.startValue[2],
        startPoint: this.data.startPointValue,
        endProvince: this.data.endValue[0],
        endCity: this.data.endValue[1],
        endCounty: this.data.endValue[2],
        endPoint: this.data.endPointValue,
        rulesType: this.data.timeType,
        startDate: this.data.dateValue=='点击选择' ? '' : this.data.dateValue.replace(/-/g, ''),
        startTime: this.data.timeValue.replace(':', ''),
        contactType: Number(this.data.contactIndex) + 1,
        mobile: this.data.contactValue,
        name: this.data.nameValue,
        points: this.data.pathValue ? this.data.pathValue.replace(/，/g, ",") : '',
        unitPrice: this.data.fareValue,
        seatCount: this.data.seatValue,
        remark: this.data.remarkValue ? this.data.remarkValue : ''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: res => {
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '../detail/detail?numValue=' + res.data.data.trip.number
          })
        } else {
          wx.showToast({
            title: res.data.data.msg,
            image: '/image/warning.png',
            duration: 2000
          })
        }
      }
    })
  },

  // 跳转免责声明
  catchRelief: function () {
    wx.navigateTo({
      url: 'relief/relief',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  }
})