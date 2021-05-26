<template>
  <div class="add-container">
    <!-- 面包屑列表 -->
    <el-breadcrumb separator="/"> 
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods'}">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert type="info" title="添加商品信息" center show-icon :closable="false"></el-alert>
      <!--步骤条-->
      <el-steps :active="+activeIndex" :space="200" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--左侧标签页-->
      <el-form ref="addFormRef" :model="addForm" :rules="rules" label-position="top">
        <el-tabs @tab-click="tagClick" v-model="activeIndex" tab-position="left" :before-leave="beforeLeave">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="选择商品分类">
              <el-cascader v-model="addForm.goods_cat" :props="options" :options="shopList" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item v-for="ele in manyList" :key="ele.attr_id" :label="ele.attr_name"> 
              <el-checkbox-group v-model="ele.attr_vals">
                <el-checkbox v-for="(ele1,in1) in ele.attr_vals" :key="in1" :label="ele1"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item v-for="ele in onlyList" :key="ele.attr_id" :label="ele.attr_name">
              <el-checkbox-group v-model="ele.attr_vals">
                <el-checkbox v-for="(ele1,in1) in ele.attr_vals" :key="in1" :label="ele1"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="onSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <el-input v-model="addForm.goods_introduce"></el-input>
            <el-button @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--图片预览对话框-->
    <el-dialog :visible.sync="show1">
      <img :src="preview" alt="" style="width: 100%"> 
    </el-dialog>
  </div>
</template>

<script>
import { request1 } from '@/network/request1'
import _ from 'lodash'

export default {
  data() {
    //自定义规则
    let priceRul = (rul, value, callback) => {
      if(typeof(value) !== 'number') {
        callback(new Error('价格需要是数字'))
      }else if(value <= 0) {
        callback(new Error('价格不能为0'))
      }
      callback()
    };
    let numberRul = (rul, value, callback) => {
      if(typeof(value) !== 'number') {
        callback(new Error('数量必须是数字'))
      }
      callback()
    };
    let weightRul = (rul, value, callback) =>{
      if(typeof(value) !== 'number'){
        callback(new Error('必须是数字'))
      }
      callback()
    }
    return {
      show1: false,
      //预览图片地址
      preview:'',
      //
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //级联选择器的配置
      options: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      rules:{
        goods_name: [
          { required: true, message: '名字必须填', trigger: 'blur' },
          { min: 3, max: 20, message: '长度为3～20个字符', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '数量必须填', trigger: 'blur'},
        ],
        goods_weight: [
          { required: true, message: '重量必须填', trigger: 'blur'},
        ],
        goods_price: [
          { required: true, message: '价格必须填', trigger: 'blur'},
        ]
      },
      //动态参数列表
      manyList: [],
      //静态属性列表
      onlyList: [],
      //商品分类列表
      shopList: [],
    }
  },
  computed: {
    paramsId() {
      if(this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null;
    }
  },
  methods: {
    //点击添加商品
    add() {
      const form = this.$refs.addFormRef;
      form.validate(res => {
        if(!res) {
          return this.$message.error('请填写必要的表单项')
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyList.forEach(ele => {
        let obj = {}
        if(ele.attr_vals.length > 0) {
          obj = {
            attr_id: ele.attr_id,
            attr_value: ele.attr_vals.join(' ')
          }
          this.addForm.attrs.push(obj)
        }
        
        })
        this.onlyList.forEach(ele => {
          const obj = {
            attr_id: ele.attr_id,
            attr_value: ele.attr_vals
          }
          this.addForm.attrs.push(obj)
        })
        form.attrs = this.addForm.attrs;
        console.log(form);
        request1({
          url: 'goods',
          method: 'post',
          data: form
        }).then(res => {
          const data = res.data;
          console.log(data);
          if(data.meta.status !== 201) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.$router.push('/goods')
        })
      })
    },
    //图片上传成功后的钩子
    onSuccess(resp) {
      this.addForm.pics.push({
        pic: resp.data.tmp_path
      })
    
    },
    //处理图片预览效果
    handlePreview(file) {
      this.preview = file.response.data.url;
      this.show1 = true;
    },
    //处理移除图片的效果
    handleRemove(file) {
      const path = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex( x => x.pic === path)
      this.addForm.pics.splice(i,1);
    },
    //切换标签页时触发
    tagClick() {
      if(this.activeIndex === '1') {
        request1({
          url: 'categories/' + this.paramsId + '/attributes',
          params: {sel: 'many'}
        }).then(res => {

          const data = res.data;
          if(data.meta.status !== 200) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.manyList = data.data;
          this.manyList.forEach(ele => {
            if(ele.attr_vals.length !== 0) {
              ele.attr_vals = ele.attr_vals.split(' ');
            }
          })
        })
      }else if(this.activeIndex === '2') {
        request1({
          url: 'categories/' + this.paramsId + '/attributes',
          params: {sel: 'only'}
        }).then(res => {
          const data = res.data;
          if(data.meta.status !== 200) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.onlyList = data.data;
          this.onlyList.forEach(ele => {
            if(ele.attr_vals.length !== 0) {
              ele.attr_vals = ele.attr_vals.split(' ');
              console.log(ele.attr_vals);
            }
          })
        })
      }
    },
    //判断是否可以切换标签页
    beforeLeave(before,after) {
      if(after === '0') {
        if(this.addForm.goods_cat.length < 3) {
          this.$message.error('请选择分类')
          return false
        }
        return true;
      }
    },
    //选择级联选择器后的触发事件
    handleChange() {
      if(this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = [];
      }
    },
    getShopList() {
      request1({
        url: 'categories'
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.shopList = data.data;
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
.el-steps{
  margin-top: 20px;
}
.el-tabs{
  margin-top: 20px;
}
</style>