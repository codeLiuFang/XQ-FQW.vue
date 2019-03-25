<template>
  <div>
    <!-- 字典管理 -->
    <el-row>
      <div style="margin-top:5px;">
        <el-row>
          <el-col :span="12">
            <span style="padding-left:5px;line-height:32px;">字典列表</span>
          </el-col>
          <el-col style="text-align:right;padding-right:5px;" :span="12">
            <el-button type="primary" size="small" @click="showsearchbar=!showsearchbar">{{showsearchbar?'隐藏':'查询'}}</el-button>
            <el-button type="primary" size="small" @click="adddict">新增</el-button>
            <el-button size="small" @click="deletedict">删除</el-button>
          </el-col>
        </el-row>
        <hr class="fengeline">
        <el-row style="margin-left:5px;" v-show="showsearchbar">
          <span>字典名称: </span>
          <el-input v-model="sdictform.name" style="width:200px;"></el-input>
          <el-button type="primary" size="small" @click="searchdict">查询</el-button>
        </el-row>
      </div>
      <div>
        <dynamictable class="dicttable" :columns="columns" :tabledata="tabledata" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick" @eventbus="eventbus"></dynamictable>
      </div>
    </el-row>
    <el-dialog :title='dictTitle' :visible.sync="dictinfovisible" @close="dialogclose">
      <div>
        <el-form ref="dictform" :model="dictform" label-width="80px" label-position="left" :rules="ruleform">
          <el-form-item label="字典名称" prop="name">
            <el-input v-model=" dictform.name">
            </el-input>
          </el-form-item>
          <el-form-item label="字典编码" prop="codeId" v-if="isnew">
            <el-input v-model="dictform.codeId" placeholder="字典编码是系统关键资源，一旦保存则不能修改"></el-input>
          </el-form-item>
          <el-form-item label="字典编码" prop="codeId" v-if="!isnew">
            {{dictform.codeId}}
          </el-form-item>
          <el-form-item label="字典类型" prop="codeType">
            <el-select v-model="dictform.codeType">
              <el-option v-for="item in typedata" :key="item.key" :value="item.value">{{item.value}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="dictform.memo"></el-input>
          </el-form-item>
          <!-- <el-form-item label="创建人" v-if="!isnew">
            {{dictform.createUser}}
          </el-form-item>
          <el-form-item label="更新时间" v-if="!isnew">
            {{dictform.updatetime}}
          </el-form-item> -->
        </el-form>
        <div style="text-align:center;">
          <el-button type="primary" size="small" @click="savedict">{{isnew?'保存':'更新'}}</el-button>
          <el-button size="small" @click="dictinfovisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dynamictable from '@/components/gtptable/dynamictable'
import { adddict, getdictlist, deletedict, updatedict, getcodetypes } from '@/api/dict'
export default {
  components: {
    dynamictable
  },
  data() {
    return {
      showsearchbar: false,
      columns: [
        {
          showname: '字典名称',
          dataindex: 'name'
        },
        {
          showname: '字典编码',
          dataindex: 'codeId'
        },
        {
          showname: '字典类型',
          dataindex: 'codeType'
        },
        // {
        //   showname: '更新时间',
        //   dataindex: 'updatetime'
        // },
        // {
        //   showname: '状态',
        //   dataindex: 'status'
        // },
        {
          showname: '备注',
          dataindex: 'memo'
        }
        // {
        //   showname: '操作',
        //   dataindex: 'memo',
        //   type: 'elbuttongroup'
        // }
      ],
      ruleform: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        codeId: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
        ],
        codeType: [
          { required: true, message: '请选择字典类型', trigger: 'change' }
        ]
      },
      tabledata: [],
      typedata: [],
      dictinfovisible: false,
      isnew: false,
      dictTitle: '新增字典',
      dictform: {
        name: '',
        codeId: '',
        codeType: '系统',
        memo: ''
      },
      sdictform: {
        name: ''
      },
      delarray: []
    }
  },
  methods: {
    eventbus(dispatchid) {
      console.log(arguments)
      switch (dispatchid) {
        case 'success':
          this.$message('do success option')
          break
        case 'info':
          this.$message('do info option')
          break
        case 'warning':
          this.$message('do warning option')
          break
      }
    },
    resetdata() {
      this.dictform = {
        name: '',
        codeId: '',
        codeType: '系统',
        memo: ''
      }
    },
    rowclick(row, event, column) {
      this.isnew = false
      this.dictTitle = '编辑字典'
      console.log(...row)
      switch (column.label) {
        case '字典编码':
          this.$emit('todictdata', row)
          break
        default:
          this.dictform = { ...row }
          this.dictinfovisible = true
          break
      }
    },
    selectionchange(data) {
      this.delarray = data.map(item => {
        return item.id
      })
    },
    refreshdict() {
      getdictlist().then(response => {
        if (response.data.msg === 'success') {
          this.tabledata = response.data.data.rows
        }
      })
    },
    adddict() {
      this.isnew = true
      this.dictTitle = '新增字典'
      this.dictinfovisible = true
    },
    deletedict() {
      if (this.delarray.length === 0) return
      this.$confirm('此操作将永久删除字典,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletedict(this.delarray).then(response => {
          if (response.data.code === 200) {
            this.$message('删除成功')
            this.refreshdict()
          } else {
            this.$message(response.data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    validatedata() {
      let flag = false
      this.$refs['dictform'].validate((valid) => {
        flag = valid
      })
      return flag
    },
    savedict() {
      if (!this.validatedata()) { return }
      for (var index in this.typedata) {
        if (this.dictform.codeType === this.typedata[index].value) {
          this.dictform.codeType = this.typedata[index].key
        }
      }
      switch (this.isnew) {
        case true: // 新增
          adddict(this.dictform).then(response => {
            if (response.data.code === 200) {
              this.$message('保存成功')
              this.dictinfovisible = false
              this.refreshdict()
            } else {
              for (var index in this.typedata) {
                if (this.dictform.codeType === this.typedata[index].key) {
                  this.dictform.codeType = this.typedata[index].value
                }
              }
              this.$message(response.data.msg)
            }
          })
          break
        case false: // 更新
          console.log(this.dictform.codeType)
          updatedict(this.dictform).then(response => {
            if (response.data.code === 200) {
              this.$message('更新成功')
              this.refreshdict()
              this.dictinfovisible = false
            } else {
              for (var index in this.typedata) {
                if (this.dictform.codeType === this.typedata[index].key) {
                  this.dictform.codeType = this.typedata[index].value
                }
              }
              this.$message(response.data.msg)
            }
          })
          break
      }
    },
    searchdict() {
      getdictlist({
        name: this.sdictform.name.trim()
      }).then(response => {
        if (response.data.code === 200) {
          this.tabledata = response.data.data.rows
        }
      })
    },
    searchCodeType() {
      getcodetypes().then(response => {
        if (response.data.code === 200) {
          for (var optype in response.data.data) {
            this.typedata.push(response.data.data[optype])
          }
        }
      })
    },
    dialogclose() {
      this.$refs['dictform'].resetFields()
      this.resetdata()
    }
  },
  created() {
    this.searchCodeType()
    this.refreshdict()
  }
}
</script>
<style>
.dicttable table tr td:nth-child(3) {
  cursor: pointer;
  color: #3c8dbc;
}
</style>


