<template>
  <div class="echarts-container">
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import { request1 } from '@/network/request1'
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      da:[]
    }
  },
  mounted() {
  
    let a= 2;
        //获取数据
        request1({
          url: 'reports/type/1',
        }).then(res => {
          console.log(res.data.data)
          this.da = res.data.data

                  // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.da);
        })


  }
}
</script>

<style lang="less" scoped>

</style>