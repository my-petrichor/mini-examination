import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import * as echarts from '../../components/ec-canvas/echarts'
import './index.css'
import { AtButton } from 'taro-ui'
import { Get } from '../../globalData/index'
import Gauge from '../../components/gauge'
import icon from '../../pictures/icon.png'

export default class Index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ec: {
        onInit: {}
      },
      statistic: Get('statistic'),
      timeSum: '',
      precision: '',
      rightNumber: 0,
    }
  }

  initChart(canvas, width, height) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    })
    canvas.setChart(chart)

    var time = []
    var middleTime
    var rank = []
    const statistic = Get('statistic')
    for (let x of statistic) {
      if (x.time === undefined) {
        middleTime = 743
      } else {
        middleTime = x.time
      }

      time.push(middleTime / 1000)
      if (middleTime / 1000 > 15) {
        rank.push((Math.random() * 60).toFixed(2))
      } else if (middleTime / 1000 > 5) {
        rank.push((Math.random() * 30 + 60).toFixed(2))
      } else {
        rank.push((Math.random() * 10 + 90).toFixed(2))
      }
    }
    var max = time[0]

    for (let i = 0; i < time.length - 1; i++) {
      if (time[i + 1] > max) {
        max = time[i + 1]
      }
    }

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['题目用时/S', '题目用时排名/%']
      },

      xAxis: [
        {
          type: 'category',
          data: ['第1题', '第2题', '第3题', '第4题', '第5题'],
          axisPointer: {
            type: 'shadow'

          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: Math.ceil(max / 5) * 5,
          interval: Math.ceil(max / 5),
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              align: 'left',
            }
          },
          splitLine: {
            show: false
          },
          offset: 10
        },
        {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              align: 'right',
            }
          },
          splitLine: {
            show: false
          },
          offset: 10
        }

      ],
      series: [
        {
          name: '题目用时/S',
          type: 'bar',
          data: time,
          color: '#6190e8',

        },

        {
          name: '题目用时排名/%',
          type: 'line',
          yAxisIndex: 1,
          data: rank,
          color: '#ad77f1',
          label: {
            normal: {
              position: 'inside'
            }
          }
        }
      ]
    };
    chart.setOption(option)
    return chart
  }

  componentDidMount() {
    var rightNumber = 0
    var timeSum = 0
    for (let x of this.state.statistic) {
      if (x.time === undefined) {
        timeSum += 743
      } else {
        timeSum += x.time
      }
      if (x.answerResult == '正确') {
        rightNumber++
      }
    }
    let leave1 = timeSum % (24 * 3600 * 1000)
    let hours = Math.floor(leave1 / (3600 * 1000))
    let leave2 = leave1 % (3600 * 1000)
    let minutes = Math.floor(leave2 / (60 * 1000))
    let leave3 = leave2 % (60 * 1000)
    let seconds = Math.round(leave3 / 1000)
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (hours < 10) {
      hours = '0' + hours
    }

    this.setState({
      precision: (rightNumber / this.state.statistic.length).toFixed(3) * 100 + '%',
      timeSum: hours + ':' + minutes + ':' + seconds,
      rightNumber: rightNumber,
      ec: {
        onInit: this.initChart
      }
    })
  }

  returnHomePage = () => {
    Taro.redirectTo({
      url: '/pages/start/index'
    })
  }

  render() {
    return (
      <View catchMove={true} className='index' style='height: 100vh'>
        <View style='height: 3vh'></View>
        <View>
          <View className='at-row at-row--wrap at-row__justify--center' style='height: 75vh'>
            <View className='at-col at-col-11' style='background-color: white;border-style: solid; border-width: 1px; border-color: white; box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); border-radius: 5px'>
              <View style='height: 10px'></View>
              <View className='at-row' style='height: 32px'>
                <View className='at-col at-col__offset-1'>
                  <Image style='height: 14px; width: 3px' src={icon} />
                  <Text style='font-size: 18px' space='nbsp'>  本次答对题目: {this.state.rightNumber}</Text>
                </View>
              </View>
              <View className='at-row'>
                <Text className='at-col at-col__offset-1'>正确率: {this.state.precision}</Text>
                <Text className='at-col at-col__offset-2'>用时: {this.state.timeSum}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='at-row' style='height: 7vh'></View>

        <View className='at-row at-row__justify--center'>
          <View className='at-col at-col-11'><AtButton className='return' customStyle='background-color: #87ceeb; border-style: none; color: white' circle={true} onClick={this.returnHomePage}>返回</AtButton></View>
        </View>

        <View className='echarts' style='height: 95vh'>
          <Gauge />
          <ec-canvas id='line' canvas-id='mychart' ec={this.state.ec}></ec-canvas>
        </View>
      </View>
    )
  }
}



