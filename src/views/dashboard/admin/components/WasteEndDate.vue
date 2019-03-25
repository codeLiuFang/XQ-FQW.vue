<template>
  <div class="fbody">
    <template>
      <el-table border :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%">
         <el-table-column prop="managerName" label="管理单位" width="200">
        </el-table-column>
        <el-table-column prop="medicalOrgName" label="医疗机构" width="200">
        </el-table-column>
        <el-table-column prop="wasteOrgName" label="废弃物处理机构" width="200">
        </el-table-column>
        <el-table-column prop="startDate" label="协议开始时间" width="200">
        </el-table-column>
        <el-table-column prop="endDate" label="协议到期时间" width="200">
        </el-table-column>
        <el-table-column prop="signDate" label="协议签订时间" width="200">
        </el-table-column>
      </el-table>
    </template>
          <el-pagination class="pstyle"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30]"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount">
              </el-pagination> 
   </div>     
   </template>
<script>
import axios from '@/utils/request'
export default {
  name: 'dashboard-admin',
  data() {
    return {
      tableData: [],
      // 多选数组
      // multipleSelection: [],
      // 搜索条件
      name: '',
      // 下拉菜单选项
      select: '',
      // 默认每页数据量
      pagesize: 10,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      // dialogForm1Visible: false,
      formLabelWidth: '120px',
      id: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
    // 从服务器读取数据
    loadData: function(currentPage, pagesize) {
      axios.get('/wasteAgreements/expira').then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data
          this.tableData = data
          this.totalCount = response.data.data.length
        }
      })
    },
    // 点击行响应
    handleclick: function(row, event, column) {
      this.highlightId = row.id
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.currentPage = 1
      this.loadData(this.currentPage, this.pagesize)
    },
    // 改变当前点击的行的class，高亮当前行
    tableRowClassName: function(row, index) {
      if (row.row.id === this.highlightId) {
        return 'info-row'
      }
    },
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


