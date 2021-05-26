<template>
  <div class="orders-container">
    <!--面包屑列表-->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!--搜索订单-->
      <el-row>
        <el-col :span="7">
          <el-input v-model="ordersListQuery.query" clearable @clear="search">
            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格渲染 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope"> 
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination 
        class="fy"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 30, 50]"
        :page-size="5"
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
      //获取订单传递的消息
      ordersListQuery: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //总数据量
      total: 0,
      //订单数据
      ordersList: []
    }
  },
  methods: {
    //搜索
    search() {
      this.getOrdersList();
    },
    //控制每页展示数据的条数
    handleSizeChange(num) {
      this.ordersListQuery.pagesize = num;
      this.getOrdersList()
    },
    //控制页码
    handleCurrentChange(num) {
      this.ordersListQuery.pagenum = num;
      this.getOrdersList()
    },
    //获取订单数据
    getOrdersList() {
      request1({
        url: 'orders',
        params: this.ordersListQuery
      }).then(res => {
        const data = res.data;
        if(data.meta.status !== 200) {
          return this.$message.error(data.meta.msg)
        }
        this.ordersList = data.data.goods;
        this.total = data.data.total;
        this.$message.success(data.meta.msg)
      })
    }
  },
  created() {
    this.getOrdersList()
  }
}
</script>

<style lang="less" scoped>
.el-card{
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
.fy {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>