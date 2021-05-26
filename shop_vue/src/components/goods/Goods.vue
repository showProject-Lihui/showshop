<template>
  <div class="goods-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input @clear="search" clearable v-model="shopListParams.query" placeholder="请输入">
            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col class="addShopBtn" :span="5">
          <el-button @click="addShop" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表展示区域 -->
      <el-table :data="shopList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary">编辑</el-button>
            <el-button @click="delShop(scope.row.goods_id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20 , 50]"
        :page-size="shopListParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request1 } from '@/network/request1'

export default {
  data() {
    return {
      //请求商品列表的参数
      shopListParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //商品列表数据
      shopList: [],
      //总数据条数
      total: 0
    }
  },
  methods: {
    //点击添加商品按钮，跳转到添加商品页面
    addShop(){
      this.$router.push('/goods/add')
    },
    //删除商品
    delShop(id) {
      this.$confirm('确认删除？', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request1({
          url: 'goods/' + id,
          method: 'delete'
        }).then(res => {
          const data = res.data;
          if(data.meta.status !== 200) {
            return this.$message.error(data.meta.msg)
          }
          this.$message.success(data.meta.msg)
          this.getShopList()
        })
      }).catch(() => {
        this.$message.error('已经取消操作')
      })
    },
    //搜索
    search(){
      this.getShopList()
    },
    
    //监听页码大小
    handleSizeChange(newsize) {
      this.shopListParams.pagesize = newsize;
      this.getShopList()
    },
    //切换页码
    handleCurrentChange(newpage) {
      this.shopListParams.pagenum = newpage;
      this.getShopList()
    },
    //请求商品列表
    getShopList() {
      request1({
        url: 'goods',
        params:this.shopListParams
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.$message.success(data.meta.msg)
        this.shopList = data.data.goods;
        this.total = data.data.total;
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
.addShopBtn{
  margin-left: 20px;
}
.el-table{
  margin-top: 20px;
}
.el-pagination{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>