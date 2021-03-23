import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { AtButton, AtToast } from 'taro-ui'
import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/loading.scss'
import 'taro-ui/dist/style/components/toast.scss'
import { Set } from '../../globalData'
import welcome from '../../pictures/welcome.gif'
import './index.css'


export default class Index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      navigateTo: '',
      toast: true,
      loading: true,
    }
    Set('statistic', [])
  }

  componentWillMount() {
    var flag = false
    do {
    Taro.request({
      url: 'https://yuque-parse.vercel.app/api/student/math',
      success: resp => {
        console.log(resp.data, 'request')
        flag = true
        try {
          Taro.setStorageSync('questions', resp.data.Questions),
            Taro.setStorageSync('answers', resp.data.Answers)
        } catch (e) {
          console.log(e, 'store error')
        }

        if (resp.data.Questions[0].Content.includes('_')) {
          this.setState({
            navigateTo: '/pages/select/index?id=1'
          })
        } else {
          this.setState({
            navigateTo: '/pages/judge/index?id=1'
          })
        }
        this.setState({
          loading: false,
          toast: false,
        })
      }
    })
  } 
  while(flag)
  }

  start = (navigateTo) => {
    Taro.redirectTo({
      url: navigateTo
    })
  }

  about = () => {
    Taro.redirectTo({
      url: '/pages/about/index'
    })
  }

  render() {
    let navigateTo = this.state.navigateTo
    let toast = this.state.toast
    let loading = this.state.loading
    return (
      <View catchMove={true} className='index' style='height: 100vh'>   
      <View style='height: 25vh'></View> 

      <View className='at-row at-row__justify--center' style='height: 20vh; width: 100vw'>
      <Image style='width: 100vw; height: 11vh' src={welcome} />
      </View>      

        <View style='height: 20vh' className='at-col' />

        <View className='at-row at-row__justify--center'><AtToast isOpened={toast} duration={0} text='正在获取题库数据' /></View>

        <View className='at-row at-row__justify--center'>
          <View className='at-col at-col-11'><AtButton className='result-start' circle={true} loading={loading} type='primary' onClick={this.start.bind(this, navigateTo)} >开始答题</AtButton></View>
        </View>

        <View style='height: 4vh' className='at-col'></View>

        <View className='at-row at-row__justify--center'>
          <View className='at-col at-col-11'><AtButton className='result-about' customStyle='background-color: #9254de; border-style: none; color: white'  circle={true} type='secondary' onClick={this.about} >关于</AtButton></View>
        </View>

      </View>
    )
  }
}
