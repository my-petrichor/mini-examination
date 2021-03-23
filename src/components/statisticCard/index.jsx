import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'

import icon from '../../pictures/icon.png'

class QuestionCard extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const  height = 'height: ' + this.props.height
        const leftTop = this.props.leftTop
        const rightTop = this.props.rightTop
        const value = this.props.value
        const leftTopFontSize = 'font-size: ' + this.props.leftTopFontSize
        const rightTopFontSize = 'font-size' + this.props.rightTopFontSize
        return (
            <View>
            <View className='at-row at-row--wrap at-row__justify--center' style={height}>
            <View className='at-col at-col-11' style='background-color: white;border-style: solid; border-width: 1px; border-color: white;  box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); border-radius: 5px'>
                <View style='height: 10px'></View>
                <View className='at-row' style='height: 40px'>
                    <View className='at-col at-col__offset-1'><Image style='height: 14px; width: 3px' src={icon}/>
                    <Text style={leftTopFontSize} space='nbsp'>  {leftTop}</Text>
                    </View>
                    <Text style={rightTopFontSize} className='at-col at-col__offset-6'>{rightTop}</Text>
                </View>             
                <View className='at-row at-row__justify--center'>
                    
                </View>
            </View>            
            </View>
            </View>
        )
    }
}

QuestionCard.defaultProps = {
    height: '250px',
    leftTop: '判断',
    leftTopFontSize: '18px',
    rightTopFontSize: '16px'
}

export default QuestionCard