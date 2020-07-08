<template>
  <div>
    <el-container v-loading="mainLoading">
      <el-header style="background-color:#ECF5FF;color:#409EFF;font-size:18px;font-weight:bold;">
        <el-col :span="3">
          <el-tag type="success"
            style="width:80%;font-size:16px">
            牛奶
            <el-switch v-model="isMilk"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-tag>
        </el-col>
        <el-col :span="17">
          <el-tag style="font-size:18px">自助点餐系统
          </el-tag>
        </el-col>

        <el-col :span="4">
          <p></p> <!-- <el-tag style="font-size:18px">早餐</el-tag> -->
        </el-col>
      </el-header>
      <el-container>
        <!-- 侧界面 -->
        <el-aside style="1ine-height:30px;background:rgb(251,251,251);position:relative;"
          width="200px">
          <el-row>
            <el-tag style="margin-top:10px;font-size:16px;width:160px;"
              type="success">已点菜单</el-tag>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="24"
              v-for="(item,index) in movieselected"
              :key="'orderdFood'+index"
              style="height:30px;margin-bottom:10px;">
              <el-tag :key="item.foodName"
                @close="handleClose(item.foodName)"
                style="font-size:16px;width:160px;"
                closable
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row>

          <el-row style="position:absolute;bottom:0px;width:100%;">
            <el-button type="danger"
              style="width:100%;height:60px;font-size:18px"
              @click="endOrder">
              结算
            </el-button>
          </el-row>

        </el-aside>
        <el-container>
          <!-- <el-header>Header</el-header> -->
          <!-- 主界面 -->
          <el-main style="line-height:50px;background:white;">
            <el-row>
              <el-col v-for="(item,index) in movie"
                :key="'noorderdFood'+index"
                :span="6">
                <el-button type="primary"
                  round
                  plain
                  class="buttonclass"
                  :disabled="!switchValue[index]"
                  @click="addFun(item.Name,item.Price,item.PcPrice,item.Id)">
                  <el-row>
                    <el-col :span="24"
                      style="font-size:16px;font-weight:bold">
                      {{item.Name}}
                    </el-col>
                  </el-row>
                  <el-row style="margin-top:6px">
                    <el-tag type="success"> 价格：{{item.Price}}</el-tag>
                  </el-row>
                  <el-row style="margin-top:10px">
                    <el-tag type="warning"> 价格：{{item.PcPrice}}</el-tag>
                  </el-row>
                </el-button>
              </el-col>
            </el-row>
          </el-main>
          <el-footer style="background-color:#ECF5FF;">
            <el-row>
              <el-col :span="12">
                <el-tag style="font-size:18px">当前点餐人：{{nowOrderManName}}</el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag style="font-size:18px">当前余额：{{nowOrderManLeftMoney}}元</el-tag>
              </el-col>
              <el-col :span="1">
                <el-button @click="settingPageBool=true"
                  style="margin-right:-140px">
                  <i class="el-icon-s-tools"></i>
                </el-button>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <!-- 点餐进入窗口 -->
    <el-dialog title="自助点餐系统"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      center
      :close-on-click-modal='false'
      :close-on-press-escape='false'>
      <el-row style="text-align:center;font-size:18px;">
        点击按钮进入点餐
      </el-row>
      <span slot="footer"
        class="dialog-footer">
        <el-row>
          <el-col :span="24">
            <el-button type="primary"
              style="width:80%  "
              @click="enterOrder">
              进入
            </el-button>
          </el-col>

        </el-row>
      </span>
    </el-dialog>
    <!-- 设置窗口 -->
    <el-dialog title="设置"
      :visible.sync="settingPageBool"
      width="30%"
      :show-close="false"
      center
      :close-on-click-modal='false'
      :close-on-press-escape='false'>
      <el-row style="text-align:center;font-size:18px;"
        v-for="(item,index) in configData"
        :key="'config'+index">
        <el-col :span="12"
          style="margin-left:-20px">
          <el-tag style="width:120px">{{index}}</el-tag>
        </el-col>
        <el-col :span="12">
          <el-input :value="item"
            v-model="configData[index]"></el-input>
        </el-col>
      </el-row>
      <span slot="footer"
        class="dialog-footer">
        <el-row>
          <el-col :span="24">
            <el-button type="primary"
              style="width:80%  "
              @click="saveSetting">
              保存设置
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import fs from 'fs'
import localConfig from 'd:/config.json'
// var localConfig = require('D:/config.json')

Vue.prototype.$ajax = axios

export default {
  data: function () {
    return {
      settingPageBool: false,
      dialogVisible: true,
      movieselected: [],
      show2: true,
      mainLoading: false,
      allsum: parseFloat(0),
      movie: [],
      nowTimeMealBool: '',
      getMeadlId: '', // 当前餐次id
      freeBFPrice: 8, // 早餐全免金额
      maxBFPrice: 12, // 早餐优惠金额
      freeDNPrice: 0, // 午晚餐优惠金额
      freeFoodNum: 4, // 中晚餐优惠价菜品数量
      SNid: localConfig.snNumber,
      configData: localConfig, // 设备号
      nowOrderManName: '',
      nowOrderManLeftMoney: 0,
      informationNum: '',
      switchValue: [true, true],
      childWin: null,
      isFirstTime: true,
      isMilk: false, // isMilk确认是否点牛奶，isFirstMilk确认这个人之前是否点过牛奶
      isFirstMilk: false,
      milkPrice: 5,
      configDataLocal: localConfig,
      configTitles: ['早餐时间', '午餐时间', '晚餐时间', '设备号', '餐厅id', '服务器url']
    }
  },
  created: function () {
    // 读取配置文件
    this.readConfig()
    this.getMilkPrice()
    // eslint-disable-next-line no-unused-vars
    // window.sonWindow = window.open('/#/cook')
    console.log('当前主页位置：', window.location.host)
    this.nowTimeMealBool = this.timeJudge()
    var urlstr = axios.defaults.baseURL.split('http://')[1]
    urlstr = urlstr.split(':')
    // + '&url=' + window.location.origin
    this.childWin = window.open(window.location.href + 'cook?CafeteriaId=' + this.configDataLocal.CafeteriaId + '&timeBool=' + this.timeBoolChange(this.nowTimeMealBool) + '&axiosUrl=' + urlstr[0] + '&axiosPort=' + urlstr[1])

    window.addEventListener('message', (msg) => {
      console.log('接收到的消息,', msg.data)
      if (msg.data != undefined) {
        this.switchValue = msg.data.switchValue
      }
    })
  },
  watch: {
    allsum() {
      console.log('al1sum变了！！！')
    }
    // jsonData: {
    //   deep: true,
    //   handler() {
    //     console.log('jsonData变了！')

    //     // h console.1og("jsonData变了！");
    //   }
    // }
  },

  methods: {

    test2() {
    },
    getMilkPrice() {
      axios.get('Interface/Common/GetMilkPrice.ashx').then(res => {
        console.log(res)
      })
    },
    readConfig() {
      var aaa = null
      fs.readFile('d:/config.json', 'utf-8', (err, data) => {
        if (err) {
          console.log('文件读取失败', err)
        } else {
          aaa = JSON.parse(data)
          console.log(aaa)
          this.configData.bt = aaa.bt
          this.configData.lt = aaa.lt
          this.configData.dt = aaa.dt
          this.configData.snNumber = aaa.snNumber
          this.configData.CafeteriaId = aaa.CafeteriaId
          this.configData.baseUrl = aaa.baseUrl
          // var loadConfig = JSON.parse(data)
          axios.defaults.baseURL = this.configData.baseUrl // 关键代码
        }
      })

      console.log('本地配置：', aaa)
    },
    saveSetting() {
      console.log(this.configDataLocal)
      fs.writeFile('D:/config.json', JSON.stringify(this.configDataLocal), err => {
        if (err) {
          alert(err)
          console.log('write file error!')
        } else {
          console.log('add note successfully!')
          this.$message.success('保存设置成功')
        }
      })
      this.settingPageBool = false
      // console.log('this.settingPageBool', this.settingPageBool)
    },
    priceCalculate(arrItem) {
      // eslint-disable-next-line no-unused-vars
      var sum = 0
      arrItem.forEach(element => {
        sum += parseFloat(element.yprice)
      })
      return sum
    },
    // 时间判断函数
    timeJudge() {
      var dateNow = new Date()
      var nowCount =
        dateNow.getHours(dateNow) * 60 + dateNow.getMinutes(dateNow)
      // /////////////////1/
      var bt = this.configData.bt.split('-')
      var bt1 =
        parseInt(bt[0].split(':')[0]) * 60 + parseInt(bt[0].split(':')[1])
      var bt2 =
        parseInt(bt[1].split(':')[0]) * 60 + parseInt(bt[1].split(':')[1])
      var lt = this.configData.lt.split('-')
      var lt1 =
        parseInt(lt[0].split(':')[0]) * 60 + parseInt(lt[0].split(':')[1])
      var lt2 =
        parseInt(lt[1].split(':')[0]) * 60 + parseInt(lt[1].split(':')[1])
      var dt = this.configData.dt.split('-')
      var dt1 =
        parseInt(dt[0].split(':')[0]) * 60 + parseInt(dt[0].split(':')[1])
      var dt2 =
        parseInt(dt[1].split(':')[0]) * 60 + parseInt(dt[1].split(':')[1])
      // var lt = this.configData.1t.split("-");
      // var dt = this.configData.dt.split("-");
      console.log('nowCount', nowCount)
      if (nowCount > bt1 && nowCount < bt2) {
        console.log('当前是早餐时段')
        return 'bt'
      } else if (nowCount > lt1 && nowCount < lt2) {
        console.log('当前是午餐时段')
        return 'lt'
      } else if (nowCount > dt1 && nowCount < dt2) {
        console.log('当前是晚餐时段', dt1, dt2)
        return 'dt'
      } else {
        console.log('当前不是用餐时段')
        this.$message.error('当前不是用餐时段')
        return 'None'
      }
    },
    endOrder() {
      // 优惠计算后价格
      // eslint-disable-next-line no-unused-vars
      var ypriceSum = 0
      console.log('nowBool:' + this.nowTimeMealBool)
      // 先判断是哪一餐
      switch (true) {
        case this.nowTimeMealBool == 'bt':
          console.log('结算早餐')
          console.log('当前总价：' + this.pricecalculate(this.movieselected))
          var priceSum = parseFloat(this.pricecalculate(this.movieselected))
          switch (true) {
            case priceSum <= this.freeBFPrice:
              ypriceSum = 0
              console.log('全部免费')
              break
            case priceSum > this.freeBFPrice && priceSum < this.maxBFPrice:
              ypriceSum = priceSum - this.freeBFPrice
              console.log('扣你部分钱')
              break
            default:
              console.log('ss')
              break
          }
          break
        // //////////计算午晚餐价格///////////////////
        case this.nowTimeMealBool == 'lt' || this.nowTimeMealBool == 'dt':
          console.log('结算午晚餐')
          this.movieSelected = this.movieselected.sort(sortby)
          switch (true) {
            // //////大于四个菜////////////
            case this.movieSelected.length > this.freeFoodNum:
              console.log('大于4个菜')
              this.movieSelected.forEach((element, index) => {
                if (index <= this.freeFoodNum - 1) {
                  ypriceSum += element.yprice
                } else {
                  ypriceSum += element.price
                }
              })

              break
            // //////小于四个菜//////////
            default:
              console.log('小于四个菜')
              this.movieSelected.forEach(element => {
                ypriceSum += element.yprice
              })

              break
          }

          console.log('午晚餐总价格:', ypriceSum)
          var payPrice = parseFloat(ypriceSum) - parseFloat(this.freeDNPrice)
          console.log('扣费后价格：', payPrice)
          // 小于免费金额的化为免费，价格0
          if (payPrice < 0) { payPrice = 0 }
          // 总价减去免费金额10元

          // 价格加上牛奶价格
          if (this.isMilk) {
            payPrice += parseFloat(this.milkPrice)
          }
          // 判断扣费后是否足够钱
          if (parseFloat(this.nowOrderManLeftMoney) - payPrice < 0) {
            this.$message.error('抱歉~您的余额不足')
          }

          this.allsum = payPrice.toFixed(2)

          this.$confirm('此餐消费金额为' + this.allsum + '元,确认提交吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 确定
            console.log('确定')
            this.mainLoading = true
            this.submitFun()
            this.sendMenuMeg()
            this.mainLoading = false
            // 开启遮罩层
            this.dialogVisible = true
            this.nowOrderManName = ''
            this.nowOrderManLeftMoney = parseFloat(0)
          }).catch(() => {
            // 取消
            console.log('取消')
          })
          break
        // ////////////////////////////////
        default:
          console.log('其他时间')
          break
      }
      function sortby(a, b) {
        return b.yprice - a.yprice
      }
    },
    sendMenuMeg() {
      this.fatherDataSend(false, this.movieselected, this.isMilk)
      this.movieselected = []
    },
    timeBoolChange(booltime) {
      switch (booltime) {
        case 'bt':

          return 'Breakfast'

        case 'lt':

          return 'Lunch'
        case 'dt':

          return 'Supper'
        default:
          break
      }
    },
    fatherDataSend(boolValue, foodSelected, isMilk) {
      var fatherData = {
        enter: boolValue,
        foodSelected: foodSelected,
        isMilk: isMilk
      }
      this.childWin.postMessage(fatherData)
    },
    enterOrder() {
      this.mainLoading = true
      this.isMilk = false
      this.fatherDataSend(true)
      // 请求是否在排餐时段
      var inOrderTimeBool = this.timeJudge()
      if (inOrderTimeBool != 'None') {
        this.nowTimeMealBool = inOrderTimeBool
        // 请求对应排餐和排餐id
        this.clickFun()
        // 获取当前人员人脸信息
        axios.get('/Interface/Common/GetUserData.ashx', {
          params: {
            sn: 'C01', // this.SNid,
            cookbookSetInDateId: '5'// this.getMeadlId
          }
        }).then(res => {
          console.log(res.data)
          this.freeBFPrice = res.data.CategoryPreferential.BreakfastFree// 早餐全免金额
          this.maxBFPrice = res.data.CategoryPreferential.BreakfastPreferential // 早餐优惠金额
          this.freeDNPrice = res.data.CategoryPreferential.LunchSupperPreferential// 午晚餐优惠金额
          this.freeFoodNum = res.data.CategoryPreferential.LunchSupperPreferentialCookbookCount// 中晚餐优惠价菜品数量
          this.nowOrderManName = res.data.PcInfo.Name
          this.informationNum = res.data.PcInfo.InformationNum
          this.nowOrderManLeftMoney = res.data.PcInfo.Amount
          this.isFirstTime = true// res.data.IsFristOrderMeal
          this.isFirstMilk = res.data.isFirstMilk
        })
        this.mainLoading = false
        this.dialogVisible = false
      }
    },
    // 处理点菜品取消×函数
    handleClose(foodName) {
      console.log('tag-key:', this.movieselected.findIndex(value => value.foodName == foodName))
      this.movieselected.splice(
        this.movieselected.findIndex(value => value.foodName == foodName),
        1
      )
    },
    // 支付成功提示
    successNotice() {
      this.$notify({
        title: '成功',
        message: '支付成功',
        type: 'success'
      })
    },

    // 添加菜品方法
    addFun(nameIn, price, yprice, foodId) {
      const jsonData = {
        foodName: '',
        price: '',
        yprice: '',
        foodId: ''
      }
      if (this.isFirstTime) {
        if (this.movieselected.findIndex(value => value.foodName === nameIn) === -1) {
          jsonData.foodName = nameIn
          jsonData.price = price
          jsonData.yprice = yprice
          jsonData.foodId = foodId
          this.movieselected.push(jsonData)
          console.log(this.movieselected)
        } else {
          this.$message.error('优惠价只可点一份')
        }
      } else {
        if (this.movieselected.length <= 12) {
          jsonData.foodName = nameIn
          jsonData.price = price
          jsonData.yprice = yprice
          jsonData.foodId = foodId
          this.movieselected.push(jsonData)
        } else {
          this.$message.error('抱歉，您点的菜品数量过多')
        }
      }
    },
    getFoodsIds() {
      var allIds = ''
      this.movieselected.forEach(element => {
        allIds += element.foodId + ','
      })
      return allIds.substring(0, allIds.length - 1)
    },
    submitFun() {
      axios.get('/Interface/Synchronize/BuffetSynchronize.ashx', {
        params: {
          informationNum: this.informationNum, // this.informationNum,
          cookbookSetInDateId: this.getMeadlId,
          cookbookIds: this.getFoodsIds(),
          isMilk: this.isMilk,
          createDate: this.getTodayDate()
        }
      }).then(res => {
        console.log('clickfun:', res)
      })
    },
    // 获取菜单
    clickFun() {
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: this.configDataLocal.CafeteriaId,
          CookbookEnum: this.timeBoolChange(this.nowTimeMealBool),
          Datetime: this.getTodayDate()
        }
      }).then(res => {
        this.movie = res.data.cookbooks
        this.getMeadlId = res.data.cookbookSetInDate.Id
        this.switchValue = []
        this.movie.forEach(element => {
          this.switchValue.push(true)
        })
      })
    },
    // 获取当天年月日
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
    }
  }
}
</script>

<style>
.buttonclass {
    font: Jwhite;
    width: 180px;
}
</style>

<style>
.el-header {
    background: rgb(236, 245, 255);
}
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
    line-height: 35px;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
    height: 900px;
}

body > .el-container {
    margin-bottom: 40px;
    /* height: 1080px; */
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>