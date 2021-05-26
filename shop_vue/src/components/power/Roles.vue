<template>
  <div class="roles-container">
    <!-- 面包屑列表 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addRolesBox=true" class="addjs" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示数据区域 -->
      <el-table :data="rolesData" border >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['vcenter','rights-one',index === 0 ? 'rights-top' : '']"  v-for="(item, index) in scope.row.children" :key="index">
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag @close="remove(scope.row, item.id)" closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row :class="['vcenter','rights-one',index2 === item.children.length - 1 ? 'rights-none' : '']" v-for="(item2,index2) in item.children" :key="index2">
                  <el-col :span="6">
                    <el-tag @close="remove(scope.row, item2.id)" closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="remove(scope.row, item3.id)" closable type="warning" v-for="(item3,index3) in item2.children" :key="index3">
                     {{item3.authName}} 
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editRoleF(scope.row.id)" size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
            <el-button @click="dele(scope.row.id)" size="mini" icon="el-icon-delete" type="danger">删除</el-button>
            <el-button @click="fpqx(scope.row)" size="mini" icon="el-icon-setting" type="warning">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesBox">
      <el-form :rules="addRolesRules" ref="addRoleForm" :model="addRolesData" label-width="80px">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="addRolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addRolesBox=false">取消</el-button>
        <el-button @click="addRoles">确认</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleBox">
      <el-form :rules="addRolesRules" :model="editRole" ref="editRoleForm">
        <el-form-item prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editRoleSubmit">确定</el-button>
        <el-button @click="editRoleBox=false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="changeGiveRightsBox">
      <el-tree ref="rightsTree" :default-checked-keys='getRightsId' show-checkbox node-key="id" default-expand-all :data="rightsList" :props="defaultProps" ></el-tree>
      <span slot="footer">
        <el-button @click="changeGiveRightsBox=false">取消</el-button>
        <el-button @click="fpqxtj">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request1 } from "@/network/request1" 

export default {
  data() {
    return {
      //拿到角色所有三级权限的id
      getRightsId:[],
      //所有权限数据
      rightsList:[],
      defaultProps:{
        children: 'children',
        label: 'authName'
      },
      //控制分配权限对话框的显示与隐藏
      changeGiveRightsBox: false,
      //存放roles数据
      rolesData:[],
      //添加角色对话框是否展示
      addRolesBox: false,
      //添加角色信息
      addRolesData:{
        roleName: '',
        roleDesc: ''
      },
      //角色信息表单验证
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      },
      //正在编辑的角色表单数据
      editRole: {
        roleName: '1',
        roleDesc: ''
      },
      editRoleBox: false,
      roleId:''
    }
  },
  methods: {
    //获取roles数据
    getRolesData() {
      request1({
        url: 'roles'
      }).then(data => {
        const da = data.data;
        if(da.meta.status !== 200) {
          return this.$message.error(da.meta.msg)
        }
        this.rolesData = da.data;
      })
    },
    //添加角色
    addRoles() {
      const form = this.$refs.addRoleForm;
      form.validate(result => {
        if(!result) return;
          request1({
            url: 'roles',
            method: 'post',
            data:this.addRolesData
          }).then(data => {
            const da = data.data;
            console.log(da)
            if(da.meta.status !== 201) {
              return this.$message.error(da.meta.msg)
            }
            this.$message.success(da.meta.msg)
            this.getRolesData();
            this.addRolesBox = false;
      })
      })
    },
    //点击编辑按钮后显示数据
    editRoleF(id) {
      this.editRoleBox = true;
      request1({
        url: 'roles/' + id
      }).then(data => {
        const da = data.data;
        this.editRole = da.data;
      })
    },
    //提交编辑角色信息的数据
    editRoleSubmit() {
      const form = this.$refs.editRoleForm;
      form.validate(result => {
        if(!result) return ;
        request1({
          url: 'roles/' + this.editRole.roleId,
          method: 'put',
          data: this.editRole
        }).then(data => {
          const da = data.data;
          if(da.meta.status !== 200) {
            return this.$message.error(da.meta.msg)
          }
          this.$message.success(da.meta.msg);
          this.getRolesData();
          this.editRoleBox = false;
        })
      })
    },
    //删除角色
    dele(id) {
      this.$confirm('是否删除id为' + id + '的角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        request1({
          url: 'roles/' + id,
          method: 'delete'
        }).then(data => {
          const da = data.data;
          if(da.meta.status !== 200) {
            return this.$message.error(da.meta.msg)
          }
          this.$message.success(da.meta.msg)
          this.getRolesData()
        })
      }).catch(() => {
        this.$message.warning('删除操作已取消')
      })
    },
    //删除角色的权限
    remove(role, rightId) {
      this.$confirm('确认删除此权限吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
      }).then(() => {
        request1({
          url: `roles/${role.id}/rights/${rightId}`,
          method: 'delete'
        }).then(data => {
          const da = data.data;
          if(da.meta.status !== 200) {
            return this.$message.error(da.meta.msg)
          }
          this.$message.success(da.meta.msg);
          role.children = da.data;
        })
      }).catch(() => {
        this.$message.warning('操作已取消')
      })
    },
    //点击分配权限按钮
    fpqx(role) {
      //清空三级权限id数组
      this.getRightsId = [];
      this.changeGiveRightsBox = true;
      this.roleId = role.id;
      request1({
        url: 'rights/tree'
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.rightsList = data.data;
        this.getRightsIdF(role,this.getRightsId)
      })
    },
    //拿到传入角色的所有三级权限Id
    getRightsIdF(role,arr) {
      if(!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(ele => {
        this.getRightsIdF(ele,arr)
      })
    },
    //提交分配权限
    fpqxtj() {
      const tree = this.$refs.rightsTree;
      const arr = [
        ...tree.getCheckedKeys(),
        ...tree.getHalfCheckedKeys()
      ]
      const str = arr.join(',')
      console.log(typeof str)
      request1({
        url: 'roles/' + this.roleId + '/rights',
        method: 'post',
        data: {rids: str}
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.$message.success(data.meta.msg);
        this.getRolesData();
        this.changeGiveRightsBox = false;
      })
    }
  },
  created() {
    this.getRolesData();
  }
}
</script>

<style lang="less" scoped>
.roles-container{
  width: 100%;
  height: 620px;
  .el-card{
    margin-top: 20px;
    .addjs{
      margin-bottom: 15px;
    }
  }
}
.el-tag{
  margin: 7px;
}
.rights-one{
  border-bottom: 1px solid #ccc;
}
.rights-top{
  border-top: 1px solid #ccc;
}
.rights-none{
  border: none;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>