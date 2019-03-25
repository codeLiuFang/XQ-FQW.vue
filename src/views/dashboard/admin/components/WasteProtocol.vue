<template>
  <div class="fbody">
    <el-row :gutter="2">
      <el-col :md="4" :lg="3">
        <el-select v-model="chaxun.managerName" class="dy" filterable placeholder="请选择管理单位" clearable @change="selectManager">
          <el-option v-for="item in selectMangeinfo" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="4" :lg="3">
        <el-select v-model="chaxun.medicalOrgId" filterable clearable placeholder="请选择医疗机构" @change="changemedicalOrgValue">
          <el-option v-for="item in ManageSearchName" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="3" :lg="4">
        <el-date-picker v-model="startDate" type="date" placeholder="选择协议开始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :md="3" :lg="4">
        <el-date-picker v-model="endDate" type="date" placeholder="选择协议结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :md="3" :lg="4">
        <el-date-picker v-model="signtime" type="date" placeholder="选择协议签订日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :md="4" :lg="4">
        <el-button type="primary" icon="el-icon-search" v-on:click="search">搜索</el-button>
        <el-button type="success" icon="el-icon-refresh" v-on:click="resetSearch">重置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px; margin-bottom:10px;">
      <el-col>
        <el-button type="primary" @click="addCompany('ruleForm')" icon='el-icon-plus'>添加</el-button>
        <el-button type="success" @click="deletenames" icon='el-icon-delete'>批量删除</el-button>
        <el-button type="info" @click="dialogVisible5 = true" icon='el-icon-upload'>导入协议</el-button>
        <el-button type="danger" @click="doExport()" icon='el-icon-download'>下载协议模板</el-button>
      </el-col>
    </el-row>
    <!-- 新增废弃物处理管理单位弹窗start -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog">
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-form-item label="管理单位" prop="managerName" :rules="[{ required: true, message: '请选择管理单位', trigger: 'blur' }]">
            <el-select style="width: 40%" v-model="ruleForm.managerCode" class="dy" filterable placeholder="请选择管理单位" clearable @change="selectmanager" @clear="clearmanager">
              <el-option v-for="item in manageinfo" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="医疗机构" prop="medicalOrgId" :rules="[{ required: true, message: '请选择医疗机构', trigger: 'blur' }]">
            <el-select style="width: 40%" v-model="ruleForm.medicalOrgId" filterable placeholder="请选择医疗机构" @change="changemedicalOrgValue">
              <el-option v-for="item in ManageName" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="废弃物处理机构" prop="wasteOrgName" :rules="[{ required: true, message: '请选择废弃物处理机构', trigger: 'blur' }]">
            <el-select style="width: 40%" v-model="ruleForm.wasteOrgName" filterable placeholder="医疗废弃物处理机构" @change="changewasteOrgValue">
              <el-option v-for="item in wastMange" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="协议开始时间" prop="startDate" :rules="[{ required: true, message: '请输入协议开始时间', trigger: 'blur' }]">
            <el-date-picker style="width: 38%" v-model="ruleForm.startDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="startDateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="协议到期时间" prop="endDate" :rules="[{ required: true, message: '请输入协议到期时间', trigger: 'blur' }]">
            <el-date-picker style="width: 38%" v-model="ruleForm.endDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="协议签订时间" prop="signDate" :rules="[{ required: true, message: '请输入协议签订时间', trigger: 'blur' }]">
            <el-date-picker style="width: 38%" v-model="ruleForm.signDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="协议类型" prop="type" :rules="[{ required: true, message: '请选择协议类型', trigger: 'blur' }]">
            <el-select style="width: 40%" v-model="ruleForm.type">
              <el-option v-for="item in protoTypes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传照片" prop="photos">
            <el-upload action="/gtp-server/upload" accept="image/jpeg,image/gif,image/png" list-type="picture-card" :on-success="handleAvatarSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="ruleForm.photos">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="callOf('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="saveCompany('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增企业弹窗end -->
    <!-- 导入协议start -->
    <el-dialog title="导入协议" :visible.sync="dialogVisible5" width="30%">
      <form action="/gtp-server/agreement-import" method="post" target="rfFrame" style="height: 50px" enctype="multipart/form-data">
        <input type="file" class="seltn" name="file" multiple="multiple" />
        <input type="submit" class="subtn" @click="formsubmit" />
      </form>
    </el-dialog>
    <!-- 导入协议end -->
    <template>
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
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
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button type="text" icon='el-icon-edit-outline' @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon='el-icon-close' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination class="pstyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
    <iframe id="rfFrame" name="rfFrame" src="about:blank" style="display:block;height:0;width:0"></iframe>
  </div>
</template>
<script>
import axios from '@/utils/request'
import $ from 'jquery'
export default {
  name: 'dashboard-admin',
  data() {
    return {
      filetypes: ['xls', 'XLSX', 'xlsx'],
      tableData: [],
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVisible5: false,
      // 多选数组
      multipleSelection: [],
      startDate: '',
      endDate: '',
      // 签约时间
      signtime: '',
      // 搜索条件
      medicalOrgName: '',
      // 下拉菜单选项
      // select: '',
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
      wasteOrgId: '',
      ruleForm: {
        managerCode: '',
        managerName: '',
        medicalOrgId: '',
        medicalOrgName: '',
        wasteOrgName: '',
        wasteOrgId: '',
        managerId: '',
        // startDate: this.getNowFormatDate(),
        // endDate: this.getNextYearFormatDate(),
        startDate: '',
        endDate: '',
        signDate: '',
        id: '',
        // photos: '',
        photos: [],
        remark: '',
        type: ''
        // remark2: '',
        // remark3: ''
      },
      chaxun: {
        managerName: '',
        medicalOrgId: ''
      },
      value: '',
      wastMange: [],
      ManageName: [],
      manageinfo: [],
      ManageSearchName: [],
      selectMangeinfo: [],
      remark: '',
      dialogFormVisible: false,
      titleMap: {
        addCompany: '新增处置协议',
        editCompany: '编辑处置协议'
      },
      // 协议类型
      protoTypes: [],
      dialogStatus: '',
      returndata: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
    this.getManageSearchName()
    // this.getmangeinfo()
    this.getMange()
  },
  mounted() {
    document.$vue = this
    document.getElementById('rfFrame').addEventListener('load', function() {
      var text = $('#rfFrame').contents().find('body').text()
      var obj = JSON.parse(text)
      document.$vue.$message({
        message: obj.data,
        type: 'success'
      })
      document.$vue.dialogVisible5 = false
    })
  },
  methods: {
    // 校验文件类型
    formsubmit(event) {
      const fileele = document.querySelector('.seltn')
      const filetype = fileele.value.substr(fileele.value.lastIndexOf('.') + 1)
      console.log(fileele.value)
      if (!this.filetypes.includes(filetype)) {
        this.$message('文件类型不符！请选择excel文件')
        event.preventDefault()
      }
    },
    // 导出协议
    doExport: function() {
      var url = '/gtp-server/agreement-mode'
      var form = $('<form>')// 定义一个form表单
      form.attr('style', 'display:none')
      form.attr('target', '')
      form.attr('method', 'get')// 请求类型
      form.attr('action', url)// 请求地址
      $('body').append(form)
      var input1 = $('<input>')
      input1.attr('type', 'hidden')
      form.append(input1)
      form.submit()
    },
    // 数据字典 选择协议类型下拉
    getProtocolType: function() {
      var data = {
        codeId: '08'
      }
      this.protoTypes = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.protoTypes.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 重置搜索条件
    resetSearch() {
      this.chaxun.managerName = ''
      this.chaxun.medicalOrgId = ''
      this.startDate = ''
      this.endDate = ''
      this.signtime = ''
    },
    // 选择管理单位
    selectmanager(val) {
      let obj = {}
      obj = this.manageinfo.find((item) => {
        return item.value === val
      })
      this.ruleForm.managerName = obj.label
      this.ruleForm.managerCode = obj.value
      console.log(obj.value)
      this.getMedicalCompany(obj.value)
    },
    // 查询管理单位
    selectManager(val) {
      let obj = {}
      obj = this.selectMangeinfo.find((item) => {
        return item.value === val
      })
      this.chaxun.managerName = obj.label
      this.chaxun.managerCode = obj.value
      this.getMedicalCompany(obj.label)
    },
    // 清空选择管理单位事件
    clearmanager() {
      this.ruleForm.medicalOrgId = ''
      this.ManageName = []
    },
    // 管理单位下拉
    getmangeinfo: function() {
      this.manageinfo = []
      axios.get('/managerOrgs', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        console.log(responsedata)
        for (var i = 0; i < responsedata.length; i++) {
          this.manageinfo.push({
            value: responsedata[i].orgCode,
            label: responsedata[i].orgName
          })
        }
      })
    },
    // 管理单位查询下拉
    getMange: function() {
      this.selectMangeinfo = []
      axios.get('/managerOrgs', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        for (var i = 0; i < responsedata.length; i++) {
          this.selectMangeinfo.push({
            value: responsedata[i].orgCode,
            label: responsedata[i].orgName
          })
        }
      })
    },
    /**
 * 获取当前时间
 * 格式YYYY-MM-DD
 */
    startDateChange(val) {
      var nextyear = parseInt(val.slice(0, 4)) + 1
      this.ruleForm.endDate = nextyear + '-' + val.slice(5, 7) + '-' + val.slice(8, 10)
    },
    // 上传组件
    handleRemove(file, fileList) {
      var ids = file.id
      var data = []
      data.push(ids)
      axios.delete('/photo', { data: data }).then((response) => {
        if (response.data.msg === 'success') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      })
      this.ruleForm.photos = this.ruleForm.photos.filter(t => t.id !== file.id)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      res.data.url = '/gtp-server/photo-image/' + res.data.id
      this.ruleForm.photos.push(res.data)
      // console.log(this.ruleForm)
    },
    changemedicalOrgValue(val) {
      let obj = {}
      obj = this.ManageName.find((item) => {
        return item.value === val
      })
      this.ruleForm.medicalOrgName = obj.label
    },
    changewasteOrgValue(val) {
      let obj = {}
      obj = this.wastMange.find((item) => {
        return item.value === val
      })
      this.ruleForm.wasteOrgName = obj.label
      this.ruleForm.wasteOrgId = obj.value
      console.log(obj.value)
    },
    // 从服务器读取数据
    loadData: function(page, size) {
      axios.get('/wasteAgreements', {
        params: {
          page: page,
          size: size,
          medicalOrgId: this.chaxun.medicalOrgId,
          signDate: this.signtime,
          startDate: this.startDate,
          endDate: this.endDate,
          managerName: this.chaxun.managerName,
          managerCode: this.chaxun.managerCode
        }
      }).then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          console.log(data)
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
      this.ruleForm.photos = []
      this.ruleForm.managerCode = ''
      // this.$refs['ruleForm'].resetFields()
      this.ruleForm.id = ''
      this.getmangeinfo()
      this.getWasteMange()
      this.dialogFormVisible = true
      this.dialogStatus = 'addCompany'
      this.getProtocolType()
    },
    // 获取医疗机构下拉
    getMedicalCompany: function(managerCode) {
      // console.log(managenuit)
      this.ManageName = []
      this.ruleForm.medicalOrgId = ''
      axios.get('/medicalOrgs', {
        params: {
          managerCode: managerCode
        }
      }).then((response) => {
        var responsedata = response.data.data.rows
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.ManageName.push({
              value: item.id,
              label: item.orgName
            })
          })
        }
      })
    },
    // 医疗机构查询下拉
    getManageSearchName: function() {
      this.ManageSearchName = []
      axios.get('/medicalOrgs', '').then((response) => {
        var responsedata = response.data.data.rows
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.ManageSearchName.push({
              value: item.id,
              label: item.orgName
            })
          })
        }
      })
    },
    // 获取废弃物处理机构
    getWasteMange: function() {
      this.wastMange = []
      axios.get('/wasteOrgs', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.wastMange.push({
              value: item.id,
              label: item.orgName
            })
          })
        }
        this.ruleForm.wasteOrgName = this.wastMange[0].label
        this.ruleForm.wasteOrgId = this.wastMange[0].value
      })
    },
    // 根据id查询企业信息
    // 编辑
    handleEdit: function(index, row) {
      // console.log(row)
      this.dialogFormVisible = true
      this.dialogStatus = 'editCompany'
      this.titleMap.editCompany = '编辑处置协议'
      this.getmangeinfo()
      // 调用获取医疗机构下拉接口
      this.getMedicalCompany()
      this.getWasteMange()
      this.getProtocolType()
      this.$nextTick(() => {
        // 根据id获取接口
        var url = '/wasteAgreement/' + row.id
        axios.get(url).then((response) => {
          if (response.data.msg === 'success') {
            this.ruleForm = response.data.data
            // console.log(this.ruleForm)
            this.ruleForm.managerCode = this.ruleForm.managerCode
            for (var i = 0; i < this.ruleForm.photos.length; i++) {
              this.ruleForm.photos[i].name = this.ruleForm.photos[i].fileName
              this.ruleForm.photos[i].url = '/gtp-server/photo-image/' + this.ruleForm.photos[i].id
            }
          }
        })
      })
    },
    // 按照企业名称搜索
    search: function() {
      if (this.chaxun.managerName === '' && this.chaxun.medicalOrgId === '' && this.signtime === '' && this.startDate === '' && this.endDate === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        // var dateRange = this.dateRange
        var url = '/wasteAgreements'
        axios.get(url, {
          params: {
            page: 1,
            size: this.pagesize,
            medicalOrgId: this.chaxun.medicalOrgId,
            signDate: this.signtime,
            startDate: this.startDate,
            endDate: this.endDate,
            managerName: this.chaxun.managerName
          }
        }).then((response) => {
          if (response.data.msg === 'success') {
            var data = response.data.data.rows
            this.tableData = data
            this.totalCount = response.data.data.total
          }
        })
      }
    },
    // 保存企业信息
    saveCompany: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.get('/validateAgree', {
            params: {
              medicalOrgId: this.ruleForm.medicalOrgId,
              managerCode: this.ruleForm.managerCode,
              startDate: this.ruleForm.startDate,
              endDate: this.ruleForm.endDate,
              id: this.ruleForm.id
            }
          }).then((response) => {
            if (response.data.msg === 'success') {
              if (this.dialogStatus === 'addCompany') {
                axios.post('/wasteAgreement', this.ruleForm).then((response) => {
                  console.log(this.ruleForm)
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
                axios.put('/wasteAgreement', this.ruleForm).then((response) => {
                  if (response.data.msg === 'success') {
                    this.dialogFormVisible = false
                    this.$message({
                      message: '编辑成功',
                      type: 'success'
                    })
                    this.$refs['ruleForm'].resetFields()
                    this.loadData(this.currentPage, this.pagesize)
                  }
                })
              }
            } else if (response.data.msg === 'failed') {
              this.$message({
                message: '该协议时间已存在',
                type: 'error'
              })
            }
          })
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
        axios.delete('/wasteAgreement', { data: data }).then((response) => {
          if (response.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.loadData(this.currentPage, this.pagesize)
          }
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
        axios.delete('/wasteAgreement', { data: data }).then((response) => {
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
.subtn {
  border: 0px;
  background-color: #409eff;
  width: 73px;
  height: 32px;
  border-radius: 4px;
  float: right;
  color: white;
}
.seltn {
  border: 0px;
}
</style>


