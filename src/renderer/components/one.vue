<template>
  <div>
    <el-container v-loading="mainLoading">
      <el-container>
        <!-- 侧界面 -->
        <el-aside style="1ine-height:30px;background:rgb(251,251,251);position:relative;"
          width="310px">
          <el-row>
            <!-- <el-tag style="margin-top:10px;font-size:22px;width:200px;"
              type="success">已点菜单</el-tag> -->
            <h3 style="color:white;font-size:30px">已点菜单</h3>
          </el-row>
          <el-row style="margin-top:10px；background:#409EFF;!important">
            <el-col :span="24"
              v-for="(item,index) in movieselected"
              :key="'orderdFood'+index"
              style="height:30px;margin-bottom:18px;">
              <el-tag :key="item.foodName"
                @close="handleClose(item.foodName)"
                style="font-size:30px;width:260px;font-weight:bold"
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
                style="font-size:30px;width:260px;font-weight:bold"
                closable
                :disable-transitions="false">
                {{item.foodName}}
              </el-tag>
            </el-col>
          </el-row>

          <el-row style="position:absolute;bottom:0px;width:100%;">
            <el-tag type="success"
              v-if="!isFirstTime"
              style="width:100%;height:40px;font-size:28px">
              已点价格：{{showAllSumPrice}}

            </el-tag>
            <el-tag type="success"
              v-if="isFirstTime"
              style="width:100%;height:40px;font-size:28px">
              已点优惠价格：{{showAllSumYPrice}}
            </el-tag>
            <el-button type="success"
              style="width:80%;height:80px;margin-bottom:10px;font-size:38px;font-weight:bold;background:#3de03d!important;"
              @click="endOrder">
              结算
            </el-button>
          </el-row>

        </el-aside>
        <el-container>
          <el-header style="background-color:#ECF5FF;height:94px">
            <el-row style="margin-top:26px">
              <el-col :span="9">
                <el-tag type="warning"
                  style="height:44px;font-size:32px">当前点餐人：{{nowOrderManName}}</el-tag>
              </el-col>
              <el-col :span="4">
                <el-button style="font-size:30px;width:160px;height:70px;margin-top:-10px;vertical-align:middle;background:red!important;"
                  type="danger"
                  round
                  @click="exitOrderFood">
                  退出
                </el-button>
              </el-col>
              <el-col :span="9">
                <el-tag type="warning"
                  style="height:44px;font-size:32px">当前余额：{{nowOrderManLeftMoney}}元</el-tag>
              </el-col>
              <el-col :span="2">
                <el-button @click="settingPageBool=true"
                  style="margin-right:-70px">
                  <i class="el-icon-s-tools"></i>
                </el-button>
              </el-col>
            </el-row>
          </el-header>
          <!-- 主界面 -->
          <el-main style="line-height:36px;background:white;">
            <el-row>
              <el-col :span="5.6"
                style="margin-left:8px;">
                <el-button type="primary"
                  round
                  v-if="this.isMilkButtonShow"
                  class="buttonclass"
                  @click="addMilkFun()">
                  <el-row>
                    <el-image style="width: 200px; height: 80px"
                      :src="mikPic"></el-image>
                  </el-row>

                  <el-row style="margin-top:6px">
                    <el-col :span="24">
                      <el-tag style="font-size:22px;font-weight:bold"> 牛奶</el-tag>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top:6px;margin-left:-18px">
                    <el-col :span="12">
                      <el-tag type="success"
                        style="font-size:16px"> 价格：{{milkPrice}}</el-tag>
                    </el-col>

                    <el-col :span="12">
                      <el-tag type="warning"
                        style="font-size:16px"> 优惠价格：0</el-tag>
                    </el-col>
                  </el-row>
                </el-button>
              </el-col>
              <el-col v-for="(item,index) in movie"
                :key="'noorderdFood'+index"
                :span="5.6"
                style="margin-left:8px">
                <el-button type="primary"
                  round
                  class="buttonclass"
                  :disabled="!switchValue[index]"
                  @click="addFun(item.Name,item.Price,item.PcPrice,item.Id)">
                  <div style="">
                    <el-row>
                      <el-image style="width: 200px; height: 80px"
                        :src="item.Icon"></el-image>
                    </el-row>
                    <el-row style="margin-top:6px">
                      <el-col :span="24">
                        <el-tag :style="item.Name.length>6?'font-size:18px;font-weight:bold':'font-size:22px;font-weight:bold'"> {{item.Name}}</el-tag>
                      </el-col>
                    </el-row>
                    <el-row :style="item.Price.length+item.PcPrice.length<4?'margin-top:6px;margin-left:-10px':'margin-top:6px;margin-left:-18px'">
                      <el-col :span="12">
                        <el-tag type="success"
                          style="font-size:16px"> 价格：{{item.Price}}</el-tag>
                      </el-col>
                      <el-col :span="12">
                        <el-tag type="warning"
                          style="font-size:16px"> 优惠价格：{{item.PcPrice}}</el-tag>
                      </el-col>
                    </el-row>
                  </div>
                </el-button>
              </el-col>
            </el-row>
          </el-main>

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
        <el-row>
          <el-col :span="24">
            <el-button type='danger'
              style="width:80% "
              @click="closeWin()">
              关闭软件
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <el-dialog title="人员身份"
      :visible.sync="pictureDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="12">
          <el-image style="width: 200px;height: 240px;margin-left: 10px;"
            :src="configDataLocal.baseUrl+'/Files/Icon/pc/'+personPicUrl"></el-image>
          <el-tag style="font-size: 36px;height: 40px; width: 220px;text-align: center;">
            {{this.nowOrderManName}}
          </el-tag>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button type="primary"
              style="width: 160px;height: 60px;margin-top: 20px;margin-left: 36px;font-size:30px"
              @click="picShowConfirm()">确 定</el-button>
          </el-row>
          <el-row>
            <el-button type="danger"
              @click="picShowCancel()"
              style="width: 160px;height: 60px;margin-top: 20px;margin-left: 36px;font-size:30px">取 消</el-button>

          </el-row>
        </el-col>
      </el-row>
      <span slot="footer"
        class="dialog-footer">

      </span>
    </el-dialog>

  </div>

</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import fs from 'fs'
import niunaiPic from '../assets/niunainai.jpg'
const remote = require('electron').remote

Vue.prototype.$ajax = axios

export default {
  data: function () {
    return {
      ownMoneyBool: false, // 欠费标志
      isTQorXJbool: false, // 特勤巡警标志
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
      isMilk: false, // isMilk确认是否为牛奶专窗，
      isFirstMilk: 'false', // isFirstMilk确认这个人之前是否点过牛奶，是否首次点奶
      milkPrice: 0.00,
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
      isDutyVaild: false,
      isMilkButtonShow: true,
      showAllSumYPrice: parseFloat(0.00),
      showAllSumPrice: parseFloat(0.00),
      pictureDialogVisible: false,
      personPicUrl: ''
    }
  },
  created: function () {
    console.log('created')
  },
  mounted() {
    console.log('mounted')
    // eslint-disable-next-line no-unused-vars
    // window.sonWindow = window.open('/#/cook')

    // 读取配置文件
    // eslint-disable-next-line no-unused-vars
    const readconfigPromiss = this.readConfig()

    window.addEventListener('message', (msg) => {
      console.log('接收到的消息,', msg.data)
      if (msg.data != undefined) {
        if (msg.data.switchValue != undefined) {
          this.switchValue = msg.data.switchValue
        }
        if (msg.data.getNowTimeBool != undefined) {
          this.timeBoolSend()
        }
      }
    })
    // this.childWin = window.open('/#/cook')
    // // 取牛奶价格
    // eslint-disable-next-line no-unused-vars
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

  methods: {// 余额不足，请尽快充值
    testVoice2(text = '已欠费，请尽快充值', pitch = 2, lang = 'zh-CN', rate = 1, volume = 200, closeSpeakTime = 5000) {
      const msg = Object.assign(new SpeechSynthesisUtterance(), { text, lang, volume, rate, pitch })
      speechSynthesis.speak(msg)
      // 关闭语音
      // if (closeSpeakTime) {
      //   setTimeout(() => {
      //     // speechSynthesis.cancel(msg)
      //   }, closeSpeakTime)
      // }
    },
    testVoice(text = '余额不足，请尽快充值', pitch = 2, lang = 'zh-CN', rate = 1, volume = 200, closeSpeakTime = 5000) {
      const msg = Object.assign(new SpeechSynthesisUtterance(), { text, lang, volume, rate, pitch })
      speechSynthesis.speak(msg)
      // 关闭语音
      // if (closeSpeakTime) {
      //   setTimeout(() => {
      //     // speechSynthesis.cancel(msg)
      //   }, closeSpeakTime)
      // }
    },
    test2() {
    },
    picShowConfirm() {
      this.pictureDialogVisible = false
    },
    picShowCancel() {
      this.pictureDialogVisible = false
      this.dialogVisible = true
    },
    showAllSumPriceFun() {
      console.log('当前菜品和牛奶', this.milkSelected, this.movieselected)
      let ypriceSum = parseFloat(0)
      let priceSum = parseFloat(0)
      // this.showAllSumYPrice = parseFloat(0)
      // this.showAllSumPrice = parseFloat(0)
      this.movieselected.map((item) => {
        ypriceSum += parseFloat(item.yprice)
      })
      this.movieselected.map((item) => {
        priceSum += parseFloat(item.price)
      })
      // this.movieselected
      // 巡警或特勤的话走这个分支
      if (this.isTQorXJbool) {
        ypriceSum += parseFloat(this.milkPrice) * this.milkSelected.length
        priceSum += parseFloat(this.milkPrice) * this.milkSelected.length
      } else {
        if (!this.isFirstMilk) {
          ypriceSum += parseFloat(this.milkPrice) * this.milkSelected.length
          priceSum += parseFloat(this.milkPrice) * this.milkSelected.length
          // 非首次牛奶加上牛奶价格
        }
      }
      this.showAllSumYPrice = ypriceSum.toFixed(2)
      this.showAllSumPrice = priceSum.toFixed(2)
    },
    closeWin() {
      const w = remote.getCurrentWindow()
      w.close()
    },
    exitOrderFood() {
      this.milkSelected = []
      this.movieselected = []
      this.dialogVisible = true
      this.showAllSumYPrice = parseFloat(0)
      this.showAllSumPrice = parseFloat(0)
    },
    addMilkFun() {
      const milkJsonData = {
        foodName: '牛奶',
        price: this.milkPrice,
        yprice: '0.00',
        foodId: ''
      }
      if (this.milkSelected.length + this.movieselected.length > 10) {
        this.$message.error('您点的菜品过多')
        return
      }

      // 巡警或特勤的话走这个分支
      if (this.isTQorXJbool) {
        this.milkSelected.push(milkJsonData)
        this.showAllSumPriceFun()
      } else {
        if (this.isFirstMilk) {
          if (this.milkSelected.length == 1) {
            this.$message.error('优惠价只可点一份')
          } else {
            this.milkSelected.push(milkJsonData)
            this.showAllSumPriceFun()
          }
        } else {
          this.milkSelected.push(milkJsonData)
          this.showAllSumPriceFun()
        }
      }
    },
    async getMilkPrice() {
      return axios.get('Interface/Common/GetMilkPrice.ashx')
    },
    async readConfig() {
      console.log('开始读config')
      let aaa = null
      return fs.readFile('d:/config.json', 'utf-8', (err, data) => {
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
          axios.defaults.baseURL = aaa.baseUrl
          this.timeJudge().then((timebool) => {
            this.nowTimeMealBool = timebool
            this.urlStr[0] = this.configDataLocal.baseUrl.split('http://')[1].split(':')[0]
            this.urlStr[1] = this.configDataLocal.baseUrl.split('http://')[1].split(':')[1]
            this.childWin = window.open(window.location.href + 'cook?CafeteriaId=' + this.configDataLocal.CafeteriaId + '&timeBool=' + timebool + '&axiosUrl=' + this.urlStr[0] + '&axiosPort=' + this.urlStr[1], 'newwindow', 'height=2000px,width=2000px,top=100px,left=2400px,fullscreen=yes')
          })
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
        return 'Breakfast'
      } else if (nowCount > lt1 && nowCount < lt2) {
        console.log('当前是午餐时段')
        return 'Lunch'
      } else if (nowCount > dt1 && nowCount < dt2) {
        console.log('当前是晚餐时段', dt1, dt2)
        return 'Supper'
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
      if (this.movieselected.length == 0 && this.milkSelected == 0) {
        this.$message.error('您未选择菜品！')
        return
      }
      // 优惠计算后价格
      // eslint-disable-next-line no-unused-vars
      let ypriceSum = parseFloat(0)
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

          // 如果是特勤或巡警都要牛奶加钱
          if (this.isTQorXJbool) {
            ypriceSum += parseFloat(this.milkPrice) * this.milkSelected.length
          } else {
            // 加上牛奶价格
            if (!this.isFirstMilk) {
              ypriceSum += parseFloat(this.milkPrice) * this.milkSelected.length
            }
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
            if (parseFloat(this.nowOrderManLeftMoney) - this.allsum < 0) {
              this.$message.error('抱歉！您的余额不足')
            } else {
              // 确定
              console.log('确定')
              this.mainLoading = true

              setTimeout(() => {
                console.log('等待时间到')
                this.mainLoading = false
                this.submitFun()
                this.sendMenuMeg()
                // 开启遮罩层
                this.dialogVisible = true
                this.showAllSumYPrice = parseFloat(0)
                this.showAllSumPrice = parseFloat(0)
                this.nowOrderManName = ''
                this.nowOrderManLeftMoney = parseFloat(0)

                // 巡警特勤牛奶标志位复位
                this.isTQorXJbool = false
              }, 1500)
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

          if (this.isTQorXJbool) {
            payPrice += parseFloat(this.milkPrice) * this.milkSelected.length
          } else {
            // 价格加上牛奶价格
            if (this.isFirstMilk == false) {
              if (typeof (this.milkPrice) != 'number') {
                this.$message.error('牛奶价格有误！')
                // eslint-disable-next-line no-unused-vars
                const milkPromiss = this.getMilkPrice()
              }
              payPrice += parseFloat(this.milkPrice) * this.milkSelected.length
            }
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
            // 如果有欠费就走这个分支
            if (this.ownMoneyBool) {
              // 判断扣费后是否足够钱
              if (parseFloat(this.nowOrderManLeftMoney) - this.allsum < parseFloat(0)) {
                this.testVoice()
                this.$message.error('抱歉！您的余额不足')
                this.ownMoneyBool = false
                this.mainLoading = false
                // 开启遮罩层
                this.dialogVisible = true
                this.showAllSumYPrice = parseFloat(0)
                this.showAllSumPrice = parseFloat(0)
                this.nowOrderManName = ''
                this.nowOrderManLeftMoney = parseFloat(0)

                // 复位特勤巡警牛奶
                this.isTQorXJbool = false
                return
              }
            }

            // 无欠费走这个分支
            // 判断扣费后是否足够钱
            if (parseFloat(this.nowOrderManLeftMoney) - this.allsum < parseFloat(-18)) {
              this.testVoice()
              this.$message.error('抱歉！您的余额不足')
            } else {
              // 确定
              console.log('确定')
              this.mainLoading = true

              setTimeout(() => {
                console.log('等待时间到')
                this.mainLoading = false
                this.submitFun()
                this.sendMenuMeg()
                // 开启遮罩层
                this.dialogVisible = true
                this.showAllSumYPrice = parseFloat(0)
                this.showAllSumPrice = parseFloat(0)
                this.nowOrderManName = ''
                this.nowOrderManLeftMoney = parseFloat(0)
                // 复位特勤巡警牛奶
                this.isTQorXJbool = false
              }, 1000)
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
      this.fatherDataSend(false, bigSelected, this.isMilk, this.nowOrderManName)
      this.movieselected = []
      this.milkSelected = []
    },
    timeBoolSend() {
      this.dutyTimeJudge().then((timeBool) => {
        var nowTimeData = {
          nowTimeData: timeBool
        }
        this.childWin.postMessage(nowTimeData)
      })
    },
    fatherDataSend(boolValue, foodSelected, isMilk, name) {
      var fatherData = {
        enter: boolValue,
        foodSelected: foodSelected,
        isMilk: isMilk,
        nowOrderManName: name
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
      if (this.milkPrice == 0.00) {
        const getMilkPricePromiss = this.getMilkPrice()
        getMilkPricePromiss.then(res => {
          this.milkPrice = parseFloat(res.data.Price)
        }).catch(() => {
          // 取消
          this.$message.error('网络错误！请检查网络连接！')
        })
      }

      const inOrderTimeBool = this.timeJudge()
      inOrderTimeBool.then((res) => {
        // 如果是周末或者晚上则不提供牛奶
        const nowDayNum = new Date().getDay()
        if (nowDayNum == 6 || nowDayNum == 0) {
          console.log('今天是周末')
          this.isMilkButtonShow = false
        } else {
          console.log('今天是工作日')
          this.isMilkButtonShow = true
          const nowDayHour = new Date().getHours()
          console.log('现在小时数', nowDayHour)
          if (nowDayHour >= 16) {
            console.log('现在是晚上')
            this.isMilkButtonShow = false
          } else {
            this.isMilkButtonShow = true
            // 如果不是牛奶专窗
            if (res == 'Lunch' || res == 'Supper') {
              // 晚上不提供牛奶
              this.isMilkButtonShow = true
              if (this.configDataLocal.milkMachine == 'false') {
                this.isMilkButtonShow = false
              }
            }
          }
        }

        if (res == 'None') {
          const timeBoolPromiss = this.dutyTimeJudge()
          timeBoolPromiss.then((timeRes) => {
            if (timeRes == 'None') {
              this.$message.error('现在不是用餐时段')
              return
            }
            if (timeRes != this.nowTimeMealBool) {
              console.log('当前时间状态已经改变')
              this.fatherDataSendTimeBoolChange(timeRes)
            }
            // 把时间往里面丢
            const afterGetUserData = this.getUserData(timeRes)
            afterGetUserData.then((userData) => {
              // 判断当前时间是否为前后半小时时间内
              if (userData.isDutyVaild) {
                this.enterOrder_noduty(timeRes)
                this.dialogVisible = false
                this.pictureDialogVisible = true
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
              this.pictureDialogVisible = true
            }
          })
        }
      })

      console.log(inOrderTimeBool)
    },

    async enterOrder_noduty(inOrderTimeBool) {
      console.log('this.configDataLocal.baseUrl', this.configDataLocal.baseUrl)
      this.mainLoading = true
      this.fatherDataSend(true)

      // 请求对应排餐和排餐id
      const clickPromiss = this.clickFun(inOrderTimeBool)
      clickPromiss.then((res) => {
        console.log('返回菜品', res)
        if (res.data == '') {
          this.dialogVisible = true
          this.$message.error('当前餐次查无排餐')
          this.mainLoading = false
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

        if (inOrderTimeBool != 'None') {
          this.nowTimeMealBool = inOrderTimeBool
        }
        this.mainLoading = false
      })
    },
    async getUserDataPromiss(timebool) {
      return await axios.get('/Interface/Common/GetUserData.ashx', {
        params: {
          sn: this.configDataLocal.snNumber, // this.SNid,
          cookbookEnum: timebool // this.getMeadlId,
        }
      }).catch(() => {
        this.$message.error('网络错误！请检查网络连接！')
      })
    },
    async getUserData(inOrderTimeBool) {
      // 获取当前人员人脸信息
      const ppromiss = this.getUserDataPromiss(inOrderTimeBool)
      let isGetVaildUser = false
      const ppromiss2 = ppromiss.then(res => {
        if (res.data != '') {
          if (parseFloat(res.data.Arrearage) != 0) {
            this.$message.error('已欠费，请尽快充值')
            this.testVoice2()
            this.ownMoneyBool = true
            // return
          }

          if (res.data.PcInfo.CategoryId == 4 || res.data.PcInfo.CategoryId == 5) {
            console.log('属于特勤或巡警')
            this.isTQorXJbool = true
          }

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
          this.personPicUrl = res.data.PcInfo.Icon
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
      this.showAllSumPriceFun()
    },
    // 处理点牛奶取消×函数
    handleMilkClose() {
      this.milkSelected.pop()
      this.showAllSumPriceFun()
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
      if (this.milkSelected.length + this.movieselected.length > 10) {
        this.$message.error('您点的菜品过多')
        return
      }
      // 无论如何早餐可以点多份
      if (this.nowTimeMealBool == 'Breakfast') {
        if (this.movieselected.length <= 12) {
          jsonData.foodName = nameIn
          jsonData.price = price
          jsonData.yprice = yprice
          jsonData.foodId = foodId
          this.movieselected.push(jsonData)
          this.showAllSumPriceFun()
        } else {
          this.$message.error('抱歉，您点的菜品数量过多')
        }
      } else {
        if (this.isFirstTime) {
          if (this.movieselected.findIndex(value => value.foodName === nameIn) === -1) {
            jsonData.foodName = nameIn
            jsonData.price = price
            jsonData.yprice = yprice
            jsonData.foodId = foodId
            this.movieselected.push(jsonData)
            this.showAllSumPriceFun()
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
            this.showAllSumPriceFun()
          } else {
            this.$message.error('抱歉，您点的菜品数量过多')
          }
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
          cookbookEnum: this.nowTimeMealBool
        }
      }).then(res => {
        this.$message.success('')

        this.$message({
          dangerouslyUseHTMLString: true,
          duration: 5000,
          message: '<strong> <i style="margin-left:40px;font-size:36px;color:red;">消费成功！</i> </strong>'
        })

        console.log('clickfun:', res)
      })
    },
    // 获取菜单
    async clickFun(timeBool) {
      return axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: this.configDataLocal.CafeteriaId,
          CookbookEnum: timeBool,
          Datetime: this.getTodayDate()
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
    font: white;
    width: 236px !important;
    background: #521de4 !important;
    height: 190px;
    margin-bottom: 6px;
}
</style>

<style>
.el-tag--light {
    color: white !important;
    background: #521de4 !important;
    border-color: #521de4 !important;
}
.el-tag--warning {
    color: white !important;
    background: #e6a23c !important;
    border-color: #e6a23c !important;
}
.el-button--success {
    border: #521de4;
    background-color: #521de4;
}
/* .el-button--warning {
    border: #fb7d63;
    background-color: #fb7d63;
} */
.el-header {
    /* background: rgb(236, 245, 255); */
    background: #e6a23c !important;
    color: #333;
    text-align: center;
    line-height: 60px;
}
.el-footer {
    /* background-color: #b3c0d1; */
    background: #e6a23c !important;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: black !important;
    color: #333;
    text-align: center;
    line-height: 35px;
    height: 760px;
}

.el-main {
    background-color: black !important;
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