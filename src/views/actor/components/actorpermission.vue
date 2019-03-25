<template>
  <div class="actor-perm">
    <el-row style="margin-top:5px;">
      <el-col :span="12">
        <span style="padding-left:5px;line-height:32px;cursor:pointer;" @click="toactor">
          <i class="el-icon-d-arrow-left"></i>
          {{`${transdata.row.name}(权限授权)`}}
        </span>
      </el-col>
    </el-row>
    <div class="main">
      <!-- <div class="table-container">
        <el-row>
          <el-button type="primary" size="small" @click="addpermission">授权</el-button>
        </el-row>
        <div class="perm-table">
          <permission-table :columns="columns" :tabledata="tabledata" ref="permtable"></permission-table>
        </div> -->
      <div class="tree-container">
        <el-tree show-checkbox :data="permissionTree" :props="defaultProps" default-expand-all ref="permtree" node-key="id" v-loading="loading">
          <span class="custom-tree-node" slot-scope="{ node, data }" ref="treeNodeTips" @mouseover="showtips(data)">
            <el-tooltip placement="top" effect="light">
              <div slot="content" v-loading="tiploading">
                <permission-table :columns="columns" :tabledata="tabledata" ref="permtable"></permission-table>
              </div>
              <span>{{ node.label }}</span>
            </el-tooltip>
          </span>
        </el-tree>
      </div>
      <el-button type="primary" size="medium" @click="addpermission">授权</el-button>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import { getpermissionlist, assignpermission, getpermissionsbyrole, getpermission } from '@/api/permission'
import PermissionTable from '@/components/gtptable/asyndynamictable'
export default {
  props: {
    transdata: {
      type: Object,
      default() {
        return {
          row: {}
        }
      }
    }
  },
  data() {
    return {
      // 根权限id
      rootPermId: '1',
      permissionTree: [],
      defaultProps: {
        children: 'childrenPermissions',
        label: 'permissionName'
      },
      // 角色具有权限的id list
      permIdList: [],
      loading: false,
      // 表格配置
      columns: [
        {
          showname: '权限ID',
          dataindex: 'id',
          width: '80px',
          align: 'center'
        },
        {
          showname: '权限名称',
          dataindex: 'permissionName',
          width: '120px',
          align: 'center'
        },
        {
          showname: '权限类型',
          dataindex: 'permissionType',
          width: '100px',
          align: 'center'
        },
        {
          showname: '资源类型',
          dataindex: 'resourceType',
          width: '100px',
          align: 'center'
        },
        {
          showname: '预留字段1',
          dataindex: 'slot1',
          align: 'center'
        },
        {
          showname: '预留字段2',
          dataindex: 'slot2',
          align: 'center'
        },
        {
          showname: '预留字段3',
          dataindex: 'slot3',
          align: 'center'
        },
        {
          showname: '预留字段4',
          dataindex: 'slot4',
          align: 'center'
        }
      ],
      // 表格数据
      tabledata: [],
      tiploading: false
    }
  },
  components: {
    PermissionTable
  },
  created() {
    // 获取角色权限
    this.getpermlist()
  },
  methods: {
    // 后退回角色管理页
    toactor() {
      this.$emit('toactor')
    },
    // 为角色授予权限
    addpermission() {
      const selectPermIdList = []
      this.$refs.permtree.getCheckedNodes().forEach(item => {
        selectPermIdList.push(item.id)
      })
      assignpermission(this.transdata.row.id, selectPermIdList).then(response => {
        const data = response.data
        if (data.msg === 'success') {
          this.$message({
            message: '授权成功',
            type: 'success',
            duration: 1000
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 初始化权限表格
    showtips(data) {
      this.tiploading = true
      this.tabledata = []
      getpermission(data.id).then(res => {
        if (res.data.msg === 'success') {
          this.tabledata = [res.data.data]
          this.tiploading = false
        }
      })
    },
    // 将获取到的角色权限树数据整理
    // assemblyperms(perms) {
    //   if (perms) {
    //     this.tabledata.push(perms)
    //     if (perms.childrenPermissions) {
    //       perms.childrenPermissions.forEach(item => {
    //         this.assemblyperms(item)
    //       })
    //     } else {
    //       return
    //     }
    //   } else {
    //     return
    //   }
    // },
    // 获取权限树数据
    getpermlist() {
      const id = this.rootPermId
      getpermissionlist(id).then((result) => {
        const data = result.data
        if (data.msg === 'success') {
          this.permissionTree.push(data.data)
          this.loading = true
          this.$nextTick(() => {
            this.$refs.permtree.treeItems.forEach(item => {
              item.setAttribute('style', 'white-space: normal;')
              if (item.children[1].children.length === 0) {
                item.setAttribute('isLeaf', 'true')
                item.setAttribute('style', 'display: inline-block;  white-space: normal;')
              }
            })
          })
          this.setroleperms()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 设置权限树
    setroleperms() {
      getpermissionsbyrole(this.transdata.row.id).then(response => {
        const data = response.data
        if (data.msg === 'success') {
          data.data.forEach(item => { this.getpermsid(item) })
          this.$refs.permtree.setCheckedKeys(this.permIdList)
          this.loading = false
        }
      })
    },
    // 获取权限树数据的权限id list
    getpermsid(perms) {
      if (perms) {
        this.permIdList.push(perms.id)
        if (perms.childrenPermissions) {
          perms.childrenPermissions.forEach(item => {
            this.getpermsid(item)
          })
        } else {
          return
        }
      } else {
        return
      }
    }
  }
}
</script>
<style>
  .actor-perm .main {
    position: relative;
    min-height: 520px;
  }
  /* .table-container {
    position: relative;
    width: 860px;
    margin-left: 280px;
  }
  .perm-table {
    overflow: auto;
    position: fixed;
    width: 860px;
    top: 160px;
    bottom: 0;
  } */
  .actor-perm .tree-container {
    overflow: auto;
    position: relative;
    width: 96%;
    margin: 0 auto;
  }
  .actor-perm .main .el-button {
    position: absolute;
    bottom: 0px;
    width: 120px;
    left: 50%;
    margin-left: -60px;
  }
</style>