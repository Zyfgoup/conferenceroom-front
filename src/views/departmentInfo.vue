<template>
    <div >

        <div style="margin-top: 50px">
            <el-alert
                    title="提示"
                    type="warning"
                    description="可自行修改密码与部门邮箱，若忘记密码或其他问题请联系管理员"
                    show-icon
            :closable="false"
            style="font-size: 16px">
            </el-alert>
        </div>


        <div class="mdepartmentInfo">
            <el-row >
                <el-col :span="10" :offset="7" >

                    <el-table
                            :data="tableData"
                            :row-class-name="tableRowClassName"
                            style="width: 380px"
                    size="medium">
                        <el-table-column
                                prop="name"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="value"
                                width="300">
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 15px;margin-left: 80px">
                        <el-button style="background-color: oldlace" round  @click="editPwd">修改密码</el-button>
                        <el-button style="background-color:#f0f9eb " round  @click="editEmail">修改邮箱</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

<!--        修改密码的弹出框-->
        <el-dialog title="修改密码" :visible.sync="dialogFormPwd">
            <el-form :model="pwdForm"  label-position="right" label-width="80px" status-icon :rules="rulesPwd" ref="pwdForm">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input  type="password" v-model="pwdForm.oldPassword" autocomplete="off" placeholder="请输入旧密码" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="新密码"  prop="newPassword">
                    <el-input   type="password" v-model="pwdForm.newPassword" placeholder="请输入新密码" style="width: 250px">
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input   type="password" v-model="pwdForm.checkPassword"  placeholder="再次输入新密码" style="width: 250px">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="background-color:#f0f9eb " @click="submitPwdForm('pwdForm')" >修改</el-button>
                    <el-button @click="resetForm('pwdForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

<!--        修改邮箱的弹窗框-->
        <el-dialog title="修改邮箱" :visible.sync="dialogFormEmail">
            <el-form :model="emailForm"  label-position="right" label-width="80px" status-icon :rules="rulesEmail" ref="emailForm">
                <el-form-item label="密码" prop="password">
                    <el-input  type="password" v-model="emailForm.password" placeholder="请输入密码" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="新邮箱" prop="newEmail">
                    <el-input  v-model="emailForm.newEmail"  placeholder="请输入新邮箱" style="width: 250px"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button style="background-color:#f0f9eb " @click="submitEmailForm('emailForm')" >修改</el-button>
                    <el-button @click="resetForm('emailForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    export default {
        name: "departmentInfo",
        data() {

            //检验密码
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                }
                else {
                    if (this.pwdForm.checkPassword !== '') {
                        this.$refs.pwdForm.validateField('checkPassword');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pwdForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {

                //弄成竖形的表格
                tableData: [{
                    name: '属性',
                    value: '值'
                }
                ],
                pwdForm: {
                    id: '',
                    oldPassword: '',
                    newPassword: '',
                    checkPassword: ''
                },
                emailForm:{
                    id:'',
                    password:'',
                    newEmail:'',
                },
                dialogFormPwd: false,
                dialogFormEmail:false,
                rulesPwd: {
                    oldPassword: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 5 个字符', trigger: 'blur'}
                    ],
                    newPassword: [
                        { validator: validatePass, trigger: 'blur' },
                        {min: 6, max: 15, message: '长度在 6 到 5 个字符', trigger: 'blur'}
                    ],
                    checkPassword: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],

                },
                rulesEmail:{
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 5 个字符', trigger: 'blur'}
                    ],
                    newEmail: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            let id = JSON.parse(Cookies.get("userInfo")).id;
           let _this = this;
           this.axios.get("/department/getby/"+id,{
               headers:{
                   "Authorization":localStorage.getItem("token")
               }
           }).then(res=>{
               let department = res.data.data;
               _this.tableData.pop();
               _this.tableData.push({"name":"部门编号:","value":department.depNo});
               _this.tableData.push({"name":"部门名称:","value":department.depName});
               _this.tableData.push({"name":"部门人数:","value":department.depPersonCount});
               _this.tableData.push({"name":"部门邮箱:","value":department.depEmail});

           })

        },
        methods: {

            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            },
            editPwd(){
                this.pwdForm.id = JSON.parse(Cookies.get("userInfo")).id;
                this.dialogFormPwd = true;
            },

            editEmail(){
                this.emailForm.id = JSON.parse(Cookies.get("userInfo")).id;
                this.dialogFormEmail = true;
            },
            submitPwdForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        let _this = this
                        this.axios.put("/department/updatepwd/",_this.pwdForm,{
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res=>{
                                _this.$message.success("修改成功");

                                //要把数据清空 不然下次还会显示
                                _this.pwdForm= {
                                    id: '',
                                    oldPassword: '',
                                    newPassword: '',
                                    checkPassword: ''
                                };
                            _this.dialogFormPwd = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            submitEmailForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        this.axios.put("/department/updateemail/",_this.emailForm,{
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res=>{
                            _this.$message.success("修改成功");

                            //要把数据清空 不然下次还会显示
                            _this.emailForm= {
                                id: '',
                               password: '',
                                newEmail:''
                            };
                            _this.dialogFormEmail = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }


    }
</script>

<style >
        .mdepartmentInfo{
            margin-top: 60px;

        }

        .el-table .warning-row {
            background:  #f0f9eb;
        }

        .el-table .success-row {
            background: #f0f9eb;
        }
</style>