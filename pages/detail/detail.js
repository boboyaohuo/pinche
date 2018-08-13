// detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numValue: null, // 详情编号
    share: false, // 是否是分享页的标识
    detail: null, // 详情信息
    mobile: '', // 联系号码
  },

  // 查看更多
  bindMore: function () {
    wx.reLaunch({
      url: '../../pages/index/index'
    })
  },

  // 点击拨号
  bindTel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.mobile //仅为示例，并非真实的电话号码
    })
  },

  // 点击复制
  bindCopy: function () {
    wx.setClipboardData({
      data: this.data.detail.mobile,
      success: res => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      numValue: options.numValue,
      share: options.share
    })
    wx.request({
      url: 'https://activity.beitaichufang.com/car/api/v1/trip/detail',
      data: {
        token: wx.getStorageSync('token'),
        number: this.data.numValue
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: res => {
        this.setData({
          mobile: res.data.data.trip.mobile
        })
        if (res.data.data.trip.contactType == 1) {
          this.setData({
            mobile: res.data.data.trip.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
          })
        }
        this.setData({
          detail: res.data.data.trip
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '我发现一个车程，跟我一起回家吧！',
      path: 'pages/detail/detail?numValue=' + this.data.numValue+'&share=true',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})