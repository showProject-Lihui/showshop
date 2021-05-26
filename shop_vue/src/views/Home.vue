<template>
  <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
          <div class="left">
              <img src="@/assets/logo.jpeg" alt="">
              <span>商品后台管理系统</span>
          </div>
          <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 主体区域 -->
      <el-container>
          <!-- 侧边栏区域 -->
          <el-aside :style="{width:collapse ? '64px' : '200px'}" class="aside">
                <div @click="isCollapse" class="zhedie">|||</div>
                <el-menu :default-active="path" router :collapse-transition="false" :collapse="collapse" unique-opened	 background-color="rgb(51, 55, 68)" text-color="white" active-text-color="#409eff">
                      <el-submenu :index="item1.id + ''" v-for="item1 in menuData" :key="item1.id">
                          <template  slot="title">
                              <i :class="iconData[item1.id]"></i>
                              <span>{{item1.authName}}</span>
                          </template>
                          <el-menu-item @click="activePath(item2.path)" :index="item2.path + ''" v-for="item2 in item1.children" :key="item2.id">
                              <i class="el-icon-menu"></i>
                              <span>{{item2.authName}}</span>
                          </el-menu-item>
                      </el-submenu>
                  </el-menu>
                </el-menu>
          </el-aside>
          <!-- 主体内容区域 -->
          <el-main class="main">
              <router-view></router-view>
          </el-main>
      </el-container>
  </el-container>
</template>

<script>
import { request1 } from '@/network/request1' 

export default {
    data() {
        return {
            menuData: '',
            iconData:{
                '125': 'el-icon-s-check',
                '103': 'el-icon-s-tools',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-marketing'
            },
            collapse:false,
            path:''
        }
    },
    methods:{
        //退出登陆
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        //获取左侧菜单数据
        getMenuData(){
            request1({
                url: '/menus'
            }).then(data => {
                const da = data.data;
                if(da.meta.status !== 200) return $message.error(da.meta.msg);
                this.menuData = da.data;
            })
        },
        isCollapse(){
            this.collapse = !this.collapse;
        },
        //将当前路径存到sessionsStore中
        activePath(path){
            window.sessionStorage.setItem('activePath',path)
            this.path = path;
        }
    },
    created() {
        this.getMenuData(),
        this.path = window.sessionStorage.getItem('activePath')
    }
}
</script>

<style lang="less" scoped>
.home-container{
    width: 100%;
    height: 100%;
    .el-header{
        background-color: rgb(102, 102, 102);
        display: flex;
        justify-content: space-between;
        padding: 0px;
        
        .left{
            height: 100%;
            display: flex;
            align-items: center;
            img{
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            span{
                margin-left: 10px;
                color: white;
            }
        }
    }
    .aside{
        background-color: rgb(51, 55, 68);
        color: white;
        .zhedie{
            background-color: #999;
            text-align: center;
            font-size: 10px;
            line-height: 24px;
            letter-spacing: 5px;
        }
        .el-menu{
            border: none;
        }
    }
    .main{
        background-color: rgb(234, 237, 241);
        width: 100%;
        height: 100%;

    }
    i{
        margin-right: 15px;
        border: 1px solid transparent;
    }
}
</style>