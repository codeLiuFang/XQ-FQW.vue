<template>
  <div class="fbody">
     <el-form  label-width="80px">
    <el-row style="margin-bottom: 20px">
       <el-form-item label="协议时间">
      <el-col :md="4" :lg="4">
        <!-- <el-input v-model="sousuo.startDate" placeholder="请输入年份" clearable></el-input> -->
        <!-- <p>协议时间</p> -->
        <el-date-picker v-model="sousuo.year" type="year" value-format='yyyy' placeholder="选择年">
        </el-date-picker>
      </el-col>
      <el-col :md="6" :lg="4">
        <el-select v-model="sousuo.managerName" class="dy" filterable placeholder="请选择管理单位" clearable @change="selectmanager">
          <el-option v-for="item in manageinfo" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="6" :lg="4">
        <el-button type="primary" icon="el-icon-search" v-on:click="searchTime">搜索</el-button>
        <el-button type="success" icon="el-icon-refresh" v-on:click="resetSearch">重置</el-button>
      </el-col>
       </el-form-item>
    </el-row>
    </el-form>
    <template>
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="year" label="年份" width="200">
        </el-table-column>
        <el-table-column prop="num" label="协议数" width="200">
          <template scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="getMore('num',scope.row)">{{ scope.row.num }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="usingNum" label="即将失效协议数" width="200">
          <template scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="getMore('usingNum',scope.row)">{{ scope.row.usingNum }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="usedNum" label="已失效协议数" width="200">
          <template scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="getMore('usedNum',scope.row)">{{ scope.row.usedNum }}</div>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 点击表格单元格弹窗start -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogTableVisible1" v-if='dialogTableVisible1'>
      <el-table :data="gridData">
        <el-table-column prop="managerName" label="管理单位" width="200">
        </el-table-column>
        <el-table-column prop="medicalOrgName" label="医疗机构" width="200">
        </el-table-column>
        <el-table-column prop="wasteOrgName" label="废弃物处理机构" width="200">
        </el-table-column>
        <el-table-column prop="startDate" label="协议开始时间" width="150">
        </el-table-column>
        <el-table-column prop="endDate" label="协议到期时间" width="150">
        </el-table-column>
        <el-table-column prop="type" label="协议类型" width="150">
        </el-table-column>
        <el-table-column prop="signDate" label="协议签订时间" width="150">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChangeP" @current-change="handleCurrentChangeP" :current-page="currentPageP" :page-sizes="[10, 20, 30, 40]" :page-size="pagesizeP" layout="total, sizes, prev, pager, next, jumper" :total="totalCountP">
      </el-pagination>
    </el-dialog>
    <!-- 点击表格单元格弹窗end -->
  </div>
</template>
<script>
import axios from '@/utils/request'
import { formatDate } from '@/assets/date.js'
export default {
  name: 'dashboard-admin',
  data() {
    return {
      tableData: [],
      gridData: [],
      // 多选数组
      // multipleSelection: [],
      dialogTableVisible1: false,
      row: '',
      // 搜索条件
      managerName: '',
      // 下拉菜单选项
      select: '',
      // 默认每页数据量
      pagesize: 10,
      pagesizeP: 10,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPage: 1,
      currentPageP: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      totalCountP: 1000,
      // dialogForm1Visible: false,
      formLabelWidth: '120px',
      id: '',
      year: '',
      // 搜索条件
      sousuo: {
        managerName: '',
        year: ''
      },
      // 详情管理名称
      detailMangerName: '',
      titleMap: {
        num: '协议详情',
        usingNum: '即将失效协议详情',
        usedNum: '已失效协议详情'
      },
      dialogStatus: '',
      // 管理单位
      manageinfo: []
    }
  },
  mounted() {
    var date = new Date()
    this.sousuo.year = formatDate(date, 'yyyy')
    this.searchTime()
    // 调用 获取管理单位下拉
    this.getmangeinfo()
  },
  // created: function() {
  //   this.loadData()
  //   // 调用 获取管理单位下拉
  //   this.getmangeinfo()
  // },
  methods: {
    // 从服务器读取数据
    loadData: function() {
      var url = '/agreement-report/?year=' + this.sousuo.year + '&managerName=' + this.sousuo.managerName + ''
      var params = new URLSearchParams()
      params.append('year', this.sousuo.year)
      params.append('managerName', this.sousuo.managerName)
      // var postData = {
      //   year: this.sousuo.year,
      //   managerName:this.sousuo.managerName
      // }
      axios.get(url).then((response) => {
        var data = response.data
        this.tableData = data
      })
    },
    // 点击协议数 弹框
    getMore: function(dialogStatus, row) {
      this.dialogStatus = dialogStatus
      if (dialogStatus === 'num') {
        this.getProtocalDetail(this.sousuo.year, this.detailMangerName, 'num', this.start, this.pagesizeP)
      } else if (dialogStatus === 'usingNum') {
        this.getProtocalDetail(this.sousuo.year, this.detailMangerName, 'usingNum', this.start, this.pagesizeP)
      } else if (dialogStatus === 'usedNum') {
        this.getProtocalDetail(this.sousuo.year, this.detailMangerName, 'usedNum', this.start, this.pagesizeP)
      }
      this.dialogTableVisible1 = true
      this.row = row
    },
    // 获取协议详情
    getProtocalDetail(year, managerName, type, page, size) {
      // this.gridData = []
      // this.totalCountP = 0
      this.currentPageP = page
      this.pagesizeP = size
      axios.get('/agreement-detail', {
        params: {
          page: page,
          size: size,
          year: year,
          managerName: managerName,
          type: type
        }
      }).then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.gridData = data
          this.totalCountP = response.data.data.total
        } else {
          this.gridData = []
          this.totalCountP = 0
        }
      })
    },
    // 点击行响应
    handleclick: function(row, event, column) {
      this.highlightId = row.id
    },
    // 协议数页码变更
    handleCurrentChangeP: function(val) {
      this.currentPageP = val
      console.log(val)
      this.getProtocalDetail(this.sousuo.year, this.detailMangerName, this.dialogStatus, this.currentPageP, this.pagesizeP)
    },
    // 协议数每页显示数据量变更
    handleSizeChangeP: function(val) {
      this.pagesizeP = val
      this.currentPageP = 1
      this.getProtocalDetail(this.sousuo.year, this.detailMangerName, this.dialogStatus, this.currentPageP, this.pagesizeP)
    },
    // 改变当前点击的行的class，高亮当前行
    tableRowClassName: function(row, index) {
      if (row.row.id === this.highlightId) {
        return 'info-row'
      }
    },
    // 管理单位下拉
    selectmanager(val) {
      let obj = {}
      obj = this.manageinfo.find((item) => {
        return item.value === val
      })
      this.sousuo.managerName = obj.label
      // console.log(this.ruleForm.managerUnit)
    },
    // 获取管理单位
    getmangeinfo: function() {
      this.manageinfo = []
      axios.get('/managerOrgs', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        for (var i = 0; i < responsedata.length; i++) {
          // console.log(responsedata[i])
          this.manageinfo.push({
            value: responsedata[i].orgCode,
            label: responsedata[i].orgName
          })
        }
      })
    },
    // 重置搜索条件
    resetSearch() {
      this.sousuo.managerName = ''
      this.sousuo.year = ''
    },
    // 按照年份搜索
    searchTime: function() {
      if (this.sousuo.year === '' && this.sousuo.managerName === '') {
        this.$message({
          showClose: true,
          message: '请选择查询项',
          type: 'warning'
        })
      } else {
        // this.detailManagerName = this.sousuo.managerName
        axios.get('/agreement-report', {
          params: {
            year: this.sousuo.year,
            managerName: this.sousuo.managerName
          }
        }).then((response) => {
          var data = response.data
          this.tableData = data
        })
      }
    }
  }
}
</script>
<style>
@import '../../../../styles/common.css';
.el-table .info-row {
  background: #c9e5f5;
}
.del {
  float: right;
  margin-right: -60px;
  margin-top: -32px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>


