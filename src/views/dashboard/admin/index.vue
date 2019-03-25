<template>
  <div class="dashboard-editor-container">
    <github-corner></github-corner>

    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table></transaction-table>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}" style="margin-bottom:30px;">
        <todo-list></todo-list>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}" style="margin-bottom:30px;" >
        <box-card></box-card>
      </el-col>
    </el-row>
    <!-- <el-row>
  <el-col :span="24">
     <ul>
        <li v-for="file in files" :key="file.id">
          <span>{{file.name}}</span> -
          <span>{{file.size }}</span> -
          <span v-if="file.error">{{file.error}}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>
      <div class="example-btn">
        <el-upload
          class="primary"
          post-action=""
          :multiple="true"
          v-model="files"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          <i class="el-icon-circle-plus-outline"></i>
          选择文件
          
        </el-upload>
        <el-button type="primary" icon="el-icon-upload2" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">上传
           
        </el-button>
       
        <el-select v-model="value" placeholder="请选择下载项" @change="currentSel">
        <el-option
        v-for="item in getDownList"
         :key="item.value"
         :label="item.label"
         :value="item.value">
        </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-download" @click='load'>下载</el-button>
       
         <el-row>
          
         </el-row>
    </div>
  </el-col>
</el-row> -->
     
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
// import axios from '@/utils/request'
// import download from './../../../../node_modules/downloadjs/download.js'
const VueUploadComponent = require('vue-upload-component')

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    'el-upload': VueUploadComponent

  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      files: [],
      getDownList: '',
      value: ''
      // selVal : ''
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    // 上传组件
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    }
    // inputFile(newFile, oldFile) {
    //   // if (newFile && !oldFile) {
    //   //   // add
    //   //   console.log('add', newFile)
    //   // }
    //   // if (newFile && oldFile) {
    //   //   // update
    //   //   console.log('update', newFile)
    //   // }
    //   // if (!newFile && oldFile) {
    //   //   // remove
    //   //   console.log('remove', oldFile)
    //   // }
    //   if (newFile && oldFile && !newFile.active && oldFile.active) {
    //     // 获得相应数据
    //     console.log('response', newFile.response)
    //     if (newFile.xhr) {
    //       //  获得响应状态码
    //       console.log('status', newFile.xhr)
    //     }
    //   }
    // },
    // viewFile: function() {
    //   axios.get('').then((response) => {
    //     // console.log(response.data.data.rows.records)
    //     var file = response.data.data.rows.records
    //     const filename = Array.from(file)
    //     console.log(filename)
    //   })
    // },
    // getDownListInfo: function() {
    //   axios.get('').then((response) => {
    //     // console.log(response.data.data.rows.records)
    //     var file = response.data.data.rows.records
    //     console.log(file)
    //     this.getDownList = []
    //     for (var item in file) {
    //       this.getDownList.push({ value: file[item].name, lable: file[item].name })
    //     }
    //   })
    // },
    // currentSel(selVal) {
    //   this.value = selVal
    // },
    // load: function() {
    //   var url = '' + this.value + ''
    //   var x = new XMLHttpRequest()
    //   var filename = this.value
    //   x.open('GET', url, true)
    //   x.responseType = 'blob'
    //   x.onload = function(e) { download(e.target.response, filename) }
    //   x.send()
    // }
  }
  // created: function() {
  //   this.getDownListInfo()
  // }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
