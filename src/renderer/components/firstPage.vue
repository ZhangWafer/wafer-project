<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-row>
          <el-col :span="6">sss

          </el-col>
          <el-col :span="6">sss

          </el-col>
          <el-col :span="6">sss

          </el-col>
          <el-col :span="6">sss

          </el-col>
        </el-row>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:7878' // 关键代码

export default {
  mounted() {
    this.getThing()
  },
  methods: {
    getThing() {
      // 发送 POST 请求
      axios.get('/Interface/Common/GetStaff.ashx', {
        params: {
          informationNum: '360102196206195833'
        }
      }).then(res => {
        console.log(res.data.pcInfo)
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