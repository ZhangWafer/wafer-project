<template>
  <div>
    <el-container v-loading="mainLoading">
      <el-header style="background-color:#ECF5FF;color:#409EFF;font-size:18px;font-weight:bold;">
        <el-col :span="20">
          <el-tag :v-if="false"
            style="font-size:22px;width:200px;border:None">
          </el-tag>
        </el-col>

        <el-col :span="4">
          <p></p> <!-- <el-tag style="font-size:18px">早餐</el-tag> -->
        </el-col>
      </el-header>
      <el-container>
        <!-- 侧界面 -->
        <el-aside style="1ine-height:30px;background:rgb(251,251,251);position:relative;"
          width="280px">
          <el-row>
            <el-tag style="margin-top:10px;font-size:22px;width:200px;"
              type="success">已点菜单</el-tag>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="24"
              v-for="(item,index) in movieselected"
              :key="'orderdFood'+index"
              style="height:30px;margin-bottom:18px;">
              <el-tag :key="item.foodName"
                @close="handleClose(item.foodName)"
                style="font-size:22px;width:220px;font-weight:bold"
                closable
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24"
              v-for="(item,index) in milkSelected"
              :key="'milk'+index"
              style="height:30px;margin-bottom:18px;">
              <el-tag :key="item.foodName"
                @close="handleMilkClose()"
                style="font-size:22px;width:220px;font-weight:bold"
                closable
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row>

          <el-row style="position:absolute;bottom:0px;width:100%;">
            <el-button type="danger"
              style="width:100%;height:100px;font-size:24px"
              @click="endOrder">
              结算
            </el-button>
          </el-row>

        </el-aside>
        <el-container>
          <!-- <el-header>Header</el-header> -->
          <!-- 主界面 -->
          <el-main style="line-height:36px;background:white;">
            <el-row>
              <el-col :span="4.8"
                style="margin-left:8px;">
                <el-button type="primary"
                  plain
                  round
                  v-if="this.configDataLocal.milkMachine=='true'?true:false"
                  class="buttonclass"
                  @click="addMilkFun()">
                  <el-row>
                    <el-image style="width: 120px; height: 60px"
                      :src="mikPic"></el-image>
                  </el-row>

                  <el-row style="margin-top:6px">
                    <el-col :span="24">
                      <el-tag style="font-size:22px;font-weight:bold"> 牛奶</el-tag>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top:6px;margin-left:-18px">
                    <el-col :span="12">
                      <el-tag type="success"> 价格：{{this.milkPrice}}</el-tag>
                    </el-col>

                    <el-col :span="12">
                      <el-tag type="warning"> 优惠价格：0</el-tag>
                    </el-col>
                  </el-row>
                </el-button>
              </el-col>
              <el-col v-for="(item,index) in movie"
                :key="'noorderdFood'+index"
                :span="4.8"
                style="margin-left:8px">
                <el-button type="primary"
                  round
                  plain
                  class="buttonclass"
                  :disabled="!switchValue[index]"
                  @click="addFun(item.Name,item.Price,item.PcPrice,item.Id)">
                  <div style="">
                    <el-row>
                      <el-image style="width: 120px; height: 60px"
                        :src="item.Icon"></el-image>
                    </el-row>
                    <el-row style="margin-top:6px">
                      <el-col :span="24">
                        <el-tag :style="item.Name.length>6?'font-size:18px;font-weight:bold':'font-size:22px;font-weight:bold'"> {{item.Name}}</el-tag>
                      </el-col>
                    </el-row>
                    <el-row :style="item.Price.length+item.PcPrice.length<4?'margin-top:6px;margin-left:-10px':'margin-top:6px;margin-left:-18px'">
                      <el-col :span="12">
                        <el-tag type="success"> 价格：{{item.Price}}</el-tag>
                      </el-col>
                      <el-col :span="12">
                        <el-tag type="warning"> 优惠价格：{{item.PcPrice}}</el-tag>
                      </el-col>
                    </el-row>
                  </div>
                </el-button>
              </el-col>
            </el-row>
          </el-main>
          <el-footer style="background-color:#ECF5FF;height:100px">
            <el-row style="margin-top:26px">
              <el-col :span="9">
                <el-tag style="font-size:22px">当前点餐人：{{nowOrderManName}}</el-tag>
              </el-col>
              <el-col :span="4">
                <el-button style="width:160px;height:70px;margin-top:-10px;vertical-align:middle;"
                  type="danger"
                  round
                  @click="exitOrderFood">
                  退出
                </el-button>
              </el-col>
              <el-col :span="9">
                <el-tag style="font-size:22px">当前余额：{{nowOrderManLeftMoney}}元</el-tag>
              </el-col>
              <el-col :span="2">
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
              @click="enterOrder()">
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
        v-for="(item,index) in configDataLocal"
        :key="'config'+index">
        <el-col :span="12"
          style="margin-left:-20px">
          <el-tag style="width:120px">{{index}}</el-tag>
        </el-col>
        <el-col :span="12">
          <el-input :value="item"
            v-model="configDataLocal[index]"></el-input>
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
import niunaiPic from '../assets/niunainai.jpg'
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
      nowOrderManName: '',
      nowOrderManLeftMoney: 0,
      informationNum: '',
      switchValue: [true, true],
      childWin: null,
      isFirstTime: true,
      isMilk: false, // isMilk确认是否点牛奶，isFirstMilk确认这个人之前是否点过牛奶
      isFirstMilk: 'false',
      milkPrice: 4.5,
      milkSelected: [],
      configDataLocal: {
        bt: '',
        lt: '',
        dt: '',
        snNumber: '',
        CafeteriaId: '',
        baseUrl: '',
        milkMachine: ''
      },
      configTitles: ['早餐时间', '午餐时间', '晚餐时间', '设备号', '餐厅id', '服务器url'],
      urlStr: [],
      noMoneyBool: false,
      mikPic: niunaiPic,
      faceTime: '',
      faceId: '',
      createDate: '',
      isDutyVaild: false
    }
  },
  created: function () {
    console.log('created')
  },
  async mounted() {
    console.log('mounted')

    // eslint-disable-next-line no-unused-vars
    // window.sonWindow = window.open('/#/cook')

    // 读取配置文件
    this.readConfig()

    // this.childWin = window.open('/#/cook')
    // // 取牛奶价格
    this.getMilkPrice()

    window.addEventListener('message', (msg) => {
      console.log('接收到的消息,', msg.data)
      if (msg.data != undefined) {
        this.switchValue = msg.data.switchValue
      }
    })
  },
  updated() {
    console.log('updated')
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
    exitOrderFood() {
      this.milkSelected = []
      this.movieselected = []
      this.dialogVisible = true
    },
    addMilkFun() {
      const milkJsonData = {
        foodName: '牛奶',
        price: this.milkPrice,
        yprice: '0.00',
        foodId: ''
      }
      if (!this.isFirstMilk) {
        if (this.milkSelected.length == 1) {
          this.$message.error('优惠价只可点一份')
        } else {
          this.milkSelected.push(milkJsonData)
        }
      } else {
        this.milkSelected.push(milkJsonData)
      }
    },
    getMilkPrice() {
      axios.get('Interface/Common/GetMilkPrice.ashx').then(res => {
        this.milkPrice = res.data.Price
      })
    },
    readConfig() {
      console.log('开始读config')
      let aaa = null
      fs.readFile('d:/config.json', 'utf-8', (err, data) => {
        if (err) {
          console.log('文件读取失败', err)
        } else {
          aaa = JSON.parse(data)
          console.log('本地配置：', aaa)
          this.configDataLocal.bt = aaa.bt
          this.configDataLocal.lt = aaa.lt
          this.configDataLocal.dt = aaa.dt
          this.configDataLocal.snNumber = aaa.snNumber
          this.configDataLocal.CafeteriaId = aaa.CafeteriaId
          this.configDataLocal.baseUrl = aaa.baseUrl
          this.configDataLocal.milkMachine = aaa.milkMachine
          // 拆分当前url
          console.log('this.configDataLocal.baseUrl', this.configDataLocal.baseUrl)
          console.log('读完config')
          // 设置axios-url
          axios.defaults.baseURL = this.configDataLocal.baseUrl
          this.nowTimeMealBool = this.timeJudge()

          this.urlStr[0] = this.configDataLocal.baseUrl.split('http://')[1].split(':')[0]
          this.urlStr[1] = this.configDataLocal.baseUrl.split('http://')[1].split(':')[1]
          this.childWin = window.open(window.location.href + 'cook?CafeteriaId=' + this.configDataLocal.CafeteriaId + '&timeBool=' + this.timeBoolChange(this.nowTimeMealBool) + '&axiosUrl=' + this.urlStr[0] + '&axiosPort=' + this.urlStr[1])
        }
      })
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
    },
    priceCalculate(arrItem) {
      // eslint-disable-next-line no-unused-vars
      let sum = 0
      arrItem.forEach(element => {
        sum += parseFloat(element.yprice)
      })
      return sum
    },
    // 时间判断函数
    async timeJudge() {
      const dateNow = new Date()
      const nowCount =
        dateNow.getHours(dateNow) * 60 + dateNow.getMinutes(dateNow)
      // /////////////////1/
      const bt = this.configDataLocal.bt.split('-')
      const bt1 =
        parseInt(bt[0].split(':')[0]) * 60 + parseInt(bt[0].split(':')[1])
      const bt2 =
        parseInt(bt[1].split(':')[0]) * 60 + parseInt(bt[1].split(':')[1])
      const lt = this.configDataLocal.lt.split('-')
      const lt1 =
        parseInt(lt[0].split(':')[0]) * 60 + parseInt(lt[0].split(':')[1])
      const lt2 =
        parseInt(lt[1].split(':')[0]) * 60 + parseInt(lt[1].split(':')[1])
      const dt = this.configDataLocal.dt.split('-')
      const dt1 =
        parseInt(dt[0].split(':')[0]) * 60 + parseInt(dt[0].split(':')[1])
      const dt2 =
        parseInt(dt[1].split(':')[0]) * 60 + parseInt(dt[1].split(':')[1])

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
        //  this.$message.error('当前不是用餐时段')
        this.mainLoading = false
        return 'None'
      }
    },
    // 时间判断函数
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
    endOrder() {
      // 优惠计算后价格
      // eslint-disable-next-line no-unused-vars
      let ypriceSum = parseFloat(0)
      console.log('nowBool:' + this.nowTimeMealBool)
      // 先判断是哪一餐
      switch (true) {
        case this.nowTimeMealBool == 'Breakfast':
          // 早餐价格变量

          console.log('结算早餐')
          if (this.isFirstTime) {
            console.log('早餐首次')
            this.movieselected.map((item) => {
              ypriceSum += parseFloat(item.yprice)
            })
            // 计算菜品总价
            switch (true) {
              case ypriceSum <= this.freeBFPrice:
                ypriceSum = 0
                console.log('全部免费')
                break
              case ypriceSum > this.freeBFPrice:
                ypriceSum = ypriceSum - this.freeBFPrice
                console.log('扣你部分钱')
                break
              default:
                console.log('')
                break
            }
          } else {
            console.log('早餐非首次')
            this.movieselected.map((item) => {
              ypriceSum += parseFloat(item.price)
            })
          }

          // 加上牛奶价格
          if (!this.isFirstMilk) {
            ypriceSum += parseFloat(this.milkPrice) * this.milkSelected.length
          }

          // 价钱取整处理
          this.allsum = ypriceSum.toFixed(2)
          // 确认金额之后提交
          this.$confirm('此餐消费金额为' + this.allsum + '元,确认提交吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirmButtonClass',
            customMessgeBoxClass: 'customMessgeBoxClass',
            cancelButtonClass: 'cancelButtonClass'
          }).then(() => {
            // 判断扣费后是否足够钱
            if (parseFloat(this.nowOrderManLeftMoney) - payPrice < 0) {
              // 开启遮罩层
              this.$alert('抱歉！您的余额不足', '通知', {
                confirmButtonText: '确定',
                callback: action => {
                  this.noMoneyBool = true
                  this.dialogVisible = true
                  this.nowOrderManName = ''
                  this.nowOrderManLeftMoney = parseFloat(0)
                  this.movieselected = []
                  this.milkSelected = []
                }
              })
            } else {
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
            }
          }).catch(() => {
            // 取消
            console.log('取消')
          })
          break
        // //////////计算午晚餐价格///////////////////
        case this.nowTimeMealBool == 'Lunch' || this.nowTimeMealBool == 'Supper':
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

          var payPrice = '0.00'
          if (this.isFirstTime == true) {
            // 总价减去免费金额10元
            payPrice = parseFloat(ypriceSum) - parseFloat(this.freeDNPrice)
            // 小于免费金额的化为免费，价格0
            if (payPrice < 0) { payPrice = 0 }
          } else {
            // 非首次按原价收费
            let yuanPriceSum = 0
            this.movieSelected.forEach(element => {
              yuanPriceSum += parseFloat(element.price)
            })
            payPrice = parseFloat(yuanPriceSum)
          }
          console.log('扣费后价格：', payPrice)

          console.log('this.milkSelected.length', this.milkSelected.length)

          // 价格加上牛奶价格
          if (this.isFirstMilk == false) {
            payPrice += parseFloat(parseFloat(this.milkPrice) * this.milkSelected.length)
          }

          // 价钱取整处理
          this.allsum = payPrice.toFixed(2)
          // 确认金额之后提交
          this.$confirm('此餐消费金额为' + this.allsum + '元,确认提交吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirmButtonClass',
            customMessgeBoxClass: 'customMessgeBoxClass',
            cancelButtonClass: 'cancelButtonClass'
          }).then(() => {
            // 判断扣费后是否足够钱
            if (parseFloat(this.nowOrderManLeftMoney) - payPrice < 0) {
              // 开启遮罩层
              this.$alert('抱歉！您的余额不足', '通知', {
                confirmButtonText: '确定',
                callback: action => {
                  this.noMoneyBool = true
                  this.dialogVisible = true
                  this.nowOrderManName = ''
                  this.nowOrderManLeftMoney = parseFloat(0)
                  this.movieselected = []
                  this.milkSelected = []
                }
              })
            } else {
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
            }
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
      // 拼接成一个大数组
      const bigSelected = [...this.movieselected, ...this.milkSelected]
      this.fatherDataSend(false, bigSelected, this.isMilk)
      this.movieselected = []
      this.milkSelected = []
    },
    async timeBoolChange(booltime) {
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

    fatherDataSendTimeBoolChange(timeBool) {
      var fatherData = {
        timeBool: timeBool
      }
      this.childWin.postMessage(fatherData)
    },
    enterOrder() {
      const inOrderTimeBool = this.timeJudge()

      inOrderTimeBool.then((res) => {
        // 时间位转换
        switch (res) {
          case 'bt':
            res = 'Breakfast'
            break
          case 'lt':
            res = 'Lunch'
            break
          case 'dt':
            res = 'Supper'
            break
          default:
            break
        }
        if (res == 'None') {
          const timeBoolPromiss = this.dutyTimeJudge()
          timeBoolPromiss.then((timeRes) => {
            // 把时间往里面丢
            const afterGetUserData = this.getUserData(timeRes)
            afterGetUserData.then((userData) => {
              // 判断当前时间是否为前后半小时时间内
              if (userData.isDutyVaild) {
                this.enterOrder_noduty(timeRes)
                this.dialogVisible = false
              } else {
                this.$message.error('非值班人员不得在非用餐时间用餐')
              }
            })
          })
        } else {
          // 把时间往里面丢
          const afterGetUserData = this.getUserData(res)
          afterGetUserData.then((userRes) => {
            if (userRes.isGetVaildUser) {
              this.enterOrder_noduty(res)
              this.dialogVisible = false// 取消遮罩层
            }
          })
        }

        // // const afterGetUserData = this.getUserData(res)
        // afterGetUserData.then((userData) => {
        //   console.log('userData', this.timeBool)

        //   //  判断值班人员是否有效
        //   if (userData.isDutyVaild) {
        //     const timeBoolPromiss = this.dutyTimeJudge()
        //     timeBoolPromiss.then((timeRes) => {
        //       // 判断当前时间是否为前后半小时时间内
        //       if (timeRes) {
        //         this.enterOrder_noduty(userData.timeBool)
        //       } else {
        //         this.$message.error('非值班人员不得在非用餐时间用餐')
        //       }
        //     })
        //   } else {
        //     this.$message.error('当前不是用餐时段')
        //   }
        // })
      })

      console.log(inOrderTimeBool)
      // await this.getUserData(inOrderTimeBool)
      // this.addData()
    },

    async enterOrder_noduty(inOrderTimeBool) {
      console.log('this.configDataLocal.baseUrl', this.configDataLocal.baseUrl)
      this.mainLoading = true
      this.isMilk = false
      this.fatherDataSend(true)

      if (inOrderTimeBool != this.nowTimeMealBool) {
        console.log('当前时间状态已经改变')
        this.fatherDataSendTimeBoolChange(this.timeBoolChange(inOrderTimeBool))
      }
      // 请求对应排餐和排餐id
      this.clickFun(inOrderTimeBool)

      if (inOrderTimeBool != 'None') {
        this.nowTimeMealBool = inOrderTimeBool

        this.mainLoading = false
      }
    },
    async getUserDataPromiss(timebool) {
      return await axios.get('/Interface/Common/GetUserData.ashx', {
        params: {
          sn: this.configDataLocal.snNumber, // this.SNid,
          cookbookEnum: timebool // this.getMeadlId,
        }
      })
    },
    async getUserData(inOrderTimeBool) {
      // 获取当前人员人脸信息
      const ppromiss = this.getUserDataPromiss(inOrderTimeBool)
      let isGetVaildUser = false
      const ppromiss2 = ppromiss.then(res => {
        console.log(11111111111111111111)
        if (res.data != '') {
          console.log('userData', res, this.configDataLocal.snNumber)
          // 节假日判断
          if (res.data.HolidaysPreferential.length == 0) {
            console.log(res.data.HolidaysPreferential.length, '我不是节日')
            this.freeBFPrice = res.data.CategoryPreferential.BreakfastFree// 早餐全免金额
            this.maxBFPrice = res.data.CategoryPreferential.BreakfastPreferential // 早餐优惠金额
            this.freeDNPrice = res.data.CategoryPreferential.LunchSupperPreferential// 午晚餐优惠金额
            this.freeFoodNum = res.data.CategoryPreferential.LunchSupperPreferentialCookbookCount// 中晚餐优惠价菜品数量
          } else {
            console.log(res.data.HolidaysPreferential.length, '我是节日')
            this.freeBFPrice = res.data.HolidaysPreferential[0].BreakfastFree// 早餐全免金额
            this.maxBFPrice = res.data.HolidaysPreferential[0].BreakfastPreferential // 早餐优惠金额
            this.freeDNPrice = res.data.HolidaysPreferential[0].LunchSupperPreferential// 午晚餐优惠金额
            this.freeFoodNum = res.data.HolidaysPreferential[0].LunchSupperPreferentialCookbookCount// 中晚餐优惠价菜品数量
          }
          // 值班判断存值
          // ！=0是值班人员有返回值
          if (res.data.DutyDict.length != 0) {
            const dutyMealValue = res.data.DutyDict[0].PCStaffDutyInfo.CookbookEnums
            switch (true) {
              case dutyMealValue == 'ALL':
                this.isDutyVaild = true

                break
              case dutyMealValue.includes(','):
                // 如果包含逗号，则拆开餐次对比
                dutyMealValue.split(',').map((item) => {
                  if (inOrderTimeBool == item) {
                    this.isDutyVaild = true
                  }
                })
                break
              default:
                break
            }
          }
          console.log(res.data)
          this.faceId = res.data.FaceData[0].recordid
          this.faceTime = res.data.FaceData[0].Facetime
          this.createDate = res.data.FaceData[0].CreateTime
          this.nowOrderManName = res.data.PcInfo.Name
          this.informationNum = res.data.PcInfo.InformationNum
          this.nowOrderManLeftMoney = res.data.PcInfo.Amount
          this.isFirstTime = res.data.IsFristOrderMeal// res.data.IsFristOrderMeal
          this.isFirstMilk = res.data.IsFristMilk
          this.nowTimeMealBool = inOrderTimeBool
          console.log('this.isFirstMilkthis.isFirstMilk', this.isFirstMilk)
          isGetVaildUser = true
          this.mainLoading = false// 取消loading
        } else {
          this.$message.error('无法获取到有效用户')
          isGetVaildUser = false
        }

        return { timeBool: inOrderTimeBool, isDutyVaild: this.isDutyVaild, isGetVaildUser: isGetVaildUser }
      })
      return ppromiss2
    },
    // 处理点菜品取消×函数
    handleClose(foodName) {
      console.log('tag-key:', this.movieselected.findIndex(value => value.foodName == foodName))
      this.movieselected.splice(
        this.movieselected.findIndex(value => value.foodName == foodName),
        1
      )
    },
    // 处理点牛奶取消×函数
    handleMilkClose() {
      this.milkSelected.pop()
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
      let allIds = ''
      this.movieselected.forEach(element => {
        allIds += element.foodId + ','
      })
      return allIds.substring(0, allIds.length - 1)
    },
    async submitFun() {
      axios.get('/Interface/Synchronize/BuffetSynchronize.ashx', {
        params: {
          informationNum: this.informationNum, // this.informationNum,
          cookbookSetInDateId: this.getMeadlId,
          cookbookIds: this.getFoodsIds(),
          isMilk: this.milkSelected.length,
          createDate: this.createDate,
          faceTime: this.faceTime,
          faceId: this.faceId,
          sn: this.configDataLocal.snNumber,
          cookbookEnum: this.timeBoolChange(this.nowTimeMealBool)
        }
      }).then(res => {
        this.$message.success('消费成功！')
        console.log('clickfun:', res)
      })
    },
    // 获取菜单
    clickFun(timeBool) {
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: this.configDataLocal.CafeteriaId,
          CookbookEnum: timeBool,
          Datetime: this.getTodayDate()
        }
      }).then(res => {
        console.log('返回菜品', res.data)
        if (res.data == '') {
          this.$message.error('当前餐次查无排餐')
          return
        }
        this.movie = res.data.cookbooks
        this.getMeadlId = res.data.cookbookSetInDate.Id.toString()
        console.log('this.getMeadlId ', this.getMeadlId)
        try {
          this.movie.forEach(element => {
            this.switchValue.push(true)
          })
        } catch (error) {
          console.log('switchValue-error', error)
        }
      })
    },
    // 获取当天年月日
    getTodayDate() {
      const date = new Date()
      const seperator1 = '-'
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      const currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    }
  }
}
</script>

<style>
.buttonclass {
    font: Jwhite;
    width: 190px;
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
    height: 660px;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
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

.confirmButtonClass {
    width: 214px;
    height: 80px;
    font-size: 20px;
}
.el-message-box {
    width: 480px;
    height: 200px;
    text-align: center;
}
.cancelButtonClass {
    width: 214px;
    height: 80px;
    font-size: 20px;
}
.el-message-box__message {
    font-size: 20px;
    display: inline-block;
}
</style>