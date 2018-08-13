// pages/minerelease/minerelease.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 列表值
    hasList: false, // 是否获取到list标识
    page: 1, // list页数
    listEnd: false, // list获取中止
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://activity.beitaichufang.com/car/api/v1/trip/user/list',
      data: {
        token: wx.getStorageSync('token'),
        page: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: res => {
        console.log(res);
        this.setData({
          list: res.data.data.list
        })
        wx.stopPullDownRefresh()
        this.setData({
          hasList: true
        })
        this.setData({
          listEnd: false
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      hasList: false,
      page: 1
    })
    wx.request({
      url: 'https://activity.beitaichufang.com/car/api/v1/trip/user/list',
      data: {
        token: wx.getStorageSync('token'),
        page: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: res => {
        this.setData({
          list: res.data.data.list
        })
        wx.stopPullDownRefresh()
        this.setData({
          hasList: true
        })
        if (res.data.data.list.length == 0) {
          this.setData({
            listEnd: true
          })
        }
      }
    })
  },
  /**
   * 小程序分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '拼车回家啦',
      path: '/pages/index/index',
      imageUrl: 'http://btcf.oss-cn-hangzhou.aliyuncs.com/img/H5/icon/icon1.png',
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
  },
})