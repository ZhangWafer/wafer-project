<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="6">sss
          </el-col>
          <el-col :span="6">sss
          </el-col>
          <el-col :span="6">sss
          </el-col>
          <el-col :span="6">sss
            <el-button @click="getConfig()">22222222</el-button>
          </el-col>
        </el-row>
      </el-main>
      <div> 2311 </div>
      <el-footer>
        <el-col :span="12">
          当前点餐人：{{orderManNow}}
        </el-col>
        <el-col :span="12">
          当前余额：{{money}}元
        </el-col>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
import fs from 'fs'
var { remote } = require('electron')

axios.defaults.baseURL = 'http://localhost:7878' // 关键代码
// axios.defaults.baseURL = 'http://119.146.191.58:7030/'

export default {
  data: function () {
    return {
      orderManNow: '',
      money: '88.88'
    }
  },
  mounted() {
    // this.getConfig()
  },
  methods: {
    getConfig() {
      remote.dialog.showMessageBox({
        type: 'info',
        title: 'message',
        message: 'hello',
        buttons: ['ok', 'cancel']
      }, (index) => {
        if (index === 0) {
          console.log('You click ok.')
        } else {
          console.log('You click cancel')
        }
      })
      const file = process.cwd() + '/config.json' // 文件路径
      fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
          console.log(err)// eslint-disable-line
        } else {
          console.log(data)// eslint-disable-line
        }
      })
    },
    // 取菜品接口
    getCanteenFood() {
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: '16',
          CookbookEnum: 'Lunch',
          Datetime: '2020-06-4'
        }
      }).then(res => {
        console.log(res)
        console.log('取得菜品:', res.data.cookbooks[0].Name)
        console.log('取得价格:', res.data.cookbooks[0].Price)
      })
    },
    // 取个人信息接口
    getThing(apistr, info) {
      // 发送 POST 请求
      axios.get(apistr, {
        params: {
          informationNum: info
        }
      }).then(res => {
        console.log(res.data.pcInfo)
        this.orderManNow = res.data.pcInfo.Name
        console.log('orderManNow:', this.orderManNow)
      })
    }
  }
}

</script>

<style>
.el-header,
.el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #e9eef3;
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