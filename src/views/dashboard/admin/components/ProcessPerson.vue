<template>
  <div class="fbody">
    <el-row :gutter="4">
      <el-col :md="4" :lg="4">
        <el-input v-model="name" placeholder="请输入名字进行搜索" clearable></el-input>
      </el-col>
      <el-col :md="4" :lg="5">
        <el-input v-model="cardno" placeholder="请输入身份证号进行搜索" clearable></el-input>
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
        <el-button type="info" @click="dialogVisible4 = true" icon='el-icon-upload2'>导入处理人员</el-button>
        <el-button type="danger" @click="doExport()" icon='el-icon-download'>下载人员模板</el-button>
      </el-col>
    </el-row>
    <!-- 导入医疗机构信息弹框start -->
    <el-dialog title="导入处理人员" :visible.sync="dialogVisible4" width="30%">
      <form action="/gtp-server/import-person" method="post" target="rfFrame" style="height: 50px" enctype="multipart/form-data">
        <input type="file" class="seltn" name="file" multiple="multiple" />
        <input type="submit" class="subtn" @click="formsubmit" />
      </form>
    </el-dialog>
    <!-- 导入医疗机构信息弹框end -->
    <!-- 新增培训人员弹窗start -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog">
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" :rules="rules2.name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex" :rules="[{ required: true, message: '请选择性别', trigger: 'blur' }]">
              <el-input v-model="ruleForm.sex"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="cardno" :rules="rules2.cardno">
              <el-input v-model="ruleForm.cardno" width="350px"></el-input>
            </el-form-item>
            <el-form-item label="编号" prop="code" :rules="[{ required: true, message: '请输入编号', trigger: 'blur' }]">
              <el-input v-model="ruleForm.code" width="350px"></el-input>
            </el-form-item>
            <el-form-item label="取证时间" prop="cardTime" :rules="[{ required: true, message: '请输入取证时间', trigger: 'blur' }]">
              <el-date-picker v-model="ruleForm.cardTime" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="上传照片" prop="photo" :rules="[{ required: true, message: '请上传图片', trigger: 'blur' }]">
              <el-upload action="/gtp-server/upload" list-type="picture-card" accept="image/jpeg,image/gif,image/png" :on-preview="handlePictureCardPreview" :on-success="handleAvatarSuccess" :on-remove="handleRemove" :file-list="ruleForm.photo" :class="{disabled:uploadDisabled}">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二维码" prop="erweima">
              <img width="100%" :src="erweima" alt="">
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
    <!-- 服务医疗机构弹窗start -->
    <el-dialog title="服务医疗机构" :visible.sync="dialogTableVisible2">
      <el-table border :data="fuwuMedicalData">
        <el-table-column prop="orgName" label="机构名称" width="200"></el-table-column>
        <el-table-column prop="orgAdr" label="机构地址" width="250"></el-table-column>
        <el-table-column prop="registerNo" label="登记号" width="150"></el-table-column>
        <el-table-column prop="uncode" label="全国唯一识别码" width="150"></el-table-column>
        <!-- <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" icon='el-icon-close' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column> -->
      </el-table>
    </el-dialog>
    <!-- 服务医疗机构弹框end -->
    <!-- 培训记录弹窗start -->
    <el-dialog title="培训记录" :visible.sync="dialogTableVisible3">
      <el-table border :data="trainRecordTable">
        <el-table-column prop="startDate" label="开始时间" width="200"></el-table-column>
        <el-table-column prop="endDate" label="结束时间" width="250"></el-table-column>
        <el-table-column prop="place" label="培训地点" width="150"></el-table-column>
        <el-table-column prop="content" label="培训内容" width="150"></el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChangeRecord" @current-change="handleCurrentChangeRecord" :current-page="currentPageRecord" :page-sizes="[10, 20, 30, 40]" :page-size="pagesizeRecord" layout="total, sizes, prev, pager, next, jumper" :total="totalCountRecord">
      </el-pagination>
    </el-dialog>
    <!-- 培训记录弹框end -->
    <template>
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="code" label="编号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="180">
        </el-table-column>
        <el-table-column prop="cardno" label="身份证号" width="200">
        </el-table-column>
        <el-table-column prop="cardTime" label="取证时间" width="200">
        </el-table-column>
        <el-table-column prop="orgs" label="机构名称" width="250">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="text" icon='el-icon-edit-outline' @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon='el-icon-close' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button @click="fuwuMedical(scope.$index, scope.row)" type="text" size="small">
              服务医疗机构
            </el-button>
            <el-button @click="trainRecord(scope.$index, scope.row)" type="text" size="small">
              培训记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <iframe id="rfFrame" name="rfFrame" src="about:blank" style="display:block;height:0;width:0"></iframe>
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
    // 验证名字和身份证号是否存在
    var checkName = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('姓名不能为空'))
      // }
      setTimeout(() => {
        const jsonurl = `/validWastePerson?id=${this.ruleForm.id}&name=${this.ruleForm.name}&cardno=${this.ruleForm.cardno}`
        axios.get(jsonurl).then((response) => {
          if (response.data.msg === 'name') {
            callback(new Error('该姓名已存在'))
          } else if (response.data.msg === 'name,cardno' || response.data.msg === 'cardno') {
            callback(new Error('该身份证号已存在'))
          } else {
            callback()
          }
        })
      }, 500)
    }
    // var checkCardNo = (rule, value, callback) => {
    //   setTimeout(() => {
    //     const jsonurl = `/validWastePerson?id=${this.ruleForm.id}&name=${this.ruleForm.name}&cardno=${this.ruleForm.cardno}`
    //     axios.get(jsonurl).then((response) => {
    //       if (response.data.msg.indexOf('cardno') !== -1) {
    //         callback(new Error('身份证号已存在'))
    //       } else {
    //         callback()
    //       }
    //     })
    //   }, 500)
    // }
    return {
      filetypes: ['xls', 'XLSX', 'xlsx'],
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVisible4: false,
      tableData: [],
      fuwuMedicalData: [],
      trainRecordTable: [],
      // 多选数组
      multipleSelection: [],
      // 搜索条件
      name: '',
      cardno: '',
      // 下拉菜单选项
      select: '',
      // 默认每页数据量
      pagesize: 10,
      pagesizeRecord: 10,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPage: 1,
      currentPageRecord: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      totalCountRecord: 1000,
      // dialogForm1Visible: false,
      formLabelWidth: '120px',
      ruleForm: {
        id: '',
        name: '',
        sex: '',
        code: '',
        cardno: '',
        photo: [],
        remark: '',
        cardTime: ''
      },
      rules2: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        cardno: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ]
      },
      erweima: '',
      id: '',
      userId: '',
      dialogTableVisible2: false,
      dialogFormVisible: false,
      dialogTableVisible3: false,

      titleMap: {
        addCompany: '新增处理人员信息',
        editCompany: '编辑处理人员信息'
      },
      dialogStatus: '',
      meters: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
  },
  mounted() {
    document.$vue = this
    document.getElementById('rfFrame').addEventListener('load', function() {
      var text = $('#rfFrame').contents().find('body').text()
      var obj = JSON.parse(text)
      // console.log(obj.data)
      document.$vue.$message({
        message: obj.data,
        type: 'success'
      })
      document.$vue.dialogVisible4 = false
    })
  },
  computed: {
    uploadDisabled: function() {
      return this.ruleForm.photo.length > 0
    }
  },
  methods: {
    // 校验文件类型
    formsubmit(event) {
      const fileele = document.querySelector('.seltn')
      const filetype = fileele.value.substr(fileele.value.lastIndexOf('.') + 1)
      if (!this.filetypes.includes(filetype)) {
        this.$message('文件类型不符！请选择excel文件')
        event.preventDefault()
      }
    },
    // 重置搜索条件
    resetSearch() {
      this.name = ''
      this.cardno = ''
    },
    // 按照企业名称搜索
    search: function() {
      if (this.orgName === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        var url = '/wastePersons'
        axios.get(url, {
          params: {
            page: 1,
            size: this.pagesize,
            name: this.name,
            cardno: this.cardno
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
    // 导出处理人员
    doExport: function() {
      var url = '/gtp-server/person-mode'
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
      this.ruleForm.photo = this.ruleForm.photo.filter(t => t.id !== file.id)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      // console.log(res.data)
      this.ruleForm.photo.push(res.data)
      this.ruleForm.photo[0].url = '/gtp-server/photo-image/' + res.data.id
      // this.uploadDisabled()
      // this.dialogImageUrl = '/gtp-server/photo-image/' + res.data.id
    },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    // },
    // 从服务器读取数据
    loadData: function(page, size) {
      axios.get('/wastePersons', {
        params: {
          page: page,
          size: size,
          name: this.name,
          cardno: this.cardno
        }
      })
        .then(response => {
          // if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.tableData = data
          this.totalCount = response.data.data.total
          // }
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
      this.ruleForm.id = ''
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    // 根据id查询企业信息
    // 编辑
    handleEdit: function(index, row) {
      // console.log(row)
      this.dialogFormVisible = true
      this.dialogStatus = 'editCompany'
      this.titleMap.editCompany = '编辑处理人员信息' + '--' + row.name
      this.$nextTick(() => {
        // 根据id获取接口
        var url = '/wastePerson/' + row.id
        axios.get(url).then((response) => {
          if (response.data.msg === 'success') {
            // var qrURL = '/qrcode/' + row.id
            // axios.get(qrURL).then((response) => {
            //   console.log(response.data)
            // })
            this.erweima = '/gtp-server/qrcode/' + row.id
            this.ruleForm.id = row.id
            this.ruleForm.name = response.data.data.name
            this.ruleForm.sex = response.data.data.sex
            this.ruleForm.code = response.data.data.code
            this.ruleForm.cardno = response.data.data.cardno
            this.ruleForm.remark = response.data.data.remark
            this.ruleForm.cardTime = response.data.data.cardTime
            console.log(this.ruleForm)
            if (response.data.data.photo) {
              this.ruleForm.photo.push({
                'name': '',
                'url': '/gtp-server/photo-image/' + response.data.data.photo
              })
            }
            // console.log(this.ruleForm)
          }
        })
      })
    },
    // 保存企业信息
    saveCompany: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var postdata = {
            name: this.ruleForm.name,
            sex: this.ruleForm.sex,
            code: this.ruleForm.code,
            cardno: this.ruleForm.cardno,
            photo: this.ruleForm.photo[0],
            remark: this.ruleForm.remark,
            cardTime: this.ruleForm.cardTime,
            id: this.ruleForm.id
          }
          if (this.dialogStatus === 'addCompany') {
            axios.post('/wastePerson', postdata).then((response) => {
              if (response.data.msg === 'success') {
                // this.uploadDisabled()
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
            // console.log(postdata)
            axios.put('/wastePerson', postdata).then((response) => {
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
    // 查询单个废弃物处理人员的服务医疗机构
    fuwuMedical: function(index, row) {
      this.dialogTableVisible2 = true
      this.personId = row.id
      // 加载签到列表
      this.getPersonMedical(this.personId, '', '')
    },
    // 查询单个废弃物处理人员的培训记录
    trainRecord: function(index, row) {
      this.dialogTableVisible3 = true
      this.cardno1 = row.cardno
      this.getPersonTrainRecord(this.cardno1, this.currentPageRecord, this.pagesizeRecord)
    },
    // 加载单个处理人员列表
    getPersonMedical: function(personId, pageNumber, pageSize) {
      axios.get('/servceOrgs', {
        params: {
          personId: this.personId,
          page: pageNumber,
          size: pageSize
        }
      }).then((response) => {
        // console.log(response.data)
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.fuwuMedicalData = data
          // this.totalCount = response.data.data.total
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
    // 培训记录每页显示数据量变更
    handleSizeChangeRecord: function(val) {
      this.pagesizeRecord = val
      this.currentPageRecord = 1
      this.getPersonTrainRecord(this.cardno1, this.currentPageRecord, this.pagesizeRecord)
    },
    // 培训记录页码变更
    handleCurrentChangeRecord: function(val) {
      this.currentPageRecord = val
      this.getPersonTrainRecord(this.cardno1, this.currentPageRecord, this.pagesizeRecord)
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
    // 查询单个培训人员培训记录
    getPersonTrainRecord: function(cardno, page, size) {
      axios.get('/trainPerson', {
        params: {
          cardno: this.cardno1,
          page: page,
          size: size
        }
      }).then((response) => {
        // console.log(response.data)
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.trainRecordTable = data
          this.totalCountRecord = response.data.data.total
        }
      })
    },
    // 删除
    handleDelete: function(index, row) {
      this.$confirm('确定删除处理人员信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = row.id
        var data = []
        data.push(ids)
        axios.delete('/wastePerson', { data: data }).then(response => {
          if (response.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.loadData(this.currentPage, this.pagesize)
          }
        })
      })
        .catch(() => {
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
          message: '请至少选择一项培训信息',
          type: 'info'
        })
      } else {
        this.multipleSelection.forEach((item) => {
          var ids = item.id
          data.push(ids)
        })
        axios.delete('/wastePerson', { data: data }).then((response) => {
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
.disabled .el-upload--picture-card {
  display: none;
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


