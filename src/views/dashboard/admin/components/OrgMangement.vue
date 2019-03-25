<template>
  <div class="fbody">
    <el-form  label-width="80px">
    <el-row style="margin-bottom: 20px">
      <el-form-item label="批准时间">
      <!-- 批准时间 -->
      <el-col :md="4" :lg="4">
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
      <el-table :span-method="objectSpanMethod" :data="tableData" border style="width: 100%">
        <el-table-column label=" " prop="title" width="180">
        </el-table-column>
        <el-table-column label="类别" prop="rowName" width="180">
        </el-table-column>
        <el-table-column label="机构数" prop="orgNum" width="180">
          <template scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="getMore('orgNum',scope.row)">{{ scope.row.orgNum}}</div>
          </template>
        </el-table-column>
        <el-table-column label="签订协议机构数" prop="signNum" width="180">
          <template scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="getMore('signNum',scope.row)">{{ scope.row.signNum}}</div>
          </template>
        </el-table-column>
        <el-table-column label="本年度新增机构数" prop="newNum" width="180">
          <template scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="getMore('newNum',scope.row)">{{ scope.row.newNum}}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 点击表格单元格弹窗start -->
      <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogTableVisible1" v-if='dialogTableVisible1'>
        <el-table :data="gridData">
          <el-table-column fixed prop="orgName" label="机构名称" width="250">
          </el-table-column>
          <el-table-column prop="managerUnit" label="管理单位" width="250">
          </el-table-column>
          <el-table-column prop="registerNo" label="登记号" width="200">
          </el-table-column>
          <el-table-column prop="uncode" label="全国唯一识标码" width="150">
          </el-table-column>
          <el-table-column prop="orgAdr" label="机构地址" width="250">
          </el-table-column>
          <el-table-column prop="tel" label="电话号码" width="150">
          </el-table-column>
          <el-table-column prop="egalPersonName" label="法人姓名" width="150">
          </el-table-column>
          <el-table-column prop="legalPersonNo" label="法人证件号" width="200">
          </el-table-column>
          <el-table-column prop="chargePerName" label="负责人姓名" width="150">
          </el-table-column>
          <el-table-column prop="chargePerNo" label="负责人证件号" width="200">
          </el-table-column>
          <el-table-column prop="orgKind" label="机构类别" width="150">
          </el-table-column>
          <el-table-column prop="orgClass" label="机构级别" width="150">
          </el-table-column>
          <el-table-column prop="nature" label="经营性质" width="150">
          </el-table-column>
          <el-table-column prop="nextCheckDate" label="下一校验日期" width="150">
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-dialog>
      <!-- 点击表格单元格弹窗end -->
    </template>
  </div>
</template>
<script>
import { formatDate } from '@/assets/date.js'
import axios from '@/utils/request'
export default {
  name: 'dashboard-admin',
  data() {
    return {
      tableData: [],
      gridData: [],
      spanArr: [],
      position: 0,
      row: '',
      // 搜索条件
      sousuo: {
        managerName: '',
        year: ''
      },
      // 详情 管理单位
      detailManagerName: '',
      // 多选数组
      // multipleSelection: [],
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
      totalCount: 0,
      totalCountP: 0,
      titleMap: {
        signNum: '签订协议机构数',
        orgNum: '机构数',
        newNum: '新增机构数'
      },
      dialogStatus: '',
      dialogTableVisible1: false,
      id: '',
      signNum: '',
      rowName: '',
      newNum: '',
      orgNum: '',
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
  // },
  methods: {
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        console.log(_row)
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 从服务器读取数据
    loadData: function() {
      var params = new URLSearchParams()
      params.append('year', this.sousuo.year)
      params.append('managerName', this.sousuo.managerName)
      axios.post('/org-report', params).then((response) => {
        var data = response.data
        this.tableData = data
      })
    },
    rowspan() {
      this.spanArr = []
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (this.tableData[index].title === this.tableData[index - 1].title) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    // 点击单元框 弹框
    getMore: function(dialogStatus, row) {
      console.log(row)
      this.dialogStatus = dialogStatus
      this.dialogTableVisible1 = true
      this.row = row
      if (dialogStatus === 'orgNum') {
        this.getOrgDetail(this.sousuo.year, this.detailManagerName, 'orgNum', row.rowName, this.currentPage, this.pagesize)
      } else if (dialogStatus === 'signNum') {
        this.getOrgDetail(this.sousuo.year, this.detailManagerName, 'signNum', row.rowName, this.currentPage, this.pagesize)
      } else if (dialogStatus === 'newNum') {
        this.getOrgDetail(this.sousuo.year, this.detailManagerName, 'newNum', row.rowName, this.currentPage, this.pagesize)
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
    // 重置搜索条件
    resetSearch() {
      this.sousuo.managerName = ''
      this.sousuo.year = ''
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
    // 获取机构报表详细信息
    getOrgDetail(year, managerName, type, rowName, page, size) {
      axios.get('/org-report-detail', {
        params: {
          page: page,
          size: size,
          year: year,
          managerName: managerName,
          type: type,
          rowName: rowName
        }
      }).then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.gridData = data
          this.totalCount = response.data.data.total
        } else {
          this.gridData = []
          this.totalCount = 0
        }
      })
    },
    // 点击行响应
    handleclick: function(row, event, column) {
      this.highlightId = row.id
    },
    // 人员页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getOrgDetail(this.sousuo.year, this.detailManagerName, this.dialogStatus, this.row.rowName, this.currentPage, this.pagesize)
    },
    // 人员显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.currentPage = 1
      this.getOrgDetail(this.sousuo.year, this.detailManagerName, this.dialogStatus, this.row.rowName, this.currentPage, this.pagesize)
    },
    // 改变当前点击的行的class，高亮当前行
    tableRowClassName: function(row, index) {
      if (row.row.id === this.highlightId) {
        return 'info-row'
      }
    },
    // 按照年份搜索
    searchTime: function() {
      if (this.sousuo.year === '') {
        this.$message({
          showClose: true,
          message: '请选择查询项',
          type: 'warning'
        })
      } else {
        this.detailManagerName = this.sousuo.managerName
        var params = new URLSearchParams()
        params.append('year', this.sousuo.year)
        params.append('managerName', this.sousuo.managerName)
        axios.post('/org-report', params).then((response) => {
          var data = response.data
          // console.log(response.data)
          this.tableData = data
          this.rowspan()
          // this.totalCount = response.data.length
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


