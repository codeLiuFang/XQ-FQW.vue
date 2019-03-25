<template>
  <div class="fbody">
    <el-row>
      <el-col>
        <el-button type="primary" @click="addCompany('ruleForm')" icon='el-icon-plus'>添加</el-button>
        <el-button type="success" @click="deletenames" icon='el-icon-delete'>批量删除</el-button>
      </el-col>
      <!-- <el-col :span="8">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </el-col>
       <el-col :span="8">
        <el-button type="primary" icon="el-icon-search" v-on:click="search" clearable>搜索</el-button>
      </el-col> -->
    </el-row>
    <!-- 新增废弃物处理管理单位弹窗start -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog">

      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="单位名称" prop="orgName" :rules="rules2.orgName">
              <el-input v-model="ruleForm.orgName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位简称" prop="orgAS" :rules="[{ required: true, message: '请输入单位简称', trigger: 'blur' }]">
              <el-input v-model="ruleForm.orgAS"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址信息" prop="address" :rules="[{ required: true, message: '请输入地址信息', trigger: 'blur' }]">
              <el-input v-model="ruleForm.address" width="350px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="callOf('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="saveCompany('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增企业弹窗end -->
    <template>
      <el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="orgName" label="单位名称" width="220">
        </el-table-column>
        <el-table-column prop="orgAS" label="单位简称" width="220">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="220">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" icon='el-icon-edit-outline' @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon='el-icon-close' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination class="pstyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
  </div>
</template>
<script>
import axios from '@/utils/request'
export default {
  name: 'dashboard-admin',
  data() {
    // 验证处理单位
    var check = (rule, value, callback) => {
      setTimeout(() => {
        const jsonurl = `/wasteOrgValid?id=${this.id}&orgName=${this.ruleForm.orgName}`
        axios.get(jsonurl).then((response) => {
          if (response.data.msg === 'failed') {
            callback(new Error('该单位名称已存在'))
          } else {
            callback()
          }
        })
      }, 500)
    }
    return {
      tableData: [],
      // 多选数组
      multipleSelection: [],
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
      ruleForm: {
        orgName: '',
        orgAS: '',
        address: ''
      },
      rules2: {
        orgName: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' },
          { validator: check, trigger: 'blur' }
        ]
      },
      id: '',
      dialogFormVisible: false,
      titleMap: {
        addCompany: '新增处理单位',
        editCompany: '编辑处理单位'
      },
      dialogStatus: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 从服务器读取数据
    loadData: function(page, size) {
      axios.get('/wasteOrgs', {
        params: {
          page: page,
          size: size
        }
      }).then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.tableData = data
          this.totalCount = response.data.data.total
        }
      })
    },
    callOf(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    closeDialog(done) {
      this.dialogFormVisible = false
      this.$refs['ruleForm'].resetFields()
    },
    // 新增
    addCompany: function(formName) {
      this.dialogFormVisible = true
      this.dialogStatus = 'addCompany'
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.ruleForm.companyContacts.length = 1
      })
    },
    // 按照企业名称搜索
    // search: function() {
    //   if (this.name === '') {
    //     this.loadData(this.page, this.size)
    //   } else {
    //     var url = '/wasteOrgs'
    //     axios.get(url, {
    //       params: {
    //         page: this.page,
    //         size: this.size,
    //         orgName: this.orgName
    //       }
    //     }).then((response) => {
    //       if (response.data.msg === 'success') {
    //         var data = response.data.data.rows
    //         this.tableData = data
    //         this.totalCount = response.data.data.total
    //       }
    //     })
    //   }
    // },
    // 根据id查询企业信息
    // 编辑
    handleEdit: function(index, row) {
      this.dialogFormVisible = true
      this.id = row.id
      this.dialogStatus = 'editCompany'
      this.titleMap.editCompany = '编辑处理单位' + '--' + row.orgName
      this.$nextTick(() => {
        // 根据id获取企业信息接口暂时不能使用  目前使用绑定值方式
        this.ruleForm.address = row.address
        this.ruleForm.orgAS = row.orgAS
        this.ruleForm.orgName = row.orgName
        this.ruleForm.remark1 = row.remark1
      })
    },
    // 保存企业信息
    saveCompany: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 保存新增
          if (this.dialogStatus === 'addCompany') {
            var jsonData = {
              address: this.ruleForm.address,
              orgAS: this.ruleForm.orgAS,
              orgName: this.ruleForm.orgName,
              remark1: this.ruleForm.remark1,
              id: this.id
            }
            // var jsonData = JSON.stringify(this.ruleForm)
            axios.post('/wasteOrg', jsonData).then((response) => {
              if (response.data.msg === 'success') {
                this.dialogFormVisible = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$refs['ruleForm'].resetFields()
                this.loadData(this.currentPage, this.pagesize)
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          } else if (this.dialogStatus === 'editCompany') {
            var editData = {
              id: this.id,
              address: this.ruleForm.address,
              orgAS: this.ruleForm.orgAS,
              orgName: this.ruleForm.orgName,
              remark1: this.ruleForm.remark1
            }
            console.log(editData)
            axios.put('/wasteOrg', editData).then((response) => {
              if (response.data.msg === 'success') {
                this.dialogFormVisible = false
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.$refs['ruleForm'].resetFields()
                this.loadData(this.currentPage, this.pagesize)
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          }
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
      this.loadData(this.currentPage, this.pagesize)
    },
    // 多选响应
    handleSelectionChange: function(val) {
      this.multipleSelection = val
    },
    // 改变当前点击的行的class，高亮当前行
    tableRowClassName: function(row, index) {
      if (row.row.id === this.highlightId) {
        return 'info-row'
      }
    },
    // 删除
    handleDelete: function(index, row) {
      this.$confirm('确定删除企业信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = row.id
        var data = []
        data.push(ids)
        axios.delete('/wasteOrg', { data: data }).then((response) => {
          // if (response.data.msg === 'success') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData(this.currentPage, this.pagesize)
          // }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 多项删除
    deletenames: function() {
      var data = []
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请至少选择一项',
          type: 'info'
        })
      } else {
        this.multipleSelection.forEach((item) => {
          var ids = item.id
          data.push(ids)
        })
        axios.delete('/wasteOrg', { data: data }).then((response) => {
          if (response.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.loadData(this.currentPage, this.pagesize)
          }
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


