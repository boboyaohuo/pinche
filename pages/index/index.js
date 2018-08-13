//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: wx.getStorageSync('token'), // 用户token
    userInfo: {}, // 用户信息
    location: {}, // 地理位置
    list: [], // 列表值
    startValue: '', // 出发市区
    startAddValue: '选择出发市区', // 出发市区
    searchValueFir: '', // 出发地
    endValue: '', // 目的市区
    endAddValue: '选择目的市区', // 目的市区
    searchValueSec: '', // 目的地
    dateValue: '请选择出发日期', // 出发日期
    timeValue: '请选择出发时间', // 出发时间
    focus: false, // 获取焦点标识
    hasUserInfo: false, // 是否有用户信息的标识
    hasLocation: false, // 是否有地理位置的标识
    hasScroll: false, // 是否滚动的标识
    hasList: false, // 是否获取到list标识
    page: 1, // list页数
    listEnd: false, // list获取中止
  },
  // 获取地理位置方法
  bindGetLocation: function () {
    // 打开设置
    wx.openSetting({
      success: res => {
        // 根据设置结果，获取用户信息和地理位置
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        }
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            success: res => {
              app.globalData.location = res
              this.setData({
                location: res,
                hasLocation: true
              })
            }
          })
        }
      }
    })
  },
  // 获取用户信息方法
  getUserInfo: function (res) {
    if (res.detail.userInfo) {
      app.globalData.userInfo = res.userInfo
      this.setData({
        userInfo: res.detail.userInfo,
        hasUserInfo: true
      })
      this.bindRelease();
    }
  },
  // 出发地选择
  bindStartAddPicker: function (e) {
    this.setData({
      startValue: e.detail.value,
      startAddValue: e.detail.value[1] + e.detail.value[2]
    })
  },
  // 设置出发地搜索数据
  bindSearchValueFir: function (e) {
    this.setData({
      searchValueFir: e.detail.value
    })
  },
  // 目的地选择
  bindEndAddPicker: function (e) {
    this.setData({
      endValue: e.detail.value,
      endAddValue: e.detail.value[1] + e.detail.value[2]
    })
  },
  // 设置目的地搜索数据
  bindSearchValueSec: function (e) {
    this.setData({
      searchValueSec: e.detail.value
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
  // 搜索方法
  bindSearch: function () {
    if (!this.data.startValue) {
      wx.showToast({
        title: '请选择出发市区',
        image: '../../image/search-icon1.png',
        duration: 2000
      })
      return
    }
    if (!this.data.endValue) {
      wx.showToast({
        title: '请选择目的市区',
        image: '../../image/search-icon1.png',
        duration: 2000
      })
      return
    }
    wx.request({
      url: 'https://activity.beitaichufang.com/car/api/v1/trip/list',
      data: {
        token: this.data.token,
        startCity: this.data.startValue ? this.data.startValue[1] : '',
        startCountry: this.data.startValue ? this.data.startValue[2] : '',
        startPoint: this.data.searchValueFir,
        endCity: this.data.endValue ? this.data.endValue[1] : '',
        endCountry: this.data.endValue ? this.data.endValue[2] : '',
        endpoint: this.data.searchValueSec,
        startDate: this.data.dateValue == '请选择出发日期' ? '' : this.data.dateValue.replace(/-/g, ''),
        startTime: this.data.timeValue == '请选择出发时间' ? '' : this.data.timeValue.replace(/:/g, ''),
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
          hasList: true,
          listEnd: false
        })
      }
    })
  },
  // 清除搜索条件
  bindClean: function () {
    this.setData({
      searchValueFir: '',
      searchValueSec: '',
      startAddValue: '选择出发市区',
      endAddValue: '选择目的市区',
      startValue: '',
      endValue: '',
      startDate: '请选择出发日期',
      startTime: '请选择出发时间',
    })
    this.getIndexList();
  },
  // 互换出发值和目的值
  bindExchange: function () {
    this.setData({
      searchValueFir: this.data.searchValueSec,
      searchValueSec: this.data.searchValueFir,
      startAddValue: this.data.endAddValue,
      endAddValue: this.data.startAddValue,
      startValue: this.data.endValue,
      endValue: this.data.startValue
    })
  },
  // 跳转详情
  bindRelease: function () {
    wx.navigateTo({
      url: '../release/release'
    })
  },
  onLoad: function () {
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (app.globalData.getUserInfo) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 首次提示授权
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.request({
            url: 'https://activity.beitaichufang.com/car/api/v1/user/login',
            data: {
              token: this.data.token,
              sex: res.userInfo.gender,
              nickName: res.userInfo.nickName,
              headUrl: res.userInfo.avatarUrl
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: res => {
              console.log(res);
            }
          })
        }
      })
    }
    this.getIndexList();
    //获取用户地理位置
    // if (app.globalData.location) {
    //   this.setData({
    //     userInlocationfo: app.globalData.location,
    //     hasLocation: true
    //   })
    // } else if (app.globalData.getLocation) {
    //   // 由于 getLocation 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.locationReadyCallback = res => {
    //     this.setData({
    //       location: res,
    //       hasLocation: true
    //     })
    //   }
    // } else {
    //   // 首次提示授权
    //   wx.getLocation({
    //     success: res => {
    //       app.globalData.location = res
    //       this.setData({
    //         location: res,
    //         hasLocation: true
    //       })
    //     }
    //   })
    // }
  },
  // 监听下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      hasList: false,
      page: 1
    })
    wx.request({
      url: 'https://activity.beitaichufang.com/car/api/v1/trip/list',
      data: {
        token: this.data.token,
        startCity: this.data.startValue ? this.data.startValue[1] : '',
        startCountry: this.data.startValue ? this.data.startValue[2] : '',
        startPoint: this.data.searchValueFir,
        endCity: this.data.endValue ? this.data.endValue[1] : '',
        endCountry: this.data.endValue ? this.data.endValue[2] : '',
        endpoint: this.data.searchValueSec,
        startDate: this.data.dateValue == '请选择出发日期' ? '' : this.data.dateValue.replace(/-/g, ''),
        startTime: this.data.timeValue == '请选择出发时间' ? '' : this.data.timeValue.replace(/:/g, ''),
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
          hasList: true,
          listEnd: false
        })
      }
    })
  },
  // 上拉触底函数
  onReachBottom: function (res) {
    this.setData({
      page: this.data.page + 1
    })
    wx.request({
      url: 'https://activity.beitaichufang.com/car/api/v1/trip/list',
      data: {
        token: this.data.token,
        startCity: this.data.startValue ? this.data.startValue[1] : '',
        startCountry: this.data.startValue ? this.data.startValue[2] : '',
        startPoint: this.data.searchValueFir,
        endCity: this.data.endValue ? this.data.endValue[1] : '',
        endCountry: this.data.endValue ? this.data.endValue[2] : '',
        endpoint: this.data.searchValueSec,
        startDate: this.data.dateValue=='请选择出发日期' ? '' : this.data.dateValue.replace(/-/g, ''),
        startTime: this.data.timeValue == '请选择出发时间' ? '' : this.data.timeValue.replace(/:/g, ''),
        page: this.data.page
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: res => {
        this.setData({
          list: this.data.list.concat(res.data.data.list)
        })
        wx.stopPullDownRefresh()
        this.setData({
          hasList: true
        })
        if (res.data.data.list.length==0) {
          this.setData({
            listEnd: true
          })
        }
      }
    })
  },
  // 分享小程序
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
  // 页面滚动触发函数
  onPageScroll: function (res) {
    if (res.scrollTop > 50) {
      this.setData({
        hasScroll: true
      })
    } else {
      this.setData({
        hasScroll: false
      })
    }
  },
  // 注册获取首页数据
  getIndexList: function () {
    if (!this.data.token) {
      wx.login({
        success: res => {
          let that = this
          wx.request({
            url: 'https://activity.beitaichufang.com/car/api/v1/user/login',
            data: {
              code: res.code,
              sex: '1'
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值（string拼接）
            },
            method: 'POST', // 请求方式
            success: function (res) {
              wx.setStorageSync('token', res.data.data.token) // 本地存储token
              that.setData({
                token: res.data.data.token
              })
              wx.request({
                url: 'https://activity.beitaichufang.com/car/api/v1/trip/list',
                data: {
                  token: that.data.token,
                  page: 1
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method: 'POST',
                success: res => {
                  that.setData({
                    list: res.data.data.list
                  })
                  wx.stopPullDownRefresh()
                  that.setData({
                    hasList: true
                  })
                  this.setData({
                    listEnd: false
                  })
                }
              })
            }
          })
        }
      })
    } else {
      wx.request({
        url: 'https://activity.beitaichufang.com/car/api/v1/trip/list',
        data: {
          token: this.data.token,
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
    }
  }
})
