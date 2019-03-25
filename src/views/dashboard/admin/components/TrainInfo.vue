<template>
  <div class="fbody">
    <el-row :gutter="4">
      <el-col :md="5" :lg="6">
        <!-- <el-input v-model="search" placeholder="请输入搜索内容" clearable></el-input> -->
        <el-date-picker style="width:96%" v-model="dateRange" type="daterange" range-separator="至" start-placeholder="培训开始日期" end-placeholder="培训结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :md="5" :lg="5">
        <el-input v-model="place" placeholder="按照培训地点进行搜索" clearable></el-input>
      </el-col>
      <el-col :md="4" :lg="5">
        <el-input v-model="content" placeholder="按照培训内容进行搜索" clearable></el-input>
      </el-col>
      <el-col :md="4" :lg="4">
        <el-button type="primary" icon="el-icon-search" v-on:click="searchByDate">搜索</el-button>
        <el-button type="success" icon="el-icon-refresh" v-on:click="resetSearch">重置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px; margin-bottom:10px;">
      <el-col>
        <el-button type="primary" @click="addCompany('ruleForm')" icon='el-icon-plus'>添加</el-button>
        <el-button type="success" @click="deletenames" icon='el-icon-delete'>批量删除</el-button>
        <el-button type="danger" @click="doExport()" icon='el-icon-download'>下载报名表</el-button>
      </el-col>
    </el-row>
    <!-- 新增废弃物处理管理单位弹窗start -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog">

      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训开始时间" prop="startDate" :rules="[
      { required: true, message: '请输入协议开始时间', trigger: 'blur' }
    ]">
              <!-- <el-date-picker v-model="ruleForm.startDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                </el-date-picker> -->
              <el-date-picker style="width: 94%" v-model="ruleForm.startDate" type="date" @change="startDateChange" placeholder="选择日期时间" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="培训结束时间" prop="endDate" :rules="[
      { required: true, message: '请输入培训结束时间', trigger: 'blur' }
    ]">
              <el-date-picker style="width: 94%" v-model="ruleForm.endDate" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训地点" prop="place" :rules="[
      { required: true, message: '请输入地址信息', trigger: 'blur' }
    ]">
              <el-input v-model="ruleForm.place"></el-input>
            </el-form-item>
            <el-form-item label="培训内容" prop="content" :rules="[
      { required: true, message: '请输入培训内容', trigger: 'blur' }
    ]">
              <el-input v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item label="上传照片" prop="photos">
              <el-upload action="/gtp-server/upload" list-type="picture-card" accept="image/jpeg,image/gif,image/png" :on-preview="handlePictureCardPreview" :on-success="handleAvatarSuccess" :on-remove="handleRemove" :file-list="ruleForm.photos">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-row>
            </el-row>
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
      <el-table ref="multipleTable" border :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="startDate" label="培训开始时间" width="200">
        </el-table-column>
        <el-table-column prop="endDate" label="培训结束时间" width="200">
        </el-table-column>
        <el-table-column prop="place" label="培训地点" width="150">
        </el-table-column>
        <el-table-column prop="content" label="培训内容" width="150">
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="150">
        </el-table-column>
        <el-table-column label="操作" width="340">
          <template slot-scope="scope">
            <!-- 签到弹框 -->
            <el-dialog title="签到列表" :visible.sync="dialogTableVisible">
              <el-autocomplete v-model="selectPerson" :fetch-suggestions="querySearchAsync" style="width: 250px" placeholder="请输入身份证号" @select="handleSelect"></el-autocomplete>
              <!-- <el-input v-model="input" style="width: 250px" placeholder="请输入编号或者身份证号"></el-input> -->
              <el-button type="danger" @click="saveQianDao()">签到</el-button>
              <el-table :data="gridData">
                <el-table-column type="index" width="100">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="150"></el-table-column>
                <el-table-column prop="code" label="编号" width="150"></el-table-column>
                <el-table-column prop="cardno" label="姓名" width="200"></el-table-column>
                <el-table-column prop="time" label="签到时间"></el-table-column>
              </el-table>
              <div style="margin-top: 10px; margin-bottom: 10px">
                <span>签到人数：{{signCount}}</span>
                <span class="notSign">未签到人数：{{nsignCount}}</span>
              </div>
              <el-pagination @size-change="handleSizeChangeQianDao" @current-change="handleCurrentChangeQianDao" :current-page="currentPageQianDao" :page-sizes="[10, 20, 30, 40]" :page-size="pagesizeQianDao" layout="total, sizes, prev, pager, next, jumper" :total="totalCountQianDao">
              </el-pagination>
            </el-dialog>
            <!-- 签到弹框结束 -->
            <el-button icon='el-icon-edit-outline' @click="handleEdit(scope.$index, scope.row)" type="text" size="small">
              编辑
            </el-button>
            <el-button icon='el-icon-close' @click="handleDelete(scope.$index, scope.row)" type="text" size="small">
              删除
            </el-button>
            <el-button @click="daoruBaoming(scope.$index, scope.row)" type="text" size="small">导入报名表</el-button>
            <el-button @click="handleQianDao(scope.$index, scope.row)" type="text" size="small">
              签到
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination class="pstyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
    <iframe id="rfFrame" name="rfFrame" src="about:blank" style="display:block;height:0;width:0"></iframe>
    <!-- 导入报名表start -->
    <el-dialog title="导入报名表" :visible.sync="dialogVisible3" width="30%">
      <form :action="'/gtp-server/train-person/' + trainId" method="post" target="rfFrame" style="height: 50px" enctype="multipart/form-data">
        <input type="file" class="seltntrain" name="file" multiple="multiple" />
        <input type="submit" class="subtn" @click="formsubmit()" />
      </form>
      <!-- <form action="/gtp-server/medicalOrgs" method="post" target="rfFrame" style="height: 50px" enctype="multipart/form-data">
        <input type="file" class="seltn" name="file" multiple="multiple" />
        <input type="submit" class="subtn" @click="formsubmit" />
      </form> -->
    </el-dialog>
    <!-- 导入报名表end -->
  </div>
</template>
<script>
import axios from '@/utils/request'
import $ from 'jquery'
export default {
  name: 'dashboard-admin',
  data() {
    // 验证培训
    var check = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('姓名不能为空'))
      // }
      setTimeout(() => {
        const jsonurl = `/trainValid?id=${this.ruleForm.id}&name=${this.ruleForm.name}&cardno=${this.ruleForm.cardno}`
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
    return {
      filetypes: ['xls', 'XLSX', 'xlsx'],
      dialogImageUrl: '',
      dialogVisible3: false,
      trainId: '',
      dialogVisible: false,
      gridData: [],
      input: '',
      tableData: [],
      signCount: '',
      nsignCount: '',
      options: [{
        value: '选项1',
        label: '001'
      }, {
        value: '选项2',
        label: '002'
      }],
      value8: '',
      files: [],
      // 多选数组
      multipleSelection: [],
      // 按地点搜索
      place: '',
      // 按内容搜索
      content: '',
      // 搜索
      dateRange: [],
      // 下拉菜单选项
      select: '',
      // 默认每页数据量
      pagesize: 10,
      pagesizeQianDao: 10,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPage: 1,
      currentPageQianDao: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      totalCountQianDao: 1000,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      ruleForm: {
        startDate: '',
        endDate: '',
        place: '',
        content: '',
        photos: [],
        remark: '',
        id: ''
      },
      restaurants: [],
      selectPerson: '',
      timeout: null,
      trainId: '',
      dialogFormVisible: false,
      titleMap: {
        addCompany: '新增培训信息',
        editCompany: '编辑培训信息'
      },
      dialogStatus: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
    // 得到所有的处理人员 然后根据身份证号 可搜索
    this.loadAll()
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
      document.$vue.dialogVisible3 = false
    })
  },
  methods: {
    // openFullScreen2() {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    //   setTimeout(() => {
    //     loading.close()
    //   }, 2000000)
    // },
    // 校验文件类型
    formsubmit(event) {
      const fileele = document.querySelector('.seltntrain')
      const filetype = fileele.value.substr(fileele.value.lastIndexOf('.') + 1)
      if (!this.filetypes.includes(filetype)) {
        this.$message('文件类型不符！请选择excel文件')
        event.preventDefault()
      }
    },
    // 重置搜索条件
    resetSearch() {
      this.dateRange = ''
      this.place = ''
      this.content = ''
    },
    // 导入报名表
    daoruBaoming: function(index, row) {
      this.trainId = row.id
      this.dialogVisible3 = true
      console.log(row)
    },
    // 导出报名表
    doExport: function() {
      // console.log(this.openFullScreen2())
      var url = '/gtp-server/train-person-mode'
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
    // form重新定向url
    // 获取开始时间
    startDateChange(val) {
      var today = parseInt(val.slice(0, 4))
      this.ruleForm.endDate = today + '-' + val.slice(5, 7) + '-' + val.slice(8, 10)
    },
    // 按时间区间搜索上报记录
    searchByDate: function() {
      if (this.dateRange === null && this.place === '' && this.content === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        // var dateRange = this.dateRange
        axios.get('/trains', {
          params: {
            page: 1,
            size: this.pagesize,
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
            place: this.place,
            content: this.content
          }
        }).then((response) => {
          if (response.data.msg === 'success') {
            var data = response.data.data.rows
            this.tableData = data
            // console.log(data)
            // var jsonData = []
            // jsonData = data
            // var companyId = this.companyId
            // this.tableData = jsonData.filter(function(item, index, arr) {
            //   return (item.companyId === companyId)
            // })
            // for (let i = 0; i < data.length; i++) {
            //   data[i].isEdit = false
            // }
            this.totalCount = this.tableData.length
          }
        })
      }
    },
    // 得到所有的处理人员
    loadAll() {
      axios.get('/wastePersons', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        // console.log(responsedata)
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.restaurants.push({
              value: item.name + ':' + item.cardno,
              label: item.cardno
            })
          })
        }
      })
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 30 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect(item) {
      this.selectPerson = item.label
    },
    mounted() {
      this.restaurants = this.loadAll()
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
      this.ruleForm.photos = this.ruleForm.photos.filter(t => t.id !== file.id)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.photos.push(res.data)
      res.data.url = '/gtp-server/photo-image/' + res.data.id
      // console.log(this.ruleForm)
      // this.ruleForm.photo[0].url = '/gtp-server/photo-image/' + res.data.id
    },
    // 从服务器读取数据
    loadData: function(page, size) {
      var dateRange = this.dateRange
      console.log(dateRange)
      axios.get('/trains', {
        params: {
          page: page,
          size: size,
          startDate: dateRange === null ? '' : dateRange[0],
          endDate: dateRange === null ? '' : dateRange[1],
          place: this.place,
          content: this.content
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
      })
    },
    // 根据id查询企业信息
    // 编辑
    handleEdit: function(index, row) {
      console.log(row)
      this.dialogFormVisible = true
      this.dialogStatus = 'editCompany'
      this.titleMap.editCompany = '编辑培训信息'
      this.$nextTick(() => {
        // 根据id获取企业信息接口暂时不能使用  目前使用绑定值方式
        var url = '/train/' + row.id
        axios.get(url).then((response) => {
          if (response.data.msg === 'success') {
            this.ruleForm = response.data.data
            for (var i = 0; i < this.ruleForm.photos.length; i++) {
              this.ruleForm.photos[i].name = this.ruleForm.photos[i].fileName
              this.ruleForm.photos[i].url = '/gtp-server/photo-image/' + this.ruleForm.photos[i].id
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
          axios.get('/trainValid', {
            params: {
              place: this.ruleForm.place,
              content: this.ruleForm.content,
              startDate: this.ruleForm.startDate,
              endDate: this.ruleForm.endDate,
              id: this.ruleForm.id
            }
          }).then((response) => {
            if (response.data.msg === 'success') {
              if (this.dialogStatus === 'addCompany') {
                axios.post('/train', this.ruleForm).then((response) => {
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
                axios.put('/train', this.ruleForm).then((response) => {
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
            } else if (response.data.msg === 'failed') {
              this.$message({
                message: '该培训已存在',
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
    // 签到列表页码变更
    handleCurrentChangeQianDao: function(val) {
      this.currentPageQianDao = val
      this.currentPageQianDao = 1
      this.getTrainPerson(this.trainId, this.currentPageQianDao, this.pagesizeQianDao)
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.currentPage = 1
      this.loadData(this.currentPage, this.pagesize)
    },
    // 签到页每页显示数据量的变更
    handleSizeChangeQianDao: function(val) {
      this.pagesizeQianDao = val
      this.getTrainPerson(this.trainId, this.currentPageQianDao, this.pagesizeQianDao)
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
    // 签到
    handleQianDao: function(index, row) {
      this.selectPerson = ''
      this.dialogTableVisible = true
      this.trainId = row.id
      // 加载签到列表
      this.getTrainPerson(row.id, this.currentPageQianDao, this.pagesizeQianDao)
    },
    // 二维码签到
    QRcodeQianDao: function(index, row) {
      this.dialogTableVisible = true
    },
    // 签到保存
    saveQianDao: function() {
      var postdata = {
        cardNo: this.selectPerson,
        trainId: this.trainId
      }
      if (this.selectPerson === '') {
        this.$message({
          message: '未选择签到人员',
          type: 'warning'
        })
      } else {
        axios.put('/trainPerson', postdata).then((response) => {
          if (response.data.msg === 'success') {
            this.$message({
              message: '签到成功',
              type: 'success'
            })
            this.selectPerson = ''
            this.getTrainPerson(this.trainId, this.currentPageQianDao, this.pagesizeQianDao)
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 获取废弃物处理人员
    getTrainPerson: function(trainId, page, size) {
      axios.get('/trainPersons', {
        params: {
          trainId: trainId,
          page: page,
          size: size
        }
      }).then((response) => {
        // console.log(response.data)
        if (response.data.msg === 'success') {
          // 调用签到人数
          this.getSignCount()
          var data = response.data.data.rows
          this.gridData = data
          this.totalCountQianDao = response.data.data.total
          console.log(this.totalCountQianDao)
        }
      })
    },
    // 签到合计
    getSignCount() {
      var signData = {
        trainId: this.trainId
      }
      axios.post('/signNum', signData).then((response) => {
        if (response.data.msg === 'success') {
          var total = this.totalCountQianDao
          var count = response.data.data
          this.signCount = response.data.data + '人'
          this.nsignCount = (total - count) + '人'
        }
      })
    },
    // 多选响应
    // handleSelectionChange: function(val) {
    //   this.multipleSelection = val
    // },
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
        axios.delete('/train', { data: data }).then((response) => {
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
          message: '请至少选择一项培训信息',
          type: 'info'
        })
      } else {
        this.multipleSelection.forEach((item) => {
          var ids = item.id
          data.push(ids)
        })
        axios.delete('/train', { data: data }).then((response) => {
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
.notSign {
  display: inline-block;
  padding-left: 120px;
  color: red;
}
</style>


