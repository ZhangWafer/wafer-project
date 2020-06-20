<template>
  <div>
    <el-container v-loading="load">
      <el-header style="background-color:#ECF5FF;color:#409EFF;font-size:18px;font-weight:bold;">
        <el-tag style="font-size:18px">自助点餐系统</el-tag>
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

          <el-row style="position:absolute;bottom:0px;">
            <el-button type="danger"
              style="width:200px;height:60px"
              @click="endOrder">
              结算
            </el-button>
          </el-row>

        </el-aside>
        <el-container>
          <!-- <el-header>Header</el-header> -->
          <!-- 主界面 -->
          <el-main style="line-height:50px;background:white;">
            <!-- <el-button @click="clickFun">
            </el-button> -->
            <el-row>
              <el-col v-for="(item,index) in movie"
                :key="'noorderdFood'+index"
                :span="6">
                <el-button type="primary"
                  round
                  plain
                  class="buttonclass"
                  :disabled="false"
                  @click="addFun(item.Name,item.Price,item.PcPrice)">
                  <el-row>
                    <el-col :span="24">
                      <h4>{{item.Name}}</h4>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top:10px">
                    价格：{{item.Price}}
                  </el-row>
                </el-button>
              </el-col>
            </el-row>
          </el-main>
          <el-footer style="background-color:#ECF5FF;">
            <el-row>
              <el-col :span="12">
                <el-tag>当前点餐人：张三</el-tag>
              </el-col>
              <el-col :span="12">
                <el-tag>当前余额：168.88元</el-tag>
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
              style="width:200px"
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
      movie: []
    }
  },
  mounted: function () {
    console.log('ssss')
    this.clickFun()
    // this.clickFun(3)；
  },
  watch: {
    allsum() {
      console.log('al1sum变了！！！')
    }
    // jsonData: {
    //   deep: true,
    //   handler() {
    //     console.log('jsonData变了！')

    //     // h console.1og("jsonData变了！")；
    //   }
    // }
  },

  methods: {

    enterOrder() {
      this.dialogVisible = false
    },
    handleClose(foodName) {
      console.log('tag-key:', this.movieselected.findIndex(value => value.foodName == foodName))
      this.movieselected.splice(
        this.movieselected.findIndex(value => value.foodName == foodName),
        1
      )
    },
    successNotice() {
      this.$notify({
        title: '成功',
        message: '支付成功',
        type: 'success'
      })
    },
    endOrder() {
      this.movieselected = []
      clearTimeout(this.timer)
      this.load = true
      setTimeout(() => {
        this.load = false
        console.log('时间到啦')
        this.successNotice()
        setTimeout(() => {
          this.dialogVisible = true
        }, '1000')
      }, '1000')
    },
    hideFun() {
      this.show2 = this.show2
    },
    messAlert() {
      this.$message.error('这是一条消息提示')
    },
    load2222() {
      this.load = true
    },
    addFun(nameIn, price, yprice) {
      const jsonData = {
        foodName: '',
        price: '',
        yprice: ''
      }
      if (this.movieselected.findIndex(value => value.foodName === nameIn) === -1) {
        jsonData.foodName = nameIn
        jsonData.price = price
        jsonData.yprice = yprice
        this.movieselected.push(jsonData)
        console.log(this.movieselected)
      } else {
        this.$message.error('优惠价只可点一份')
      }
    },

    consoleFun() {
      console.log('ssss')
    },
    clickFun() {
      // axios.get('http://127.0.0.1:5000/api').then(res => {
      //   console.log(res.data.data)
      //   this.movie = res.data.data
      // })
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: '16',
          CookbookEnum: 'Lunch',
          Datetime: '2020-06-4'
        }
      }).then(res => {
        this.movie = res.data.cookbooks
        console.log(res)
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