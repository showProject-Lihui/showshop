<template>
  <div class="params-container">
    <!--面包屑列表-->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级别的分类设置参数" type="warning" show-icon></el-alert>
      <el-row class="selectShop">
        <el-col :span="3">
          <span>选择商品分类：</span>
        </el-col>
        <el-col :span="5">
          <el-cascader
            :options="shopList"
            :props="shopListProps"
            :value="shopArr"
            @change="shopSelectChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabEvent">
        <!-- 动态参数区域 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button @click="addParamsF" :disabled="but" type="primary">添加参数</el-button>
          <el-table :data="runParams">
            <el-table-column type="expand">
              <template slot-scope="scope"> 
                <el-tag closable class="tag" v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                  </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editBtn(scope.row)" type="primary">编辑</el-button>
                <el-button @click="deleteP(scope.row.attr_id)" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态参数区域 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button @click="addParamsF" :disabled="but" type="primary">添加属性</el-button>
          <el-table :data="staticParams">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editBtn(scope.row)" type="primary">编辑</el-button>
                <el-button @click="deleteP(scope.row.attr_id)" type="danger">删除</el-button>
              </template>   
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数和属性对话框 -->
      <el-dialog :visible.sync="addShow" :title="addTitle">
        <el-form :rules="rules" :model="addForm" ref="addForm">
          <el-form-item prop="attr_name"  :label="addFormLabel" label-width="80px">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addParamsFF" type="primary">确定</el-button>
          <el-button @click="addShow=false">取消</el-button>
        </span>
      </el-dialog>

      <!-- 编辑参数对话框 -->
      <el-dialog :visible.sync="editShow" :title="editTitle">
        <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="80px">
          <el-form-item :label="addFormLabel" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editParamsF" type="primary">确定</el-button>
          <el-button @click="editShow=false">取消</el-button>
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
      //控制编辑对话框的显示与隐藏
      editShow: false,
      //添加表单的数据
      addForm:{
        attr_name:''
      },
      //
      rules: {
        attr_name:[
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      //控制添加参数属性的对话框的显示和隐藏
      addShow: false,
      activeName: 'many',
      shopList:[],
      shopListProps:{
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover'
      },
      shopArr:[],
      //动态参数数据
      runParams: [],
      //静态参数数据
      staticParams: [],
      //参数id
      pramsId:'',
      //编辑参数数据
      editForm:{
        attr_name: ''
      }
    }
  },
  computed: {
    //添加对话框的标题
    addTitle() {
      if(this.activeName === 'many') {
        return '添加参数'
      }else{
        return '添加属性'
      }
    },
    //添加对话框表单的label
    addFormLabel() {
      return this.activeName === 'many' ? '动态参数': '静态属性'
    },
    //编辑对话框的标题
    editTitle() {
      return this.activeName === 'many' ? '编辑动态参数' : '编辑静态属性'
    },
    //控制添加参数按钮是否可用
    but() {
      return this.shopArr.length !== 3
    },
    cateId() {
      if(this.shopArr.length === 3) {
        return this.shopArr[2]
      }else{
        return null;
      }
    }
  },
  methods: {
    //在添加新标签的输入框按下回车活着失去焦点时触发
    handleInputConfirm(obj) {
      obj.inputVisible = false;
    },
    showInput(obj) {
      obj.inputVisible = true;
      obj.inputValue = '';
      console.log(typeof obj.inputVisible)
    },
    //删除参数
    deleteP(id) {
      this.$confirm('确定删除？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        request1({
          url: 'categories/' + this.cateId + '/attributes/' + id,
          method: 'delete'
        }).then(res => {
          const data = res.data;
          if(data.meta.status !== 200) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.getParams()
        })
      }).catch(() => {
        this.$message.warning('操作已取消')
      })
    },
    //提交编辑参数
    editParamsF() {
      const form = this.$refs.editFormRef;
      form.validate(res => {
        if(!res) {
          return this.$message.error('格式错误')
        }
        request1({
          url: `categories/${this.cateId}/attributes/${this.pramsId}`,
          method: 'put',
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        }).then(res => {
          const data = res.data;
          if(data.meta.status !== 200) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.getParams();
          this.editShow = false;
        })
      })
    },
    //监听编辑按钮
    editBtn(obj) {
      this.pramsId = obj.attr_id;
      this.editForm.attr_name = obj.attr_name;
      this.editShow = true;
    },
    //提交添加参数
    addParamsFF() {
      const form = this.$refs.addForm;
      form.validate(res => {
        if(!res) {
          return this.$message.error('数据格式错误')
        }
        request1({
          url: 'categories/' + this.cateId + '/attributes',
          method: 'post',
          data:{
                attr_name: this.addForm.attr_name,
                attr_sel: this.activeName  
              }
        }).then(res => {
          const data = res.data;
          if(data.meta.status !== 201) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.getParams();
          this.addShow = false;
        })
      })
    },
    //点击添加参数按钮
    addParamsF() {
      this.addShow = true;
    },
    //监听tabs切换
    tabEvent() {
      this.getParams()
    },
    //获取商品分类数据
    getShopList() {
      request1({
        url: 'categories'
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.$message.success(data.meta.msg)
        this.shopList = data.data;
      })
    },
    shopSelectChange(arr) {
      if(arr.length < 3) return this.shopArr = [];
      this.shopArr = arr;
      this.getParams()
    },
    //获取参数数据
    getParams() {
      request1({
        url: 'categories/' + this.cateId +'/attributes',
        params:{sel: this.activeName}
      }).then(res => {
        const data = res.data;
        data.data.forEach(ele => {
          if(ele.attr_vals != '') {
            ele.attr_vals = ele.attr_vals.split(' ');
            ele.inputVisible = false;
            ele.inputValue = '';
          }
        })
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        if(this.activeName === 'many') {
          this.runParams = data.data
        }else {
          this.staticParams = data.data
        }
        this.$message.success(data.meta.msg)
      })
    }
  },
  created() {
    this.getShopList()
  }
}

</script>

<style lang="less" scoped>
.el-card{
  margin-top: 20px;
}
.selectShop{
  margin-top: 15px;
  font-size: 15px;
  display: flex;
  align-items: center;
}
.el-table{
  margin-top: 20px;
}
.tag{
  margin-right: 20px;
}
.input-new-tag{
  width: 170px;
}
</style>