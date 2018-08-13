//app.js
App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        if (res.authSetting['scope.location']) {
          // 已经授权，可以直接调用 getLocation 获取地理位置，不会弹框
          wx.getLocation({
            success: res => {
              this.globalData.location = res
              // callback防止请求在onload之后完成
              if (this.locationReadyCallback) {
                this.locationReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    location: null,
    getUserInfo: false,
    getLocation: false
  }
})