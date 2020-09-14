<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="460px"
          style="background:#FBFBFB;position:relative;height:740px">
          <el-row style="margin-top:10px">
            <el-tag type="success"
              style="width:200px;font-size:22px">
              本次菜品
            </el-tag>
          </el-row>
          <el-row>
            <el-tag type="success"
              style="width:200px;font-size:22px">
              点餐人：{{nowOrderManName}}
            </el-tag>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="24"
              v-for="(item,index) in foodSelected1"
              :key="'orderdFood'+index"
              style="height:30px;margin-bottom:20px;">
              <el-tag :key="item.foodName"
                style="font-size:36px;font-weight:bold;width:430px;height: 40px;"
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row>
          <!-- <el-row style="position:absolute;bottom:0;">
            <el-tag style="margin-left:48px;margin-bottom:10px;width:100px;font-size:22px">
              {{isMilk1?'有牛奶':'无牛奶'}}
            </el-tag>
          </el-row> -->

          <!-- </el-aside> -->
          <!-- <el-aside width="260px"
          style="background:#FEFAFF;margin-left:5px;margin-right:5px;position:relative;height:740px">
          <el-row style="margin-top:10px">
            <el-tag type="warning"
              style="width:200px;font-size:22px;">
              上次菜品
            </el-tag>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="24"
              v-for="(item,index) in foodSelected2"
              :key="'orderdFood2'+index"
              style="height:30px;margin-bottom:10px;">
              <el-tag :key="item.foodName"
                style="font-size:26px;font-weight:bold;width:230px;"
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row> -->

          <!-- <el-row style="position:absolute;bottom:0;">
            <el-tag style="margin-left:48px;margin-bottom:100px;width:100px;font-size:22px">
              {{isMilk2?'有牛奶':'无牛奶'}}
            </el-tag>
          </el-row> -->
          <el-row style="position:absolute;bottom:0;">
            <el-button @click="popFoodSelected"
              type="success"
              style="margin-left:30px;margin-bottom:10px;width:420px;font-size:22px;height:80px">
              已打菜
            </el-button>
          </el-row>
        </el-aside>
        <el-container>
          <el-header>
            <el-col :span="22">
              <el-tag type=" primary"
                style="font-size:18px;width:200px">
                内部员工界面
              </el-tag>
            </el-col>
            <el-col :span="2">
              <el-button type="success"
                @click="getNowTimeBool()">刷新</el-button>
            </el-col>
          </el-header>
          <el-main>
            <el-row>
              <el-col v-for="(item,index) in cookBook"
                style="margin-left:8px"
                :key="item.index"
                :span="4.8">
                <el-tag style="font-size:22px;height:190px;width:150px">
                  <el-row style="margin-top:14px">
                    <el-image style="width: 130px; height: 100px"
                      :src="item.Icon"></el-image>
                  </el-row>
                  <el-row :style="item.Name.length>6?'font-size:18px;font-weight:bold':'font-size:22px;font-weight:bold'">{{item.Name}}</el-row>
                  <el-row>
                    售馨

                    <el-switch v-model="switchvalue[index]"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="changeFun">
                    </el-switch>
                  </el-row>
                </el-tag>
              </el-col>
            </el-row>
            <el-row>

            </el-row>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import axios from 'axios'
import fs from 'fs'
// import { ipcRenderer } from 'electron'

export default {
  data: function () {
    return {
      switchvalue: [true],
      cookBook: [],
      dialogVisible: true,
      enableSwitch: false,
      bigFoodSelected: [],
      foodSelected1: [],
      foodSelected2: [],
      isMilk1: false,
      isMilk2: false,
      CafeteriaId: '',
      nowTimeMealBool: '',
      axiosUrl: '',
      nowOrderManName: [],
      bigNameArray: []
    }
  },
  mounted: function () {
    console.log('mounted')
    const afterUrl = (window.location.hash).toString().split('?')[1]
    const params = (afterUrl).split('&')

    this.CafeteriaId = params[0].split('=')[1]
    this.nowTimeMealBool = params[1].split('=')[1]
    var axiosUrlstr1 = params[2].split('=')[1]
    var axiosUrlstr2 = params[3].split('=')[1]
    this.axiosUrl = axiosUrlstr1 + ':' + axiosUrlstr2
    console.log('读完配置', afterUrl)
    axios.defaults.baseURL = 'http://' + this.axiosUrl
    this.getFun(this.nowTimeMealBool)

    window.addEventListener('message', (msg) => {
      console.log('接收到的消息,', msg.data)
      if (msg.data === undefined) {
        return
      }
      // 原有的接受逻辑
      if (msg.data.enter == true) {
        this.enableSwitch = msg.data.enter
        this.changeSwitchValue()
      } else {
        this.bigFoodSelected.push(msg.data.foodSelected)// 把每次的菜品组塞进去
        this.bigNameArray.push(msg.data.nowOrderManName)// 把每次的人名塞进去
        if (this.bigFoodSelected[0] === undefined) {
          console.log('undefinde')
          this.bigFoodSelected.pop(undefined)
        }

        console.log('this.bigFoodSelected', this.bigFoodSelected)
        // 菜品队列小于两个往右挪
        if (this.bigFoodSelected.length <= 1) {
          // this.foodSelected2 = this.foodSelected1
          this.foodSelected1 = this.bigFoodSelected[this.bigFoodSelected.length - 1]
          this.nowOrderManName = this.bigNameArray[this.bigNameArray.length - 1]
        }

        this.isMilk2 = this.isMilk1
        this.isMilk1 = msg.data.isMilk
      }

      console.log('msg.data.timeBool', msg.data.timeBool)
      // 新增接受逻辑改变timebool更新菜品
      if (msg.data.timeBool !== undefined) {
        if (msg.data.timeBool != this.nowTimeMealBool) {
          this.nowTimeMealBool = msg.data.timeBool
          this.getFun(msg.data.timeBool)
        }
      }
      if (msg.data.nowTimeData != undefined) {
        this.getFun(msg.data.nowTimeData)
      }
      // if (msg.data != undefined) {
      //   this.switchValue = msg.data.switchValue
      // }
    })
  },
  watch: {
    switchvalue() {
      if (this.enableSwitch) {
        this.changeSwitchValue()
      }
    },
    jsonData: {
      deep: true,
      handler() {
        console.log('jsonData变了!')
      }
    }
  },

  methods: {
    async dutyTimeJudge() {
      const dateNow = new Date()
      const nowCount =
        dateNow.getHours(dateNow) * 60 + dateNow.getMinutes(dateNow)
      // /////////////////1/
      const bt = this.configDataLocal.bt.split('-')
      const bt1 =
        parseInt(bt[0].split(':')[0]) * 60 + parseInt(bt[0].split(':')[1]) - 30
      const bt2 =
        parseInt(bt[1].split(':')[0]) * 60 + parseInt(bt[1].split(':')[1]) + 30
      const lt = this.configDataLocal.lt.split('-')
      const lt1 =
        parseInt(lt[0].split(':')[0]) * 60 + parseInt(lt[0].split(':')[1]) - 30
      const lt2 =
        parseInt(lt[1].split(':')[0]) * 60 + parseInt(lt[1].split(':')[1]) + 30
      const dt = this.configDataLocal.dt.split('-')
      const dt1 =
        parseInt(dt[0].split(':')[0]) * 60 + parseInt(dt[0].split(':')[1]) - 30
      const dt2 =
        parseInt(dt[1].split(':')[0]) * 60 + parseInt(dt[1].split(':')[1]) + 30

      console.log('nowCount', nowCount)
      if (nowCount > bt1 && nowCount < bt2) {
        console.log('当前是早餐时段')
        return 'Breakfast'
      } else if (nowCount > lt1 && nowCount < lt2) {
        console.log('当前是午餐时段')
        return 'Lunch'
      } else if (nowCount > dt1 && nowCount < dt2) {
        console.log('当前是晚餐时段', dt1, dt2)
        return 'Supper'
      } else {
        console.log('当前不是用餐时段')
        this.mainLoading = false
        return 'None'
      }
    },
    popFoodSelected() {
      this.bigFoodSelected.shift()
      this.bigNameArray.shift()
      this.foodSelected2 = this.foodSelected1
      this.foodSelected1 = this.bigFoodSelected[0]
      this.nowOrderManName = this.bigNameArray[1]

      console.log('this.bigFoodSelected', this.bigFoodSelected)
    },
    readConfig() {
      // eslint-disable-next-line no-unused-vars
      var aaa = null
      fs.readFile('d:/config.json', 'utf-8', (err, data) => {
        if (err) {
          console.log('文件读取失败', err)
        } else {
          aaa = JSON.parse(data)
          this.axiosUrl = aaa.baseUrl // 关键代码
        }
      })
    },
    changeSwitchValue() {
      var cookSendData = {
        switchValue: this.switchvalue

      }
      window.opener.postMessage(cookSendData)
    },
    getNowTimeBool() {
      const jsonData = {
        getNowTimeBool: true
      }
      window.opener.postMessage(jsonData)
    },
    changeFun() {
      console.log('按开关啦！')
    },
    getTodayDate() {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    getFun(nowTimeMealBool) {
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: this.CafeteriaId,
          CookbookEnum: nowTimeMealBool,
          Datetime: this.getTodayDate()
        }
      }).then(res => {
        console.log('rrrrrrrr' + res.data.Msg)
        this.cookBook = res.data.cookbooks
        this.switchvalue = []
        console.log(res.data)
        this.cookBook.forEach(element => {
          console.log(element.id)
          this.switchvalue.push(true)
        })
        this.changeSwitchValue()
      })
    }
  }
}

</script>
<style>
.el-header,
.el-footer {
    background-color: #ecf5ff;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 2q0px;
}

.el-main {
    background-color: #fffff8;
    color: #333;
    text-align: center;
    line-height: 90px;
    height: 520px;
}

body > .el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>