<template>
  <div class="fbody">
    <el-row :gutter="2">
      <el-col :md="4" :lg="5">
        <el-input v-model="orgName" placeholder="请输入机构名称" clearable></el-input>
      </el-col>
      <el-col :md="4" :lg="3">
        <el-select v-model="sousuo.managerCode" class="dy" filterable placeholder="请选择管理单位" clearable @change="selectmanager">
          <el-option v-for="item in manageinfo" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="4" :lg="3">
        <el-select v-model="sousuo.orgClass" @change="selectGet" placeholder="请选择机构级别" clearable>
          <el-option v-for="item in orgTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="8" :lg="8">
        <el-select v-model="sousuo.nature2" @change="selectByNature2" placeholder="请选择经营性质" clearable>
          <el-option v-for="item in selectNature2" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" v-on:click="search">搜索</el-button>
        <el-button type="success" icon="el-icon-refresh" v-on:click="resetSearch">重置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px; margin-bottom:10px;">
      <el-button type="primary" @click="addCompany('ruleForm')" icon='el-icon-plus'>添加</el-button>
      <el-button type="success" @click="deletenames" icon='el-icon-delete'>批量删除</el-button>
      <el-button type="info" @click="dialogVisible = true" icon='el-icon-upload'>导入审批医疗机构</el-button>
      <el-button type="danger" @click="doExport()" icon='el-icon-download'>下载医疗机构</el-button>
    </el-row>
    <!-- 导入医疗机构信息弹框start -->
    <el-dialog title="导入医疗机构文件" :visible.sync="dialogVisible" width="30%">
      <form action="/gtp-server/medicalOrgs" method="post" target="rfFrame" style="height: 50px" enctype="multipart/form-data">
        <input type="file" class="seltn" name="file" multiple="multiple" />
        <input type="submit" class="subtn" @click="formsubmit" />
      </form>
    </el-dialog>
    <!-- 导入医疗机构信息弹框end -->
    <!-- 新增企业弹窗start -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog" style="top:-100px" :lock-scroll='false'>
      <el-scrollbar style="height:600px">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-form-item label="管理单位" prop="managerUnit" :rules="[{ required: true, message: '请输入管理单位', trigger: 'change' }]">
              <el-select style="width: 95%" v-model="ruleForm.managerUnit" class="dy" filterable placeholder="请选择管理单位" @change="currentSel">
                <el-option v-for="item in ManageNameNew" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="机构名称" prop="orgName" :rules="rulesname">
              <el-input v-model="ruleForm.orgName"></el-input>
            </el-form-item>
            <el-form-item label="机构第二名称" prop="secondName">
              <el-input v-model="ruleForm.secondName"></el-input>
            </el-form-item>
            <el-form-item label="机构地址" prop="orgAdr" :rules="[{ required: true, message: '请输入机构地址', trigger: 'blur' }]">
              <el-input v-model="ruleForm.orgAdr"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="登记号" prop="registerNo" :rules="[{ required: true, message: '请输入登记号', trigger: 'blur' }]">
                  <el-input v-model="ruleForm.registerNo" width="350px"></el-input>
                </el-form-item>
                <el-form-item label="全国唯一识别码" prop="uncode" :rules="[{ required: true, message: '请输入识别码', trigger: 'blur' }]">
                  <el-input v-model="ruleForm.uncode" class="sbm"></el-input>
                </el-form-item>
                <el-form-item label="机构类别" prop="orgKind" :rules="[
            { required: true, message: '请输入机构类别', trigger: 'blur' }
          ]">
                  <el-input v-model="ruleForm.orgKind"></el-input>
                </el-form-item>
                <el-form-item label="当前状态" prop="nowStatus" :rules="[
            { required: true, message: '请选择状态', trigger: 'change' }
          ]">
                  <el-select v-model="ruleForm.nowStatus" placeholder="请选择">
                    <el-option v-for="item in seletStatus" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="机构级别" prop="orgClass" :rules="[
            { required: true, message: '请选择机构级别', trigger: 'change' }
          ]">
                  <!-- <el-input v-model="ruleForm.orgKind"></el-input> -->
                  <el-select v-model="ruleForm.orgClass" placeholder="请选择">
                    <el-option v-for="item in orgTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="12">
                <el-form-item label="服务对象" prop="serviceObject" :rules="[{ required: true, message: '请选择服务对象', trigger: 'blur' }]">
                  <el-select v-model="ruleForm.serviceObject" placeholder="请选择">
                    <el-option v-for="item in fuwuModel" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="机构等次" prop="orgGrade">
                  <el-select v-model="ruleForm.orgGrade" placeholder="请选择">
                    <el-option v-for="item in orgGrades" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所有制形式" prop="ownership">
                  <!-- <el-input v-model="ruleForm.ownership"></el-input> -->
                  <el-select v-model="ruleForm.ownership" placeholder="请选择所有制形式">
                    <el-option v-for="item in ownershipType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="经营性质" prop="nature2" :rules="[
            { required: true, message: '请选择经营性质', trigger: 'change' }
          ]">
                  <el-select v-model="ruleForm.nature2" placeholder="请选择">
                    <el-option v-for="item in selectNature2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="经营性质(审批)" prop="nature" :rules="[
            { required: true, message: '请选择经营性质', trigger: 'change' }
          ]">
                  <el-select v-model="ruleForm.nature" placeholder="请选择">
                    <el-option v-for="item in selectNature" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

          </el-row>
          <hr style=" height:30px;border:none;border-top:2px dashed #ccc;" />
          <el-row>
            <el-col :span="12">
              <el-form-item label="电话号码" prop="tel" :rules="[{ required: true, message: '请输入电话号码', trigger: 'blur' }]">
                <el-input v-model="ruleForm.tel"></el-input>
              </el-form-item>
              <el-form-item label="邮政编码" prop="zipCode">
                <el-input v-model="ruleForm.zipCode"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名" prop="legalPersonName" :rules="[{ required: true, message: '请输入法人姓名', trigger: 'blur' }]">
                <el-input v-model="ruleForm.legalPersonName"></el-input>
              </el-form-item>
              <el-form-item label="法人证件号" prop="legalPersonNo" :rules="[{ required: true, message: '请输入法人证件号码', trigger: 'blur' }]">
                <el-input v-model="ruleForm.legalPersonNo"></el-input>
              </el-form-item>
              <el-form-item label="负责人姓名" prop="chargePerName" :rules="[{ required: true, message: '请输入负责人姓名', trigger: 'blur' }]">
                <el-input v-model="ruleForm.chargePerName"></el-input>
              </el-form-item>
              <el-form-item label="负责人证件号" prop="chargePerNo" :rules="[{ required: true, message: '负责人证件号码', trigger: 'blur' }]">
                <el-input v-model="ruleForm.chargePerNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请日期" prop="applyDate">
                <el-date-picker v-model="ruleForm.applyDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="批准日期" prop="authDate">
                <el-date-picker v-model="ruleForm.authDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="有效期开始日期" prop="effStartDate">
                <el-date-picker v-model="ruleForm.effStartDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="有效期截止日期" prop="effEndDate">
                <el-date-picker v-model="ruleForm.effEndDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="开业日期" prop="openDate">
                <el-date-picker v-model="ruleForm.openDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="下一校验日" prop="nextCheckDate">
                <el-date-picker v-model="ruleForm.nextCheckDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <hr style=" height:30px;border:none;border-top:2px dashed #ccc;" />
          <el-row>
            <el-col :span="12">
              <el-form-item label="批准文号" prop="authNo">
                <el-input v-model="ruleForm.authNo"></el-input>
              </el-form-item>
              <el-form-item label="诊疗科目代码" prop="treatSubjecCode">
                <el-input type="textarea" v-model="ruleForm.treatSubjecCode"></el-input>
              </el-form-item>
              <el-form-item label="登记发证机关" prop="regisOrg">
                <el-input v-model="ruleForm.regisOrg"></el-input>
              </el-form-item>
              <el-form-item label="行政区域" prop="administrativeArea">
                <el-input v-model="ruleForm.administrativeArea"></el-input>
              </el-form-item>
              <el-form-item label="是否为管理单位" prop="isManger" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]">
                <template>
                  <el-radio v-model="radio" label="1">是</el-radio>
                  <el-radio v-model="radio" label="2">否</el-radio>
                </template>
              </el-form-item>
              <el-form-item label="服务方式">
                <el-checkbox-group v-model="ruleForm.serviceType">
                  <el-checkbox label="门诊服务"></el-checkbox>
                  <el-checkbox label="住院服务"></el-checkbox>
                  <el-checkbox label="巡诊服务"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="隶属关系" prop="subordinate">
                <el-input v-model="ruleForm.subordinate"></el-input>
              </el-form-item>
              <el-form-item label="诊疗科目名称" prop="treatSubjectName">
                <el-input type="textarea" style="widht: 300px" v-model="ruleForm.treatSubjectName"></el-input>
              </el-form-item>
              <el-form-item label="床位数" prop="beds" :rules="[{ required: true, message: '请输入床位数', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
                <el-input v-model.number="ruleForm.beds"></el-input>
              </el-form-item>
              <el-form-item label="牙椅数" prop="toothChair" :rules="[{ required: true, message: '请输入牙椅数', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
                <el-input v-model.number="ruleForm.toothChair"></el-input>
              </el-form-item>
              <el-form-item label="注册资金" prop="registerFund" :rules="[{ required: true, message: '请输入注册资金', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}]">
                <el-input v-model.number="ruleForm.registerFund"></el-input>
              </el-form-item>
              <el-form-item label="街道" prop="street">
                <el-input v-model="ruleForm.street"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="callOf('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="saveCompany('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增企业弹窗end -->
    <template>
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="55">
        </el-table-column>
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
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" icon='el-icon-edit-outline' @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
            <el-button @click="choseRizhi(scope.$index, scope.row)" type="text" size="small">
              日志
            </el-button>
            <el-button @click="chosePerson(scope.$index, scope.row)" type="text" size="small">
              人员信息管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 日志弹框start -->
      <el-dialog title="日志信息" :visible.sync="dialogTableVisible1">
        <el-button type="danger" @click="saveCompare">对比</el-button>
        <el-button type="success" @click="savereSet">还原</el-button>
        <el-table :data="rizhiData" style="width: 100%">
          <el-table-column label="" width="75">
            <template scope="scope">
              <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="机构名称" width="150">
          </el-table-column>
          <el-table-column prop="registerNo" label="登记号" width="150">
          </el-table-column>
          <el-table-column prop="uncode" label="全国唯一识标码" width="150">
          </el-table-column>
          <el-table-column prop="orgAdr" label="机构地址" width="150">
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
        <el-pagination @size-change="handleSizeChangeRizhi" @current-change="handleCurrentChangeRizhi" :current-page="currentPageRizhi" :page-sizes="[10, 20, 30, 40]" :page-size="pagesizeRizhi" layout="total, sizes, prev, pager, next, jumper" :total="totalCountRizhi">
        </el-pagination>
      </el-dialog>
      <!-- 日志弹框end -->
      <!-- 对比弹框start -->
      <el-dialog title="对比结果" :visible.sync="compareDialog">
        <el-table :data="comparegridData">
          <el-table-column property="comparecontent" label="对比内容" width="150"></el-table-column>
          <el-table-column property="currentvalue" label="当前值" width="200"></el-table-column>
          <el-table-column property="prevvalue" label="历史值"></el-table-column>
          <el-table-column property="compareresult" label="对比结果">
            <template slot-scope="scope">
              <p v-html='scope.row.compareresult'></p>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 对比弹框end -->
      <!-- 人员信息管理start -->
      <el-dialog title="人员信息管理" :visible.sync="dialogTableVisible2">
        <!-- <el-autocomplete v-model="personinfo" :fetch-suggestions="querySearchAsync" style="width: 250px" placeholder="请输入姓名" @select="handleSelect"></el-autocomplete> -->
        <el-select v-model="personinfo.id" filterable placeholder="请选择">
          <el-option v-for="item in selectPerson" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="danger" @click="savePerson">添加</el-button>
        <el-table :data="personData">
          <el-table-column prop="code" label="编号" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="sex" label="性别" width="100"></el-table-column>
          <el-table-column prop="cardno" label="身份证号" width="150"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" icon='el-icon-close' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 人员信息管理弹框end -->
      <!-- 对比弹框start -->
      <!-- <el-dialog title="机构对比" :visible.sync="dialogTableVisible3">
        <el-table :data="gridData2">
          <el-table-column prop="org_name" label="西青医院" width="150"></el-table-column>
          <el-table-column prop="date" label="中北医院" width="200"></el-table-column>
          <el-table-column prop="date" label="对比结果" width="200"></el-table-column>
        </el-table>
      </el-dialog> -->
      <!-- 对比弹框弹框end -->
    </template>
    <el-pagination class="pstyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
    <iframe id="rfFrame" name="rfFrame" src="about:blank" style="display:block;height:0;width:0"></iframe>
  </div>
</template>
<script>
import axios from '@/utils/request'
import $ from 'jquery'
var color = require('colors')
var jsdiff = require('diff')
export default {
  name: 'dashboard-admin',
  data() {
    // 验证机构名称
    var checkorgName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('机构名称不能为空'))
      }
      setTimeout(() => {
        // 调用接口判断名称是否已经存在
        var url = '/medicalOrgValid/?orgName=' + value + '&id=' + this.orgID + ''
        var params = new URLSearchParams()
        params.append('orgName', value)
        params.append('id', this.orgID)
        axios.get(url).then((response) => {
          if (response.data.msg === 'failed') {
            callback(new Error('机构名称已存在'))
          } else {
            callback()
          }
        })
      }, 500)
    }
    return {
      filetypes: ['xls', 'XLSX', 'xlsx'],
      rulesname: [{ required: true, validator: checkorgName, trigger: 'blur' }],
      orgID: '',
      personinfo: '',
      tableData: [],
      radio: '1',
      // 机构列表单击日志显示日志列表
      rizhiData: [],
      fileList: [],
      files: [],
      personData: [],
      gridData2: [],
      // 多选数组
      multipleSelection: [],
      // 搜索条件
      orgName: '',
      // 下拉菜单选项
      select: '',
      // 默认每页数据量
      pagesize: 10,
      pagesizeRizhi: 10,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPage: 1,
      currentPageRizhi: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      totalCountRizhi: 1000,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      compareDialog: false,
      dialogVisible: false,
      tiaojianSearchDialog: false,
      formLabelWidth: '120px',
      ruleForm: {
        orgName: '',
        status: '',
        registerNo: '',
        uncode: '',
        secondName: '',
        orgAdr: '',
        tel: '',
        zipCode: '',
        legalPersonName: '',
        legalPersonNo: '',
        egalPersonNo: '',
        chargePerName: '',
        chargePerNo: '',
        applyDate: '',
        authDate: '',
        authNo: '',
        effStartDate: '',
        effEndDate: '',
        regisOrg: '',
        administrativeArea: '',
        ownership: '',
        subordinate: '',
        serviceObject: '',
        orgKind: '',
        orgClass: '',
        orgGrade: '',
        nature: '',
        nature2: '',
        beds: '',
        toothChair: '',
        openDate: '',
        registerFund: '',
        nextCheckDate: '',
        treatSubjectName: '',
        treatSubjecCode: '',
        serviceType: [],
        street: '',
        wasteNum: '',
        whetherTraining: '',
        isManger: '',
        remark1: '',
        nowStatus: '',
        id: '',
        managerId: '',
        managerUnit: '',
        managerCode: ''
      },
      sousuo: {
        managerUnit: '',
        orgClass: '',
        nature2: '',
        managerCode: ''
      },
      // 处理人员
      personinfo: {
        name: '',
        id: '',
        cardno: ''
      },
      // 处理人员下拉选择
      selectPerson: [],
      // 服务对象
      fuwuModel: [],
      // 管理单位
      ManageNameNew: [],
      manageinfo: [],
      // 服务等次
      orgGrades: [],
      // 当前状态
      seletStatus: [],
      //  options
      options: [],
      // 所有制形式
      ownershipType: [],
      // 机构类别
      orgTypes: [],
      selectNature2: [],
      selectNature: [],
      value: '',
      id: '',
      dialogFormVisible: false,
      titleMap: {
        addCompany: '新增机构信息',
        editCompany: '编辑机构信息'
      },
      dialogStatus: '',
      // showOrfade: false,
      templateRadio: '',
      // 日志选中行
      templateSelection: '',
      // 当前列表被点击日志行
      currentOrg: '',
      // 对比结果弹出框列表数据
      comparegridData: [],
      formateValue: '',
      loading: false
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
    this.getOrgTypes()
    this.getSelectNature2()
    // 调用 获取管理单位下拉
    this.getmangeinfo()
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
      document.$vue.dialogVisible = false
    })
  },
  methods: {
    // 校验文件类型
    formsubmit(event) {
      const fileele = document.querySelector('.seltn')
      const filetype = fileele.value.substr(fileele.value.lastIndexOf('.') + 1)
      console.log(fileele)
      if (!this.filetypes.includes(filetype)) {
        this.$message('文件类型不符！请选择excel文件')
        event.preventDefault()
      }
    },
    // 导出协议
    doExport: function() {
      var url = '/gtp-server/org-mode'
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
    handleSelect(item) {
      // console.log(item)
      this.selectPerson = item.label
    },
    // 重置搜索条件
    resetSearch: function() {
      this.orgName = ''
      this.sousuo.managerCode = ''
      this.sousuo.orgClass = ''
      this.sousuo.nature2 = ''
    },
    selectmanager(val) {
      let obj = {}
      if (val) {
        obj = this.manageinfo.find((item) => {
          return item.value === val
        })
        this.sousuo.managerUnit = obj.label
        this.sousuo.managerCode = obj.value
      }
    },
    currentSel(val) {
      let obj = {}
      obj = this.ManageNameNew.find((item) => {
        return item.value === val
      })
      this.ruleForm.managerUnit = obj.label
      this.ruleForm.managerCode = obj.value
    },
    // 照片处理
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // handlePreview(file) {
    //   console.log(file)
    // },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 获取选中数据
    getTemplateRow(index, row) {
      this.templateSelection = row
      console.log(this.templateSelection)
    },
    // 对比插件diff
    // 当前信息 与选中行 进行对比
    saveCompare() {
      if (this.templateSelection === '') {
        this.$message({
          message: '请选择一条日志',
          type: 'error'
        })
      } else {
        this.compareDialog = true
        this.comparegridData = []
        // 构造comparegridData
        this.comparegridData.push({
          comparecontent: '机构名称',
          currentvalue: this.currentOrg.orgName,
          prevvalue: this.templateSelection.orgName,
          compareresult: ''
        }, {
          comparecontent: '登记号',
          currentvalue: this.currentOrg.registerNo,
          prevvalue: this.templateSelection.registerNo,
          compareresult: ''
        }, {
          comparecontent: '全国唯一标识码',
          currentvalue: this.currentOrg.uncode,
          prevvalue: this.templateSelection.uncode,
          compareresult: ''
        },
        {
          comparecontent: '机构地址',
          currentvalue: this.currentOrg.orgAdr,
          prevvalue: this.templateSelection.orgAdr,
          compareresult: ''
        }, {
          comparecontent: '电话号码',
          currentvalue: this.currentOrg.tel,
          prevvalue: this.templateSelection.tel,
          compareresult: ''
        }, {
          comparecontent: '法人姓名',
          currentvalue: this.currentOrg.egalPersonName,
          prevvalue: this.templateSelection.egalPersonName,
          compareresult: ''
        }, {
          comparecontent: '法人证件号',
          currentvalue: this.currentOrg.legalPersonNo,
          prevvalue: this.templateSelection.legalPersonNo,
          compareresult: ''
        }, {
          comparecontent: '负责人姓名',
          currentvalue: this.currentOrg.chargePerName,
          prevvalue: this.templateSelection.chargePerName,
          compareresult: ''
        },
        {
          comparecontent: '负责人证件号',
          currentvalue: this.currentOrg.chargePerNo,
          prevvalue: this.templateSelection.chargePerNo,
          compareresult: ''
        }, {
          comparecontent: '机构类别',
          currentvalue: this.currentOrg.orgKind,
          prevvalue: this.templateSelection.orgKind,
          compareresult: ''
        }, {
          comparecontent: '机构级别',
          currentvalue: this.currentOrg.orgClass,
          prevvalue: this.templateSelection.orgClass,
          compareresult: ''
        }, {
          comparecontent: '经营性质',
          currentvalue: this.currentOrg.nature,
          prevvalue: this.templateSelection.nature,
          compareresult: ''
        }, {
          comparecontent: '下一校验日期',
          currentvalue: this.currentOrg.nextCheckDate,
          prevvalue: this.templateSelection.nextCheckDate,
          compareresult: ''
        })

        for (var i = 0; i < this.comparegridData.length; i++) {
          var diff = jsdiff.diffChars(this.comparegridData[i].currentvalue, this.comparegridData[i].prevvalue)
          var _html = ''
          diff.forEach(function(part) {
            var color = part.added ? 'green' : part.removed ? 'red' : 'grey'
            _html += '<span style="color:' + color + ';">' + part.value + '</span>'
          })
          // console.log(_html)
          this.comparegridData[i].compareresult = _html
        }
      }
    },
    // 按照等级进行搜索
    selectGet(val) {
      var obj = {}
      obj = this.orgTypes.find((item) => { return item.value === val })
      if (obj !== '' && obj !== undefined) {
        this.ruleForm.orgClass = obj.label
      }
    },
    // 按照企业性质搜索
    selectByNature2(val) {
      var obj = {}
      obj = this.selectNature2.find((item) => { return item.value === val })
      if (obj !== '' && obj !== undefined) {
        this.ruleForm.nature2 = obj.label
      }
      // if (obj !== '' && obj !== undefined) {
      //  this.ruleForm.nature2 = obj.label
      //   axios.get('/medicalOrgs', {
      //     params: {
      //       pageNumber: this.pageNumber,
      //       pageSize: this.pageSize,
      //       nature2: this.ruleForm.nature2
      //     }
      //   }).then((response) => {
      //     if (response.data.msg === 'success') {
      //       var data = response.data.data.rows
      //       // console.log(data)
      //       this.tableData = data
      //       this.totalCount = response.data.data.total
      //     }
      //   })
      // }
    },
    // 按照企业名称搜索
    search: function() {
      if (this.orgName === '' && this.sousuo.orgClass === '' && this.sousuo.nature2 === '' && this.sousuo.managerCode === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        var url = '/medicalOrgs'
        axios.get(url, {
          params: {
            page: 1,
            size: this.pagesize,
            orgName: this.orgName,
            orgClass: this.sousuo.orgClass,
            nature2: this.sousuo.nature2,
            managerCode: this.sousuo.managerCode
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
    // 从选中行  日志  还原
    savereSet() {
      if (this.templateSelection === '') {
        this.$message({
          message: '请选择一条日志',
          type: 'error'
        })
      } else {
        // 调用接口 进行还原
        var params = new URLSearchParams()
        params.append('id', this.currentOrg.id)
        params.append('logId', this.templateSelection.id)
        axios.post('/reSetMedicalOrg', params).then((response) => {
          if (response.data.msg === 'success') {
            this.dialogTableVisible1 = false
            this.$message({
              message: '还原日志成功',
              type: 'success'
            })
            // this.$refs['ruleForm'].resetFields()
            this.loadData(this.currentPage, this.pagesize)
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 从服务器读取数据
    loadData: function(page, size) {
      axios.get('/medicalOrgs', {
        params: {
          page: page,
          size: size,
          orgName: this.orgName,
          orgClass: this.sousuo.orgClass,
          nature2: this.sousuo.nature2,
          managerCode: this.sousuo.managerCode
        }
      }).then((response) => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
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
      this.orgID = ''
      this.dialogFormVisible = true
      this.dialogStatus = 'addCompany'
      // 调用 获取服务对象下拉
      this.getFuwuModel()
      // 调用 获取管理单位下拉
      this.getManageName()
      // 调用 当前状态下拉
      this.getNowStatus()
      this.getOrgGrades()
      this.getOwnership()
      this.getOrgTypes()
      this.getSelectNature2()
      this.getSelectNature()
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    // 获取服务对象下拉
    getFuwuModel: function() {
      var data = {
        codeId: '01'
      }
      this.fuwuModel = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.fuwuModel.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 机构等次下拉
    getOrgGrades: function() {
      var data = {
        codeId: '02'
        // codeId:'111'
      }
      this.orgGrades = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.orgGrades.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 当前状态下拉
    getNowStatus: function() {
      var data = {
        codeId: '03'
      }
      this.seletStatus = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.seletStatus.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 获取所有制形式
    getOwnership: function() {
      var data = {
        codeId: '04'
      }
      this.ownershipType = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.ownershipType.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 获取机构级别
    getOrgTypes: function() {
      var data = {
        codeId: '05'
      }
      this.orgTypes = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.orgTypes.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 获取经营性质（审批）
    getSelectNature: function() {
      var data = {
        codeId: '06'
      }
      this.selectNature = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        // console.log(response.data)
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.selectNature.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 获取经营性质（审批）
    getSelectNature2: function() {
      var data = {
        codeId: '07'
      }
      this.selectNature2 = []
      axios.get('/dictionaryDataWithCode', { params: data }).then((response) => {
        var responsedata = response.data.data
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.selectNature2.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    },
    // 获取管理单位下拉
    getManageName: function() {
      this.ManageNameNew = []
      axios.get('/managerOrgs', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        for (var i = 0; i < responsedata.length; i++) {
          console.log(responsedata[i])
          this.ManageNameNew.push({
            value: responsedata[i].orgCode,
            label: responsedata[i].orgName
          })
        }
      })
    },
    getmangeinfo: function() {
      this.manageinfo = []
      axios.get('/managerOrgs', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        for (var i = 0; i < responsedata.length; i++) {
          console.log(responsedata[i])
          this.manageinfo.push({
            value: responsedata[i].orgCode,
            label: responsedata[i].orgName
          })
        }
      })
    },
    // 处理人员 列表信息
    getPersons: function() {
      this.selectPerson = []
      axios.get('/wastePersons', { params: '' }).then((response) => {
        var responsedata = response.data.data.rows
        // console.log(responsedata)
        if (responsedata.length > 0) {
          responsedata.forEach(item => {
            this.selectPerson.push({
              value: item.id,
              label: item.name
            })
          })
        }
        // console.log(this.personData)
        this.personData.forEach(item => {
          this.removeByValue(this.selectPerson, 'value', item.id)
        })
      })
    },
    removeByValue: function(arr, attr, value) {
      var index = 0
      for (var i in arr) {
        if (arr[i][attr] === value) {
          index = i
          break
        }
      }
      arr.splice(index, 1)
    },
    // 根据id查询企业信息
    // 编辑
    handleEdit: function(index, row) {
      // console.log(row)
      // 去掉名称验证
      // this.checkorgName = ""
      // 调用 获取服务对象下拉
      this.getFuwuModel()
      // 调用 获取管理单位下拉
      this.getManageName()
      // 调用 当前状态下拉
      this.getNowStatus()
      this.getOrgGrades()
      this.getOwnership()
      this.getOrgTypes()
      this.getSelectNature2()
      this.getSelectNature()
      this.orgID = row.id
      this.id = row.id
      this.userId = row.userId
      this.dialogFormVisible = true
      this.dialogStatus = 'editCompany'
      this.titleMap.editCompany = '编辑机构信息' + '--' + row.orgName
      this.ruleForm.id = row.id
      this.$nextTick(() => {
        // 根据id获取企业信息接口暂时不能使用  目前使用绑定值方式
        var url = '/medicalOrg/' + row.id
        axios.get(url).then((response) => {
          // console.log(response.data)
          if (response.data.msg === 'success') {
            this.ruleForm = response.data.data
          }
        })
      })
    },
    // 保存企业信息
    saveCompany: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'addCompany') {
            axios.post('/medicalOrg', this.ruleForm).then((response) => {
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
            axios.put('/medicalOrg', this.ruleForm).then((response) => {
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
    // 点击人员信息管理
    chosePerson: function(index, row) {
      this.dialogTableVisible2 = true
      this.personinfo.id = ''
      this.getPersons()
      this.orgID = row.id
      this.getPersonDataByID()
    },
    // 点击日志管理
    choseRizhi: function(index, row) {
      this.dialogTableVisible1 = true
      // console.log(row)
      // this.getPersons()
      this.orgID = row.id
      this.orgId = row.orgId
      this.currentOrg = row
      this.templateSelection = ''
      this.templateRadio = ''
      this.showOrfade = false
      this.getRizhiDataByID()
    },
    // 根据ID获取处理人员列表
    getPersonDataByID: function() {
      var url = '/WasteMans/' + this.orgID
      axios.get(url).then((response) => {
        this.personData = response.data.data
      })
    },
    // 根据机构orgID获取此机构日志列表
    getRizhiDataByID: function(page, size) {
      axios.get('/medicalOrgLogs/', {
        params: {
          orgId: this.orgID,
          page: page,
          size: size
        }
      }).then((response) => {
        this.rizhiData = response.data.data.rows
        this.totalCountRizhi = response.data.data.total
      })
    },
    // //处理人员下拉框change
    // changePerson: function(val) {
    //   // 调用接口 获取身份证号
    //   var url = '/wastePerson/' + val
    //   axios.get(url).then((response) => {
    //     console.log(response.data)
    //     if (response.data.msg === 'success') {
    //       this.personinfo.cardno = response.data.data.cardno
    //     }
    //   })
    // },
    // 保存处理人员
    savePerson: function() {
      const postdata = 'ids=' + this.personinfo.id + '&orgId=' + this.orgID
      if (this.personinfo.id === '') {
        // this.$message({
        //   message: '请选择人员',
        //   type: 'warring'
        // })
        return false
      } else {
        axios({ url: '/WasteMans', data: postdata, method: 'post' }).then((response) => {
          // this.personinfo.id = ''
          if (response.data.msg === 'success') {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            // this.$refs['ruleForm'].resetFields()
            this.getPersonDataByID()
            // personAll.remove(this.personinfo.id)
            // this.personAll.filter(value => value.name.indexOf(this.personinfo.id) !== -1)
            const a = this.selectPerson.filter(val => {
              return val.value !== this.personinfo.id
            })
            console.log(a)
            this.personinfo.id = ''
            this.selectPerson = a
            // this.loadData(this.currentPage, this.pagesize)
          } else {
            return false
          }
        })
      }
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
    // 日志列表页码变更
    handleCurrentChangeRizhi: function(val) {
      this.currentPageRizhi = val
      this.getRizhiDataByID(this.currentPageRizhi, this.pagesizeRizhi)
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.currentPage = 1
      this.loadData(this.currentPage, this.pagesize)
    },
    handleSizeChangeRizhi: function(val) {
      this.pagesize = val
      this.currentPageRizhi = 1
      this.getRizhiDataByID(this.currentPageRizhi, this.pagesizeRizhi)
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
    // 删除处理人员
    handleDelete: function(index, row) {
      this.$confirm('确定删除人员信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var personIds = row.id
        var data = []
        data.push(personIds)
        var params = { orgId: this.orgID, personIds: parseInt(data.join(',')) }
        axios.delete('/WasteMans', { params: params }).then((response) => {
          if (response.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPersonDataByID()
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
        axios.delete('/medicalOrg', { data: data }).then((response) => {
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
<style scoped>
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
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 95%;
}
.dy {
  width: 100%;
}
.el-textarea__inner {
  width: 95%;
}
.spanStyle {
  line-height: 30px;
  display: inline-block;
  /* margin-left: 86px; */
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


