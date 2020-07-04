<template>
  <div>
    <el-container v-loading="load">
      <el-header style="background-color:#ECF5FF;color:#409EFF;font-size:18px;font-weight:bold;">
        <el-col :span="4">
          <el-tag type="success"
            style="margin-left:-70px;width:120px;font-size:16px">
            牛奶
            <el-switch v-model="isMilk"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-tag>
        </el-col>
        <el-col :span="16">
          <el-tag style="font-size:18px">自助点餐系统
          </el-tag>
        </el-col>

        <el-col :span="4">
          <el-tag style="font-size:18px">早餐</el-tag>
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
              style="width:100%;height:60px"
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
                <el-tag style="font-size:16px">当前点餐人：{{nowOrderManName}}</el-tag>
              </el-col>
              <el-col :span="12">
                <el-tag style="font-size:16px">当前余额：{{nowOrderManLeftMoney}}元</el-tag>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog title="自助点餐系统"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      center
      :before-close="handleClose">
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
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'

// import { ipcMain } from 'electron'
axios.defaults.baseURL = 'http://localhost:7878' // 关键代码

Vue.prototype.$ajax = axios

export default {
  data: function () {
    return {
      dialogVisible: true,
      movieselected: [],
      show2: true,
      load: false,
      allsum: 0,
      movie: [],
      nowTimeMealBool: '',
      getMeadlId: '', // 当前餐次id
      freeBFPrice: 8, // 早餐全免金额
      maxBFPrice: 12, // 早餐优惠金额
      freeDNPrice: 18, // 午晚餐优惠金额
      freeFoodNum: 4, // 中晚餐优惠价菜品数量
      SNid: window.configData.snNumber,
      configData: window.configData, // 设备号
      nowOrderManName: '',
      nowOrderManLeftMoney: 0,
      informationNum: '',
      switchValue: [true, true],
      childWin: null,
      isFirstTime: true,
      isMilk: false, // isMilk确认是否点牛奶，isFirstMilk确认这个人之前是否点过牛奶
      isFirstMilk: false
    }
  },
  mounted: function () {
    // eslint-disable-next-line no-unused-vars
    // window.sonWindow = window.open('/#/cook')
    console.log('当前主页位置：', window.location.href)
    this.childWin = window.open(window.location.href + 'cook')

    window.addEventListener('message', (msg) => {
      console.log('接收到的消息,', msg.data)
      if (msg.data != undefined) {
        this.switchValue = msg.data.switchValue
      }
    })
    // window.open('/#/cook')
    // ipcMain.on('send-msg-to-main', (event, args) => {
    //   console.log('主进程接收到的数据', args)
    //   event.reply('send-msg-to-render', '这是主进程的问候')
    // })
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
    confirmPrice() {
      this.$confirm('此餐消费金额为' + this.allsum + '元,确认提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    },
    test() {
      this.childWin.postMessage('父窗口发送消息')
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
      console.log(nowCount)
      if (nowCount > bt1 && nowCount < bt2) {
        console.log('当前是早餐时段')
        return 'bt'
      } else if (nowCount > lt1 && nowCount < lt2) {
        console.log('当前是午餐时段')
        return 'lt'
      } else if (nowCount > dt1 && nowCount < dt2) {
        console.log('当前是晚餐时段')
        return 'lt'
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
              this.sendMenuMeg()
              // if (this.confirmPrice()) {
              //   this.$message({
              //     type: 'success',
              //     message: '消费成功!'
              //   })
              //   this.sendMenuMeg()
              // } else {
              //   this.$message({
              //     type: 'info',
              //     message: '已取消'
              //   })
              // }

              break
            // //////小于四个菜//////////
            default:
              console.log('小于四个菜')
              this.movieSelected.forEach(element => {
                ypriceSum += element.yprice
              })
              this.sendMenuMeg()
              // if (this.confirmPrice()) {
              //   console.log('按确定')
              //   this.$message({
              //     type: 'success',
              //     message: '消费成功!'
              //   })
              //
              // } else {
              //   console.log('按取消')
              //   this.$message({
              //     type: 'info',
              //     message: '已取消'
              //   })
              // }
              break
          }
          console.log('午晚餐总价格:', ypriceSum)
          var payPrice = parseFloat(ypriceSum) - this.freeDNPrice
          console.log('扣费后价格：', payPrice)
          // 小于免费金额的化为免费，价格0
          if (payPrice < 0) { payPrice = 0 }

          if (this.nowOrderManLeftMoney - payPrice >= 0) {
            this.submitFun()
          } else {
            this.$message.error('抱歉~您的余额不足')
          }
          this.allsum = payPrice
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
          this.isFirstTime = res.data.IsFristOrderMeal
          this.isFirstMilk = res.data.isFirstMilk
        })
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
        allIds += element.Id + ','
      })
      return allIds.substring(0, allIds.length - 1)
    },
    submitFun() {
      axios.get('/Interface/Synchronize/BuffetSynchronize.ashx', {
        params: {
          informationNum: '66666666666', // this.informationNum,
          cookbookSetInDateId: this.getMeadlId,
          cookbookIds: this.getFoodsIds(),
          isMilk: 'false',
          createDate: '2020-06-27'
        }
      }).then(res => {
        console.log('clickfun:', res)
      })
    },
    // 获取菜单
    clickFun() {
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: '16',
          CookbookEnum: 'Lunch',
          Datetime: '2020-06-4'
        }
      }).then(res => {
        this.movie = res.data.cookbooks
        this.getMeadlId = res.data.cookbookSetInDate.Id
        this.switchValue = []
        this.movie.forEach(element => {
          this.switchValue.push(true)
        })
      })
    }
  }
}
</script>

<style>
.buttonclass {
    font: Jwhite;
    width: 140px;
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
    height: 600px;
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