import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import './index.css'

import {Set, Get} from '../../globalData'
import QuestionCard from '../../components/questionCard'

export default class Index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      questions: Taro.getStorageSync('questions'),
      answers: Taro.getStorageSync('answers'),
      question: '',
      answer: [],
      resultRight: '#87ceeb',
      resultWrong: '#87ceeb',
      currentPageId: 1,
      nextPageId: 0,
      nextButton: '下一题',
      nextButtonDisabled: true,
      date: new Date(),
      time: '00:00:00',     
    } 
  }

  componentDidMount() {
    this.timerID = setInterval(
        () => this.tick(),
        1000
    )
}

tick () {
    let now =  new Date()
    this.dateDiff = now.getTime() - this.state.date.getTime() 
    // let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
    let leave1 = this.dateDiff % (24 * 3600 * 1000)
    let hours =  Math.floor(leave1/(3600*1000))
    let leave2 = leave1%(3600*1000)
    let minutes =  Math.floor(leave2/(60*1000))
    let leave3 = leave2%(60*1000)
    let seconds = Math.round(leave3/1000)
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
      time: hours + ':' + minutes + ':' + seconds
    })        
  }

  componentWillMount() {
    const id = getCurrentInstance().router.params

    if (Number(id.id) == this.state.questions.length) {
      this.setState({
        nextButton: '统计'
      })
    }

    for (let x of this.state.questions) {
      if (x.Id == Number(id.id)) {
        this.setState({
          question: this.state.questions[x.Id - 1].Content,
          answer: this.state.answers[x.Id - 1].Content,
          currentPageId: x.Id,
          nextPageId: x.Id + 1
        })
        break
      }
    }
  }

  navigateTo(currentPageId, nextPageId) {
    if (currentPageId == this.state.questions.length) {
      Taro.redirectTo({
        url: '/pages/statistic/index'
      })
      return
    }

    if (this.state.questions[nextPageId - 1].Content.includes('_')) {
      Taro.redirectTo({
        url: '/pages/select/index?id=' + nextPageId
      })
    } else {
      Taro.redirectTo({
        url: '/pages/judge/index?id=' + nextPageId
      })
    }
  }

  handleAnswer = answer => {
    //Clear timer
    clearInterval(this.timerID)
    let statistic = Get('statistic')

    //Guaranteed to answer the question only once
    if (this.state.resultRight != '#87ceeb' || this.state.resultWrong != '#87ceeb') {
      return
    }

    //True or false
    if (this.state.answer[0] == answer) {
      //true
      statistic.push({
        time: this.dateDiff,
        answerResult: '正确'
      })
      Set({
        key: 'statistic',
        val: statistic      
      })
      //Change button color
      if (answer == '正确') {
        this.setState({
          resultRight: '#52c41a',
          nextButtonDisabled: false,
        })
      } else {
        this.setState({
          resultWrong: '#52c41a',
          nextButtonDisabled: false,
        })
      }
    } else {
      //false
      statistic.push({
        time: this.dateDiff,
        answerResult: '错误'
      })
      Set({
        key: 'statistic',
        val: statistic      
      })
      //Change button color
      if (answer == '正确') {
        this.setState({
          resultRight: '#ff4d4f',
          nextButtonDisabled: false,
        })
      } else {
        this.setState({
          resultWrong: '#ff4d4f',
          nextButtonDisabled: false,
        })
      }
    }
  }

  render() {
    const question = this.state.question
    const resultRight = 'background-color: ' + this.state.resultRight + ';box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); color: white; border-style: none' 
    const resultWrong = 'background-color: ' + this.state.resultWrong + ';box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); color: white; border-style: none' 
    const currentPageId = this.state.currentPageId
    const nextPageId = this.state.nextPageId
    const nextButton = this.state.nextButton
    const rightTop = this.state.currentPageId + '/' + this.state.questions.length
    console.log(resultRight, resultWrong, 'in render')

    return (
      <View catchMove={true} className='index' style='height: 100vh'>

        <View className='at-row' style='height: 6vh'>
          <View className='at-col'></View>
          <View className='at-col at-col-9'><Text>用时: {this.state.time}</Text></View>
          <View className='at-col at-col-2'><AtButton size='small' customStyle='background-color: #87ceeb; color: white' disabled={this.state.nextButtonDisabled} onClick={this.navigateTo.bind(this, currentPageId, nextPageId)}>{nextButton}</AtButton></View>
          <View className='at-col'></View>
        </View>
        
        <View className='background' style='height: 94vh'>
        <View className='at-row at-row__justify--center' style='height: 3vh'></View>
        <QuestionCard value={question} height='45vh' rightTop={rightTop} rightTopFontSize='14px' leftTop='判断' />

        <View className='at-row' style='height: 14vh'></View>

        <View className='at-row at-row__justify--center'>
          <View className='at-col at-col-11'><AtButton customStyle={resultRight} circle={true} onClick={this.handleAnswer.bind(this, '正确')} type='secondary'>正确</AtButton></View>
        </View>

        <View style='height: 4vh'></View>

        <View className='at-row at-row__justify--center'>
          <View className='at-col at-col-11'><AtButton customStyle={resultWrong} circle={true} onClick={this.handleAnswer.bind(this, '错误')} type='secondary'>错误</AtButton></View>
        </View>
        </View>

      </View>
    )
  }
}
