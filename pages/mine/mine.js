//mine.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    hasContain: false, // 页面显示标识
    hasUserInfo: false // 是否有用户信息的标识
  },

  // 获取用户信息方法
  getUserInfo: function (res) {
    if (res.detail.userInfo) {
      app.globalData.userInfo = res.userInfo
      this.setData({
        userInfo: res.detail.userInfo,
        hasUserInfo: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    this.setData({
      hasContain: true
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
  }
})