<template>
  <div class="login-container">
    <!-- logo区域 -->
    <div class="login-box">
      <div class="img">
        <img src="@/assets/logo.png" alt="">
      </div>
      <!-- 登陆表单区域 -->
      <div class="shuru">
        <el-form :rules="loginYz" :model="loginFrom" ref="loginFromRef">
          <!-- 用户名输入框 -->
          <el-form-item prop="userName">
            <el-input v-model="loginFrom.userName" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <!-- 密码输入框 -->
          <el-form-item prop="passWord">
            <el-input show-password v-model="loginFrom.passWord" prefix-icon="el-icon-s-goods"></el-input>
          </el-form-item>
          <!-- 登陆和重置按钮 -->
          <el-form-item class="button-box">
            <el-button type="primary" @click="dl">登陆</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {request1} from '@/network/request1'
export default {
  data () {
    return {
      //表单数据
      loginFrom:{
        userName:"admin",
        passWord:"123456"
      },
      //表单验证数据
      loginYz:{
        userName:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min: 3, max: 10, message: '长度在3到10个之间', trigger: 'blur'}
        ],
        passWord:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在6到15之间', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    //重置表单
    reset(){
      this.$refs.loginFromRef.resetFields()
    },
    //登陆
    dl(){
      const from = this.$refs.loginFromRef;
      from.validate(visau => {
        if(!visau) return;
        const user = {
          username:this.loginFrom.userName,
          password:this.loginFrom.passWord
        }
        request1({
          method: 'post',
          data: user,
          url: '/login'
        }).then(data => {
          let da = data.data;
          if(da.meta.status === 400) {
            this.$message({
              message: '用户不存在',
              type: 'error'
            })
          }else{
            this.$message({
              message: '登陆成功',
              type: 'success'
            })
            //把token存放到sessionStorage中
            window.sessionStorage.setItem('token', da.data.token);
            this.$router.push('/home')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box{
    width: 450px;
    height: 300px;
    background-color: white;
    position: relative;
    .img{
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      left: 50%;
      top: 0px;
      transform: translate(-50%,-50%);
      border: 1px solid #eee;
      padding: 10px;
      background-color: #fff;
      box-shadow: 0 0 5px 0 #ddd;
      img{
        background-color: #eee;
        width: 100%;
        height: 100%;
        border: 1px solid #eee;
        border-radius: 50%;
      }
    }
    .shuru{
      position: absolute;
      bottom: 0px;
      box-sizing: border-box;
      padding: 0 15px;
      width: 100%;
      .button-box{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>