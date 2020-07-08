<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="200px"
          style="background:#FBFBFB;position:relative">
          <el-row style="margin-top:10px">
            <el-tag type="success"
              style="width:200px">
              本次菜品
            </el-tag>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="24"
              v-for="(item,index) in foodSelected1"
              :key="'orderdFood'+index"
              style="height:30px;margin-bottom:10px;">
              <el-tag :key="item.foodName"
                style="font-size:16px;width:160px;"
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="position:absolute;bottom:0;">
            <el-tag style="margin-left:42px;margin-bottom:10px;width:100px;font-size:18px">
              {{isMilk1?'有牛奶':'无牛奶'}}
            </el-tag>
          </el-row>
        </el-aside>
        <el-aside width="200px"
          style="background:#FEFAFF;margin-left:5px;margin-right:5px;position:relative">
          <el-row style="margin-top:10px">
            <el-tag type="warning"
              style="width:200px">
              上次菜品
            </el-tag>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="24"
              v-for="(item,index) in foodSelected2"
              :key="'orderdFood2'+index"
              style="height:30px;margin-bottom:10px;">
              <el-tag :key="item.foodName"
                style="font-size:16px;width:160px;"
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="position:absolute;bottom:0;">
            <el-tag style="margin-left:42px;margin-bottom:10px;width:100px;font-size:18px">
              {{isMilk2?'有牛奶':'无牛奶'}}
            </el-tag>
          </el-row>
        </el-aside>
        <el-container>
          <el-header>
            <el-tag type=" primary"
              style="font-size:18px;width:200px">
              内部员工界面
            </el-tag>
          </el-header>
          <el-main>
            <el-row>
              <el-col v-for="(item,index) in cookBook"
                :key="item.index"
                :span="6">
                <el-tag style="font-size:16px;height:64px;width:140px">
                  <el-row>{{item.Name}}</el-row>
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
      foodSelected1: [],
      foodSelected2: [],
      isMilk1: false,
      isMilk2: false,
      CafeteriaId: '',
      nowTimeMealBool: '',
      axiosUrl: ''
    }
  },
  mounted: function () {
    const afterUrl = (window.location.hash).toString().split('?')[1]
    const params = (afterUrl).split('&')

    this.CafeteriaId = params[0].split('=')[1]
    this.nowTimeMealBool = params[1].split('=')[1]
    var axiosUrlstr1 = params[2].split('=')[1]
    var axiosUrlstr2 = params[3].split('=')[1]
    this.axiosUrl = axiosUrlstr1 + ':' + axiosUrlstr2
    alert(this.axiosUrl)
    axios.defaults.baseURL =
      this.getFun()
    window.addEventListener('message', (msg) => {
      console.log('接收到的消息,', msg.data)
      if (msg.data.enter) {
        this.enableSwitch = msg.data.enter
      }
      this.foodSelected2 = this.foodSelected1
      this.foodSelected1 = msg.data.foodSelected
      this.isMilk2 = this.isMilk1
      this.isMilk1 = msg.data.isMilk
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
    getFun() {
      alert('id+bool' + this.CafeteriaId + 'bool' + this.nowTimeMealBool)
      alert('axios.defaults.baseURL', axios.defaults.baseURL)
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: this.CafeteriaId,
          CookbookEnum: this.nowTimeMealBool,
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
    line-height: 160px;
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