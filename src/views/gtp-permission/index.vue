<template>
  <el-container>
    <el-aside width="180px">
      <el-tree highlight-current :expand-on-click-node="false" :data="permissionTree" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
    </el-aside>
    <el-main>
      <el-row>
        <permission-table :columns="columns" :tabledata="tabledata" ref="permtable" @rowclick="rowclick"></permission-table>
      </el-row>
      <el-dialog title="权限资源详情" :visible.sync="dialogVisible" center append-to-body width="36%">
        <el-form ref="permForm" :model="permForm" label-width="140px">
          <el-form-item label="权限名称:">
            <span>{{permForm.permissionName}}</span>
          </el-form-item>
          <el-form-item label="资源类型:">
            <span>{{permForm.resourceType}}</span>
          </el-form-item>
          <el-form-item label="预留字段1:">
            <span>{{permForm.slot1}}</span>
          </el-form-item>
          <el-form-item label="预留字段2:">
            <span>{{permForm.slot2}}</span>
          </el-form-item>
          <el-form-item label="预留字段3:">
            <span>{{permForm.slot3}}</span>
          </el-form-item>
          <el-form-item label="预留字段4:">
            <span>{{permForm.slot4}}</span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { getpermissionlist } from '@/api/permission'
import PermissionTable from '@/components/gtptable/asyndynamictable'
export default {
  data() {
    return {
      rootPermId: '1',
      permissionTree: [],
      defaultProps: {
        children: 'childrenPermissions',
        label: 'permissionName'
      },
      dialogVisible: false,
      permForm: {},
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
          width: '140px',
          align: 'center'
        },
        {
          showname: '权限编码',
          dataindex: 'permissionCode',
          align: 'center'
        },
        {
          showname: '父级权限编码',
          dataindex: 'parentPermissionCode',
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
          showname: '修改日期',
          dataindex: 'updateDate',
          width: '140px',
          align: 'center'
        }
      ],
      tabledata: []
    }
  },
  components: {
    PermissionTable
  },
  created() {
    this.getpermlist()
  },
  methods: {
    rejectleafnode(permission) {
      // permission.childrenPermissions.forEach(item => {
      //   if (item.childrenPermissions) {
      //     this.rejectleafnode(item)
      //   } else if (this.checknoleaf(permission)) {
      //     permission.childrenPermissions = null
      //   }
      // })
      for (let i = 0; i < permission.childrenPermissions.length; i++) {
        if (permission.childrenPermissions[i].childrenPermissions) {
          this.rejectleafnode(permission.childrenPermissions[i])
        } else if (this.checknoleaf(permission)) {
          permission.childrenPermissions = null
          break
        }
      }
    },
    checknoleaf(permission) {
      let result = true
      for (let i = 0; i < permission.childrenPermissions.length; i++) {
        if (permission.childrenPermissions[i].childrenPermissions !== undefined) {
          result = false
          break
        }
      }
      return result
    },
    getpermlist() {
      const id = this.rootPermId
      getpermissionlist(id).then((result) => {
        const data = result.data
        if (data.msg === 'success') {
          this.rejectleafnode(data.data)
          this.permissionTree.push(data.data)
          this.$message({
            message: '权限树加载成功',
            type: 'success',
            duration: 1000
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleNodeClick(data, node, element) {
      // if (!data.childrenPermissions) {
      getpermissionlist(data.id).then(result => {
        if (result.data.msg === 'success') {
          const items = result.data.data.childrenPermissions
          this.tabledata = items.map(item => {
            item.updateDate = this.$moment(item.updateDate).format('YYYY-MM-DD HH:mm:ss')
            return item
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    rowclick(row) {
      this.dialogVisible = true
      this.permForm = row
    }
  }
  // }
}
</script>
<style>
.el-container {
  overflow: auto;
  position: fixed;
  top: 88px;
  bottom: 0;
}
.el-aside {
  margin: 20px;
  margin-right: 0px;
}
.el-main {
  width: 940px;
}
</style>
