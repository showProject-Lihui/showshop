<template>
  <div class="user-container">
    <!-- 面包屑列表 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片展示区域 -->
    <el-card class="box-card">
        <!-- 搜索和添加用户区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <div>
                    <el-input v-model="queryPage.query" clearable @clear="getPageData">
                        <el-button @click="getPageData" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </el-col>
            <el-col class="button-search" :span="4">
                <div>
                    <el-button @click="userAddBoxVisible = true" type="primary">添加用户</el-button>
                </div>
            </el-col>
        </el-row>
    </el-card>
    <!-- 用户列表展示区域 -->
    <el-table class="userList" :data="pageDate.users" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <el-switch @change="userStatusChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
            </template>
        </el-table-column>
        <el-table-column width="210px" label="操作">
            <template slot-scope="scope">
                <el-button @click="editFrom(scope.row.id)" type="primary" size="mini" icon="el-icon-edit"></el-button>
                <el-button @click="del(scope.row.id)" type="danger" size="mini" icon="el-icon-delete"></el-button>
                <el-tooltip  content="分配角色" placement="top" effect="dark" :enterable="false">
                    <el-button @click="fpjs(scope.row)" type="warning" size="mini" icon="el-icon-setting"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-box">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20]"
            :page-size="queryPage.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="+total">
        </el-pagination>
    </div>
    <!-- 添加用户显示框 -->
    <el-dialog @closed="addDislog" title="请输入新用户信息" :visible.sync="userAddBoxVisible">
        <el-form :model="addUser" :rules="addUserRules" ref="addForm" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addUser.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addUser.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUser.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addUser.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="addUserF">确定</el-button>
            <el-button @click="userAddBoxVisible=false" type="primary">取消</el-button>
        </span>
    </el-dialog>
    <!-- 编辑用户显示框 -->
    <el-dialog title="修改用户" :visible.sync="editUserBox">
        <el-form ref="editForm" :model="editUserData" :rules="addUserRules" label-width="70px">
            <el-form-item label="姓名">
                <el-input disabled v-model="editUserData.username"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editUserData.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUserData.email"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="editUserF">确定</el-button>
            <el-button @click="editUserBox=false">取消</el-button>
        </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="userRoleBox">
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <el-row>
            <el-col :span="5">分配新角色</el-col>
            <el-col>
                <el-select v-model="valueRoles" placeholder="请选择">
                    <el-option v-for="item in allRoles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <span slot="footer">
            <el-button @click="fpjsqr">确定</el-button>
            <el-button @click="userRoleBox=false">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { request1 } from '@/network/request1'

export default {
    data() {
        //定义邮箱规则
        let emailRule = (rule, value, callback) => {
            const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(reg.test(value)) {
                return callback()
            }
            callback(new Error('邮箱格式不正确'))
        };
        //定义手机号规则
        let phoneRule = (rule, value, callback) => {
            const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
            if(reg.test(value)) {
                return callback()
            }
            callback(new Error('手机号格式不正确'))
        };
        return {
            //选择的角色
            valueRoles: '',
            //所有的角色
            allRoles:[],
            //正在分配角色的用户的信息
            userInfo:{},
            //分配角色对话框的显示和隐藏
            userRoleBox: false,
            //获取用户列表数据的参数
            queryPage:{
                //关键字搜索
                query:'',
                //页码
                pagenum: 1,
                //每页显示条数
                pagesize: 5
            },
            //获取到的用户列表数据
            pageDate:'',
            //总的用户列表数据量
            total:'',
            //控制是否显示添加用户显示框
            userAddBoxVisible:false,
            //添加用户数据
            addUser:{
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            //添加用户表单的验证规则
            addUserRules: {
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 6, max: 35, message: '长度在6～15个字符', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 15, message: '长度在6～15个字符', trigger: 'blur'}
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur'},
                    { validator: emailRule, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur'},
                    { validator: phoneRule, trigger: 'blur'}
                ]
            },
            //控制编辑用户对话框的隐藏显示
            editUserBox: false,
            //当前正在编辑的用户信息
            editUserData: {}
        }
    },
    created() {
        this.getPageData()
    },
    methods: {
        //
        fpjsqr() {
            request1({
                url: 'users/' + this.userInfo.id + '/role',
                method: 'put',
                data:{rid: this.valueRoles}
            }).then(res => {
                const data = res.data;
                if(data.meta.status !== 200) {
                    return this.$message.error(data.meta.msg)
                }
                this.$message.success(data.meta.msg)
            })
        },
        //点击分配角色按钮
        fpjs(role) {
            this.userRoleBox = true;
            this.userInfo = role;
            //拿到所有的角色
            request1({
                url: 'roles'
            }).then(res => {
                const data = res.data;
                this.allRoles = data.data;
            })
        },
        //获取用户列表数据
        getPageData() {
            request1({
                url: 'users',
                params: this.queryPage
            }).then(data => {
                const da = data.data;
                if(da.meta.status !== 200) {
                    this.$message.error(da.meta.msg)
                    return;
                }
                this.pageDate = da.data;
                this.total = da.data.total;
            })
        },
        //选择每页展示多少数据
        handleSizeChange(newSize) {
            this.queryPage.pagesize = newSize;
            this.getPageData()
        },
        //切换页码
        handleCurrentChange(newPage) {
            this.queryPage.pagenum =  newPage;
            this.getPageData()
        },
        //切换用户状态
        userStatusChange(user){
            request1({
                url: `users/${user.id}/state/${user.mg_state}`,
                method: 'put'
            }).then(data => {
                const da = data.data;
                console.log(da)
                if(da.meta.status !== 200) {
                    this.$message.error(da.meta.msg)
                    user.mg_state = !user.mg_state;
                }else{
                    this.$message.success(da.meta.msg)
                }
                
            })
        },
        //监听添加用户显示框关闭的事件函数
        addDislog() {
            //重置添加用户表单数据
            this.$refs.addForm.resetFields()
        },
        //添加用户
        addUserF() {
            const form = this.$refs.addForm;
            form.validate(result => {
                if(!result) {
                    return this.$message.error('用户信息格式错误，请重新填写')
                }
                request1({
                    url: 'users',
                    method: 'post',
                    data: this.addUser
                }).then(data => {
                    const da = data.data;
                    if(da.meta.status !== 201) {
                        return this.$message.error(da.meta.msg)
                    }
                    this.$message.success(da.meta.msg)
                    this.userAddBoxVisible = false;
                    this.getPageData();
                })
            })
        },
        //打开编辑窗口
        editFrom(id) {
            request1({
                url: 'users/' + id
            }).then(data => {
                const da = data.data;
                if(da.meta.status !== 200) {
                    return this.$message.error(da.meta.msg)
                }
                this.editUserData = da.data;
                this.editUserBox = true;
            })
        },
        //提交编辑用户信息
        editUserF() {
            console.log(this.editUserData)
            const form = this.$refs.editForm;
            form.validate(result => {
                if(!result) {
                    return this.$message.error('格式错误，请重试')
                }
                request1({
                    url: 'users/' + this.editUserData.id,
                    method: 'put',
                    data:{
                        email: this.editUserData.email,
                        mobile: this.editUserData.mobile
                    }
                }).then(data => {
                    const da = data.data;
                    if(da.meta.status !== 200) {
                        return this.$message.error(da.meta.msg)
                    }
                    this.$message.success(da.meta.msg);
                    this.getPageData();
                    this.editUserBox = false;
                })
            })
        },
        //删除用户
        del(id) {
            this.$confirm('是否删除id为' + id + '的用户？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(data => {
                request1({
                    url: 'users/' + id,
                    method: 'delete'
                }).then(data => {
                    const da = data.data;
                    if(da.meta.status !== 200) {
                        this.$message.error(da.meta.msg)
                    }
                    this.$message.success(da.meta.msg);
                    this.getPageData();
                    
                })
            }).catch(data => {
                this.$message.success('已取消该操作')
            })
        }

    }
}
</script>

<style lang="less" scoped>
.user-container{
    .el-card{
        margin-top: 20px;
    }
    .userList{
        margin: 0 auto;
        margin-top: 20px;
        padding: 0 20px;
    }
    .pagination-box{
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
}
</style>