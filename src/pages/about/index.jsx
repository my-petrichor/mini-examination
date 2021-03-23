import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'

import 'taro-ui/dist/style/components/flex.scss'
import 'taro-ui/dist/style/components/image-picker.scss'
import 'taro-ui/dist/style/components/icon.scss'
import './index.css'
import about from '../../pictures/avatar.png'

export default class Index extends Component {

  render () {                      
    return (        
      <View className='index' style='height: 100vh'>      

          <View className='at-row at-row__justify--center' style='height: 16vh'></View>
    
          <View className='at-row at-row__justify--center' style='height: 22vh'>
          <Image style=' width: 100px; height: 100px' src={about}/> 
          </View>

          <View className='at-row at-row__justify--center' style='height: 26vh'>
              <View className='at-col at-col-8 at-col--wrap'>
                <Text  space='nbsp'>我们是专业的团队，我们受过专业的训练，提供最优质的服务，选择我们就等于选择了成功</Text>
              </View>
          </View>   

          <View className='at-row at-row__justify--center' style='height: 22vh'>
          <View className='loader JS_on'>
	        <View className='binary'></View>
	        <View className='binary'></View>
	        <View className='getting-there'></View>
          </View> 
          </View>  

          <View className='at-row at-row__justify--center'>
              <Text>version 1.0</Text>
          </View>  

      </View>
             
    )
  }
}
