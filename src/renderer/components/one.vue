<template>
  <div>
    <el-container>
      <el-header>
        <el-tag style="font-size:18px">自助点餐系统</el-tag>
      </el-header>
      <el-container>
        <!-- 侧界面 -->
        <el-aside style="1ine-height:30px;background:rgb(251,251,251)" width="200px">
          <el-row>
            <el-tag style="margin-top:10px;font-size:16px;width:160px;" type="success">已点菜单</el-tag>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="24" v-for="item in movieselected" :key="item.index" style="height:30px;margin-bottom:10px;">
              <el-tag style="font-size:16px;width:160px;">
                {{item}}
              </el-tag>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <!-- <el-header>Header</el-header> -->
          <!-- 主界面 -->
          <el-main style="line-height:50px;background:white;">
            <!-- <el-button @click="clickFun">
            </el-button> -->
            <el-row>
              <el-col v-for="item in movie" :key="item.CategoryId" :span="6">
                <el-button type="primary" round plain class="buttonclass" :disabled="false" @click="addFun(item.Name)">
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
    },
    jsonData: {
      deep: true,
      handler() {
        console.log('jsonData变了！')

        // h console.1og("jsonData变了！")；
      }
    }
  },

  methods: {
    hideFun() {
      this.show2 = this.show2
    },
    messAlert() {
      this.$message.error('这是一条消息提示')
    },
    load2222() {
      this.load = true
    },
    addFun(nameIn) {
      if (this.movieselected.findIndex(value => value === nameIn) === -1) {
        this.movieselected.push(nameIn)
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