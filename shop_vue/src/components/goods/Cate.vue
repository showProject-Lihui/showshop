<template>
  <div class="cate-container">
    <!-- 面包屑列表 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button @click="showAddBoxF" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table class="tree-table" 
        :data="cateList" :columns="columns"
        :selection-type="false" :expand-type="false"
        show-index show-text="#" border
        >
        <template slot="isok" slot-scope="scope">
          <i style="color:red" v-if="scope.row.cat_deleted" class="el-icon-error"></i>
          <i style="color:green" v-else class="el-icon-success"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button @click="editBut(scope.row)" type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          <el-button @click="deleteCate(scope.row.cat_id)" type="danger" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 8, 15, 50]"
        :total="total"
        :page-size="getCateListQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="showAddBox" width="50%">
        <el-form :rules="addRules" ref="addForm" :model="addInfo" label-width="80px">
          <el-form-item prop="cat_name" label="分类名称">
            <el-input v-model="addInfo.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader change-on-select @change="d" v-model="addCateIdValue" :props="addCateProps" :options="getParentCateList" >

            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="showAddBox = false">取消</el-button>
          <el-button @click="addCate" type="primary">确定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑分类对话框 -->
      <el-dialog title="编辑" :visible.sync="editBox">
        <span slot="footer">
          <el-form label-width="80px" :model="nowEdit" :rules="addRules">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="nowEdit.cat_name"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="editBox=false">取消</el-button>
          <el-button @click="editCateF" >确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { request1 } from "@/network/request1" 

export default {
  data() {
    return {
      //现在正在编辑的分类信息
      nowEdit:{},
      //控制编辑对话框的显示和隐藏
      editBox: false,
      //添加分类选中的父分类
      addCateIdValue:[],
      addCateProps:{
        label: 'cat_name',
        expandTrigger: 'hover',
        value: 'cat_pid'
      },
      //分类信息的名字验证
      addRules:{
        cat_name:[
           { required: true, message: '请输入名称', trigger: 'blur' },
        ]
      },
      //添加分类的信息
      addInfo:{
        cat_pid: '',
        cat_name: '',
        cat_level: 0
      },
      //控制添加分类对话框的显示和隐藏
      showAddBox: false,
      //商品分类数据
      cateList:[],
      //获取前两层数据分类列表
      getParentCateList:[],
      //
      columns: [
        { 
          label: '分类名称',
          prop: 'cat_name' 
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      //商品分类总数据量
      total: 1,
      //商品分类请求参数
      getCateListQuery:{
        //页码
        pagenum: 1,
        //每页的数据量
        pagesize: 5
      }
    }
  },
  methods:{
    //删除分类
    deleteCate(id) {
      this.$confirm('确认要删除id为' + id + "的分类吗？",'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        request1({
          url: 'categories/' + id,
          method: 'delete'
        }).then(res => {
          const data = res.data;
          if(data.meta.status !== 200) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.getCateList();
        })
      }).catch(() => {
        this.$message.warning('已取消删除操作')
      })
    },
    //编辑分类提交
    editCateF(){
      request1({
        url: 'categories/' + this.nowEdit.cat_id,
        method: 'put',
        data:{cat_name: this.nowEdit.cat_name}
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.$message.success(data.meta.msg)
        this.getCateList();
        this.editBox = false;
      })
    },
    //编辑分类的按钮事件
    editBut(obj) {
      this.nowEdit = obj;
      this.editBox = true;
    },
    d(a) {
      this.addCateIdValue = a;
      console.log(a)
      console.log(this.cateList)
    },
    //获取前2层分类列表
    getParentCateListF() {
      request1({
        url: 'categories',
        params: {type: 2}
      }).then(res => {
        const data = res.data.data;
        this.getParentCateList = data;
      })
    },
    //获取商品分类
    getCateList() {
      request1({
        url: 'categories',
        params:this.getCateListQuery
      }).then(res => {
        const data = res.data;
        this.cateList = data.data.result;
        this.total = data.data.total;
      })
    },
    //选择每页的数据量
    handleSizeChange(newSize) {
      this.getCateListQuery.pagesize = newSize;
      this.getCateList()
    },
    //控制页码
    handleCurrentChange(newPage){
      this.getCateListQuery.pagenum = newPage;
      this.getCateList()
    },
    //点击添加分类按钮
    showAddBoxF() {
      this.showAddBox = true;
      this.getParentCateListF()
    },
    addCate() {
      const obj = {
        cat_name: this.addInfo.cat_name,
        cat_pid: this.addCateIdValue[1],
        cat_level: 2 
      }
      if(this.addCateIdValue.length == 1) {
        obj.cat_pid = this.addCateIdValue[0]
        obj.cat_level = 1
      }
      request1({
        url: 'categories',
        method: 'post',
        data:obj
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 201) {
          return this.$message.error(data.meta.msg)
        }
        this.$message.success(data.meta.msg)
        this.getCateList();
        this.showAddBox = false;
      })
    }
  },
  created() {
    this.getCateList()
  }
};
</script>

<style lang="less" scoped>
.el-card{
  margin-top: 20px;
}
.tree-table{
  margin-top: 20px;
}
.el-pagination{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>