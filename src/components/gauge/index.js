import React, { Component } from 'react'
import { View } from '@tarojs/components'
import * as echarts from '../ec-canvas/echarts'
import './index.scss'

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, (null), {
    width: width,
    height: height
  })

  canvas.setChart(chart)
  
  const option = {
    series: [{
        type: 'gauge',
        min: 0,
        max: 100,
        startAngle: 180,
        endAngle: 0,
        itemStyle: {
            color: '#6190e8',
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
        },
        progress: {
            show: true,
            roundCap: true,
            width: 12,
           
        },
        pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '60%',
            show: false,
            width: 10,
            offsetCenter: [0, '10%']
        },
        axisLine: {
            roundCap: true,
            lineStyle: {
                width: 12,
            },
            
        },

      axisLabel: {
        show: false,
        distance: 50,
    },
        axisTick: {
            splitNumber: 4,

            lineStyle: {
                width: 1,
                color: '#999'
            }
        },
        splitLine: {
            length: 12,
            lineStyle: {
                width: 3,
                color: '#6190e8'
            }
        },
       
        title: {
            offsetCenter: [0, '-20%'],
            fontSize: 14
        },
        detail: {
            fontSize: 18,
            offsetCenter: [0, '0'],
            valueAnimation: true,
            formatter: function (value) {
                return Math.round(value) + "%" + '的人';
            },
            color: '#9a53f6'
        },
        data: [{
            name: "你超越了",
            value: ((Math.random()*30 + 70)).toFixed(2)
        }]
    }]
};


  chart.setOption(option)
  return option
}

export default class Gauge extends Component {
  state = {
  ec: {
    onInit: initChart
  }
 }

  render () {
    return (
      <View className='echarts'>        
        <ec-canvas id='gauge' canvas-id='mychart-area' ec={this.state.ec}></ec-canvas>
      </View>
    )
  }
}

