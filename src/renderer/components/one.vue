<template>
  <div>
    <el-container v-loading="load">
      <el-header style="background-color:#ECF5FF;color:#409EFF;font-size:18px;font-weight:bold;">
        <el-col :span="4">456</el-col>
        <el-col :span="16">
          <el-tag style="font-size:18px">自助点餐系统 <el-button @click="test">ssssss</el-button>
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
      switchValue: [true],
      childWin: null
    }
  },
  mounted: function () {
    // eslint-disable-next-line no-unused-vars
    // window.sonWindow = window.open('/#/cook')
    window.addEventListener('message', (msg) => {
      console.log('接收到的消息,', msg.data)
      if (msg.data != undefined) {
        this.switchValue = msg.data.switchValue
      }
    })

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
          var payPrice = parseFloat(ypriceSum) - this.freeDNPrice
          console.log('扣费后价格：', payPrice)
          if (payPrice > 0) {
            this.submitFun()
          } else {
            payPrice = 0
          }
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
    enterOrder() {
      this.childWin = window.open('/#/cook')
      this.childWin.postMessage('父窗口发送消息')
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
          this.freeBFPrice = res.data.CategoryPreferential.BreakfastFree// 早餐全免金额
          this.maxBFPrice = res.data.CategoryPreferential.BreakfastPreferential // 早餐优惠金额
          this.freeDNPrice = res.data.CategoryPreferential.LunchSupperPreferential// 午晚餐优惠金额
          this.freeFoodNum = res.data.CategoryPreferential.LunchSupperPreferentialCookbookCount// 中晚餐优惠价菜品数量
          this.nowOrderManName = res.data.PcInfo.Name
          this.informationNum = res.data.PcInfo.InformationNum
          this.nowOrderManLeftMoney = res.data.PcInfo.Amount

          // this.getMeadlId = res.data.
          console.log('enterfun:', res)
          console.log('取得菜品:', res.data.cookbooks[0].Name)
          console.log('取得价格:', res.data.cookbooks[0].Price)
        })

        // //////模拟取人是否有资格点餐
        // axios.get("http://127.0.0.1:5000/api").then(res =>{
        // this.movie = res.data.data;
        // });
        // 设置当前人员的优惠价格

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
          this.switchValue.push(false)
        })
        console.log('clickfun:', res)
        console.log('取得菜品:', res.data.cookbooks[0].Name)
        console.log('取得价格:', res.data.cookbooks[0].Price)
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