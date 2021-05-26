<template>
  <div class="rights-container">
    <!-- 面包屑列表 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主体区域 -->
    <el-card>
      <el-table :data="rightsData" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request1 } from "@/network/request1"

export default {
  data() {
    return {
      rightsData:[]
    }
  },
  methods: {
    getRightsData() {
      request1({
        url: 'rights/list',
      }).then(data => {
        const da = data.data;
        if(da.meta.status !== 200) {
          return this.$message.error(da.meta.msg)
        }
        this.rightsData = da.data;
        this.$message.success(da.meta.msg)
      })
    }
  },
  created(){
    this.getRightsData()
  }
}
</script>

<style lang="less" scoped>
.rights-container{
    width: 100%;
    height: 620px;
    overflow: auto;
    .el-card{
      margin-top: 20px;
    }
}
</style>