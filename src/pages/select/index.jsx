import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import Taro, { getCurrentInstance } from '@tarojs/taro'

import icon from '../../pictures/icon.png'
import { Set, Get } from '../../globalData'
import QuestionCard from '../../components/questionCard'
import 'taro-ui/dist/style/components/input.scss'
import './index.css'

export default class Index extends Component {
  constructor(props) {
    super(props)

    const id = getCurrentInstance().router.params
    const currentPageId = Number(id.id)
    const questions = Taro.getStorageSync('questions')
    const blank_number = questions[currentPageId - 1].Content.split('______').length - 1
    this.state = {
      questions: questions,
      answers: Taro.getStorageSync('answers'),
      question: '',
      answer: [],
      currentPageId: currentPageId,
      nextPageId: currentPageId + 1,
      blank_number: blank_number,
      blankNumberArray: [],
      nextButton: '下一题',
      nextButtonDisabled: true,
      displayInput: 'flex',
      displayAnswer: 'none',
      input: new Array(blank_number).fill(''),
      date: new Date(),
      time: '00:00:00',
      inputOne: 'flex',
      inputTwo: 'none',
      inputThree: 'none',
      valueOne: '',
      valueTwo: '',
      valueThree: '',
      answerResult: '',
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
    if (this.state.currentPageId == 5) {
      this.setState({
        nextButton: '统计'
      })
    }
    var blankNumberArray = []
    for (let i = 1; i <= this.state.blank_number; i++) {
      blankNumberArray.push(i)
    }

    //todo
    switch (this.state.blank_number) {
      case 2:
        this.setState({
          inputTwo: 'flex'
        })
        break
      case 3:
        this.setState({
          inputTwo: 'flex',
          inputThree: 'flex'
        })
    }

    for (let x of this.state.questions) {
      if (x.Id == this.state.currentPageId) {
        this.setState({
          question: this.state.questions[x.Id - 1].Content,
          answer: this.state.answers[x.Id - 1].Content,
          blankNumberArray: blankNumberArray
        })
        break
      }
    }
  }

  navigateTo = (currentPageId, nextPageId) => {
    if (currentPageId == 5) {
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

  submit = () => {
    //Guaranteed answer question only once
    if (this.state.answerResult == '正确') {
      return
    }    
    //Clear timer
    clearInterval(this.timerID)
    let statistic = Get('statistic')

    //True or false
    for (let i = 0; i < this.state.answer.length; i++) {
      //false
      switch (i) {
        case 0:
          //a lot of answer
          if (this.state.answer[i].includes('#')) {
            const answers = this.state.answer[i].split('#')
            for (let answer of answers) {
            if (this.state.valueOne != answer) {
              statistic.push({
                time: this.dateDiff,
                answerResult: '错误'
              })
              Set({
                key: 'statistic',
                val: statistic
              })
              this.setState({
                displayInput: 'none',
                displayAnswer: 'flex',
                nextButtonDisabled: false,
              })
              return
            }
          }
          break;
        }
          if (this.state.valueOne != this.state.answer[i]) {
            statistic.push({
              time: this.dateDiff,
              answerResult: '错误'
            })
            Set({
              key: 'statistic',
              val: statistic
            })
            this.setState({
              displayInput: 'none',
              displayAnswer: 'flex',
              nextButtonDisabled: false,
            })
            return
          }
          break;

        case 1:
           //a lot of answer
           if (this.state.answer[i].includes('#')) {
            const answers = this.state.answer[i].split('#')
            for (let answer of answers) {
            if (this.state.valueTwo != answer) {
              statistic.push({
                time: this.dateDiff,
                answerResult: '错误'
              })
              Set({
                key: 'statistic',
                val: statistic
              })
              this.setState({
                displayInput: 'none',
                displayAnswer: 'flex',
                nextButtonDisabled: false,
              })
              return
            }
          }
          break;
        }
          if (this.state.valueTwo != this.state.answer[i]) {
            statistic.push({
              time: this.dateDiff,
              answerResult: '错误'
            })
            Set({
              key: 'statistic',
              val: statistic
            })
            this.setState({
              displayInput: 'none',
              displayAnswer: 'flex',
              nextButtonDisabled: false,
            })
            return
          }
          break;

        case 2:
           //a lot of answer
           if (this.state.answer[i].includes('#')) {
            const answers = this.state.answer[i].split('#')
            for (let answer of answers) {
            if (this.state.valueThree != answer) {
              statistic.push({
                time: this.dateDiff,
                answerResult: '错误'
              })
              Set({
                key: 'statistic',
                val: statistic
              })
              this.setState({
                displayInput: 'none',
                displayAnswer: 'flex',
                nextButtonDisabled: false,
              })
              return
            }
          }
          break;
        }
          if (this.state.valueThree != this.state.answer[i]) {
            statistic.push({
              time: this.dateDiff,
              answerResult: '错误'
            })
            Set({
              key: 'statistic',
              val: statistic
            })
            this.setState({
              displayInput: 'none',
              displayAnswer: 'flex',
              nextButtonDisabled: false,
            })
            return
          }
          break;
      }
    }

    //true
    statistic.push({
      time: this.dateDiff,
      answerResult: '正确'
    })
    Set({
      key: 'statistic',
      val: statistic
    })
    this.setState({
      answerResult: '正确',
      nextButtonDisabled: false,
    })
  }


  handleChangeOne = value => {
    this.setState({
      valueOne: value
    })
    return value
  }

  handleChangeTwo = value => {
    this.setState({
      valueTwo: value
    })
    return value
  }

  handleChangeThree = value => {
    this.setState({
      valueThree: value
    })
    return value
  }

  render() {
    const question = this.state.question
    const currentPageId = this.state.currentPageId
    const nextPageId = this.state.nextPageId
    const nextButton = this.state.nextButton
    const valueOne = this.state.valueOne
    const valueTwo = this.state.valueTwo
    const valueThree = this.state.valueThree
    const inputTwo = 'display:' + this.state.inputTwo + '; height: 7vh; border-style: solid; background-color: white; border-width: 1px; border-color: white; box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); border-radius: 5px'
    const inputThree = 'display:' + this.state.inputThree + '; height: 7vh; border-style: solid; background-color: white; border-width: 1px; border-color: white; box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); border-radius: 5px'
    const displayInput = 'display:' + this.state.displayInput
    const displayAnswer = 'display:' + this.state.displayAnswer + '; height: 38vh'
    const rightTop = this.state.currentPageId + '/' + '5'

    return (
      <View catchMove={true} className='index' style='height: 100vh'>

        <View className='at-row' style='height: 6vh'>
          <View className='at-col'></View>
          <View className='at-col at-col-9'><Text>用时: {this.state.time}</Text></View>
          <View className='at-col at-col-2'><AtButton size='small' type='primary' disabled={this.state.nextButtonDisabled} onClick={this.navigateTo.bind(this, currentPageId, nextPageId)}> {nextButton}</AtButton></View>
          <View className='at-col'></View>
        </View>

        <View className='background' style='height: 94vh'>
        <View className='at-row at-row__justify--center' style='height: 3vh'></View>
          <QuestionCard value={question} height='40vh' rightTop={rightTop} rightTopSize='14px' leftTop='选择' />
          <View className='at-row at-row__justify--center' style='height: 5vh'></View>

          <View className='at-row at-row--wrap at-row__justify--center' style={displayInput}>
            <View className='at-col at-col-11'>
              <View className='at-col at-col-12' style='height: 10vh'>
                <View className='at-col at-col-12' style='height: 7vh; border-style: solid; background-color: white; border-width: 1px; border-color: white; box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); border-radius: 5px'>
                  <AtInput title='空1' type='text' name='inputOne' border={false} placeholder='请输入空1的答案' value={valueOne} onChange={this.handleChangeOne.bind(this)} />
                </View>
              </View>
              <View className='at-col at-col-12' style='height: 10vh'>
                <View className='at-col at-col-12' style={inputTwo}>
                  <AtInput title='空2' type='text' name='inputTwo' border={false} placeholder='请输入空2的答案' value={valueTwo} onChange={this.handleChangeTwo.bind(this)} />
                </View>
              </View>
              <View className='at-col at-col-12' style='height: 10vh'>
                <View className='at-col at-col-12' style={inputThree}>
                  <AtInput title='空3' type='text' name='inputThree' border={false} placeholder='请输入空3的答案' value={valueThree} onChange={this.handleChangeThree.bind(this)} />
                </View>
              </View>
              <AtButton className='submit' type='primary' onClick={this.submit.bind(this, '1')}>提交</AtButton>
            </View>
          </View>


          <View className='at-row at-row--wrap at-row__justify--center' style={displayAnswer}>
          {/* <View className='at-col at-col-11' style='height: 2vh'></View> */}
            <View className='at-col at-col-11' style='background-color: white;border-style: solid; border-width: 1px; border-color: white; box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.1); border-radius: 5px'>
              <View style='height: 2vh'></View>
              <View className='at-row' style='height: 6vh'>
                <View className='at-col at-col__offset-1'>
                  <Image style='height: 14px; width: 3px' src={icon} />
                  <Text style='font-size: 18px' space='nbsp'>  正确答案</Text>
                </View>
              </View>
              {this.state.blankNumberArray.map((item, number) => {
                let answer = this.state.answer[number]
                if (this.state.answer[number].includes('#')) {
                  answer = this.state.answer[number].replace(/#/g, '或')
                }
                return (
                  <View className='at-row at-row__justify--center' style='height: 5vh'>
                    <Text className='at-col at-col-10 at-col--wrap' style='font-size: 16px； text-align:center'>{item}. {answer}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

      </View>
    )
  }
}
