<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="200px" style="background:#FBFBFB;">
          <el-row style="margin-top:10px">
            <el-tag type="success" style="width:200px">
              本次菜品
            </el-tag>
          </el-row>
        </el-aside>
        <el-aside width="200px" style="background:#FEFAFF;margin-left:5px;margin-right:5px">
          <el-row style="margin-top:10px">
            <el-tag type="warning" style="width:200px">
              上次菜品
            </el-tag>
          </el-row>
        </el-aside>
        <el-container>
          <el-header>
            <el-tag type=" primary" style="font-size:18px;width:200px">
              内部员工界面
            </el-tag>
          </el-header>
          <el-main>
            <el-row>
              <el-col v-for="(item,index) in cookBook" :key="item.index" :span="6">
                <el-tag style="font-size:16px;height:64px;width:140px">
                  <el-row>{{item.Name}}</el-row>
                  <el-row>
                    售馨

                    <el-switch v-model="switchvalue[index]" active-color="#13ce66" inactive-color="#ff4949" @change="changeFun">
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
export default {
  data: function () {
    return {
      switchvalue: [],
      cookBook: [],
      dialogVisible: true
    }
  },
  mounted: function () {
    this.getFun()
  },
  watch: {
    switchvalue() {
      console.log(this.switchValue)
    },
    jsonData: {
      deep: true,
      handler() {
        console.log('jsonData变了!')
      }
    }
  },

  methods: {
    changeFun() {
      console.log('按开关啦！')
    },
    loadCookbook() {
      axios.get('http://127.0.0.1:5080/api').then(res => {
        this.cookBook = res.data.data
        this.cookBook.forEach(element => {
          console.log(element.id)
          this.switchvalue.push(true)
        })
      })
    },
    getFun() {
      axios.get('/Interface/Common/GetCookbookSetInDate.ashx', {
        params: {
          CafeteriaId: '16',
          CookbookEnum: 'Lunch',
          Datetime: '2020-06-4'
        }
      }).then(res => {
        this.cookBook = res.data.cookbooks
        console.log(res.data)
        this.cookBook.forEach(element => {
          console.log(element.id)
          this.switchvalue.push(true)
        })
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