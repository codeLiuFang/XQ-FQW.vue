<template>
  <div class="fbody">
    <el-form label-width="80px">
      <el-row style="margin-bottom: 20px">
        <el-form-item label="登记时间">
        <el-col :md="4" :lg="4">
          <!-- <el-input v-model="createTime" placeholder="请输入年份" clearable></el-input> -->
          <!-- 登记时间 -->
          <el-date-picker v-model="year" type="year" placeholder="选择年" value-format="yyyy">
          </el-date-picker>
        </el-col>
         <el-col :md="6" :lg="2">
          <el-button type="primary" icon="el-icon-search" v-on:click="searchTime">搜索</el-button>
        </el-col>
        </el-form-item>
      </el-row>
      </el-form>
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="年份" prop="year" width="180">
          </el-table-column>
          <el-table-column label="培训人数" prop="trainNum" width="180">
            <template scope="scope">
              <div style="color:#409EFF;cursor:pointer;" @click="getMore('trainNum',scope.row)">{{ scope.row.trainNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="持证人数" prop="cradNum" width="180">
            <template scope="scope">
              <div style="color:#409EFF;cursor:pointer;" @click="getMore('cardNum',scope.row)">{{ scope.row.cardNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="新增人数" prop="newNum" width="180">
            <template scope="scope">
              <div style="color:#409EFF;cursor:pointer;" @click="getMore('newNum',scope.row)">{{ scope.row.newNum}}</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 点击表格单元格弹窗start -->
        <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogTableVisible1" v-if='dialogTableVisible1'>
          <el-table :data="gridData">
            <el-table-column prop="code" label="编码" width="50">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="50">
            </el-table-column>
            <el-table-column prop="cardno" label="身份证" width="200">
            </el-table-column>
            <el-table-column prop="cardTime" label="持证时间" width="100">
            </el-table-column>
            <el-table-column prop="orgs" label="机构名称" width="250">
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="100">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChangeP" @current-change="handleCurrentChangeP" :current-page="currentPageP" :page-sizes="[10, 20, 30, 40]" :page-size="pagesizeP" layout="total, sizes, prev, pager, next, jumper" :total="totalCountP">
          </el-pagination>
        </el-dialog>
        <!-- 点击表格单元格弹窗end -->
      </template>
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
      row: '',
      // 多选数组
      // multipleSelection: [],
      // 搜索条件
      createTime: '',
      // 下拉菜单选项
      select: '',
      // 默认每页数据量,
      pagesizeP: 10,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPageP: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCountP: 1000,
      titleMap: {
        trainNum: '培训人数',
        cardNum: '持证人数',
        newNum: '新增人数'
      },
      dialogStatus: '',
      // dialogForm1Visible: false,
      dialogTableVisible1: false,
      id: '',
      // year: this.getNowYear()
      year: ''
    }
  },
  mounted() {
    var date = new Date()
    this.year = formatDate(date, 'yyyy')
    this.searchTime()
  },
  created: function() {
  },
  methods: {
    // 从服务器读取数据
    loadData: function() {
      var params = new URLSearchParams()
      params.append('year', this.year)
      axios.post('/person-report', params).then((response) => {
      })
    },
    // 点击单元框 弹框
    getMore: function(dialogStatus, row) {
      this.dialogStatus = dialogStatus
      console.log(row)
      if (dialogStatus === 'trainNum') {
        this.getPeopleDetail(row.year, 'trainNum', this.currentPageP, this.pagesizeP)
      } else if (dialogStatus === 'cardNum') {
        this.getPeopleDetail(row.year, 'cardNum', this.currentPageP, this.pagesizeP)
      } else if (dialogStatus === 'newNum') {
        this.getPeopleDetail(row.year, 'newNum', this.currentPageP, this.pagesizeP)
      }
      this.dialogTableVisible1 = true
      this.row = row
    },
    // 获取培训信息详情
    // getTrainPeopleDetail(year, page, size) {
    //   axios.get('/report/train-person', {
    //     params: {
    //       page: page,
    //       size: size,
    //       year: year
    //     }
    //   }).then((response) => {
    //     if (response.data.msg === 'success') {
    //       var data = response.data.data.rows
    //       this.gridData = data
    //       this.totalCountP = response.data.data.total
    //     }
    //   })
    // },
    // 培训 持证人数 新增人数信息
    getPeopleDetail(year, type, page, size) {
      axios.get('/person-detail', {
        params: {
          page: page,
          size: size,
          year: year,
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
    // 人员页码变更
    handleCurrentChangeP: function(val) {
      this.currentPageP = val
      this.getPeopleDetail(this.row.year, this.dialogStatus, this.currentPageP, this.pagesizeP)
    },
    // 人员显示数据量变更
    handleSizeChangeP: function(val) {
      this.pagesizeP = val
      this.currentPageP = 1
      this.getPeopleDetail(this.row.year, this.dialogStatus, this.currentPageP, this.pagesizeP)
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 改变当前点击的行的class，高亮当前行
    tableRowClassName: function(row, index) {
      if (row.row.id === this.highlightId) {
        return 'info-row'
      }
    },
    // 按照年份搜索
    searchTime: function() {
      if (this.year === '') {
        this.$message({
          showClose: true,
          message: '请选择查询项',
          type: 'warning'
        })
      } else {
        var params = new URLSearchParams()
        params.append('year', this.year)
        axios.post('/person-report', params).then((response) => {
          var data = response.data
          this.tableData = data
          // this.totalCount = response.data.length
        })
      }
    }
  }
}
</script>
<style>
@import "../../../../styles/common.css";
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


