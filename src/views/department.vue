<template>
    <div id="app">

        <div>
            <el-button type="success" round size="medium" @click="dialog = true" >添加部门</el-button>
        </div>
<!--添加部门或者修改部门的弹出框-->
        <el-drawer
                title="添加/修改部门"
                direction="rtl"
                :visible.sync="dialog"
                custom-class="demo-drawer"
                :with-header="false"
                ref="drawer"
                @close="closeDrawer"
        >
            <div class="demo-drawer__content" style="margin-top: 20px;width: 400px">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="部门编号" prop="depNo">
                        <el-input v-model="ruleForm.depNo" ></el-input>
                    </el-form-item>
                    <el-form-item label="部门名称" prop="depName">
                        <el-input v-model="ruleForm.depName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="depPassword">
                        <el-input type="password" v-model="ruleForm.depPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="部门人数" prop="depPersonCount">
                        <el-input v-model.number="ruleForm.depPersonCount"></el-input>
                    </el-form-item>
                    <el-form-item label="部门邮箱" prop="depEmail">
                        <el-input   v-model="ruleForm.depEmail"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="update"   style="background-color: oldlace" round @click="updateForm('ruleForm')">更 新</el-button>
                        <el-button v-if="!update"  style="background-color: oldlace" round @click="submitForm('ruleForm')">立即添加</el-button>
                        <el-button @click="resetForm('ruleForm')" round>重 置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>


        <el-table
                :data="deps.filter(data => !search || data.depName.toLowerCase().includes(search.toLowerCase())||
                data.depNo.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%;text-align: center"
                :row-class-name="tableRowClassName">
            <el-table-column
                    prop="depNo"
                    label="部门编号"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="depName"
                    label="部门名称"
                    width="150"
            align="center">
            </el-table-column>
            <el-table-column
                    prop="depPersonCount"
                    label="部门人数"
                    width="150"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="depEmail"
                    label="部门邮箱"
                    width="300"
                    align="center">
            </el-table-column>

            <el-table-column label="员工"  align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="lookEmployee(scope.row)">查看</el-button>
                </template>

            </el-table-column>

            <el-table-column
                    align="right" >
                <template slot="header" slot-scope="scope">
                    <el-input
                            v-model="search"
                            size="medium"
                            placeholder="输入部门名称或者编号搜索"/>
                </template>
                <template slot-scope="scope">

                    <el-button
                            size="medium"
                            @click="handleaddEmployee(scope.row)"
                            icon="el-icon-plus"
                            circle
                            type="success"

                    ></el-button>


                    <el-button
                            size="medium"
                            @click="handleEdit(scope.$index, scope.row)"
                            icon="el-icon-edit"
                            circle
                            type="warning"
                            style="margin-right: 10px"
                    ></el-button>

                    <template>
                        <el-popconfirm
                                title="确定删除该部门吗？"
                                @onConfirm="handleDelete(scope.$index, scope.row)"
                        >
                            <el-button
                                    slot="reference"
                                    size="medium"
                                    type="danger"
                                    circle
                                    icon="el-icon-delete"
                            ></el-button>
                        </el-popconfirm>
                    </template>
                </template>
            </el-table-column>
        </el-table>


        <!--            查看员工的表格-->
        <el-dialog title="员工" :visible.sync="dialogTableVisible">
            <el-table
                    :data="employees"
                    align="center"
                    :row-class-name="tableRowClassName"
            >
                <el-table-column
                        prop="eno"
                        label="工号" >
                </el-table-column>
                <el-table-column
                        prop="ename"
                        label="员工名字" >
                </el-table-column>


                <el-table-column  label="操作" align="center" >
                    <template slot-scope="scope">

                        <el-button
                                size="medium"
                                @click="handleEditEmployee(scope.row)"
                                icon="el-icon-edit"
                                circle
                                type="warning"
                                style="margin-right: 10px"
                        ></el-button>

                        <template>
                            <el-popconfirm
                                    title="确定删除该员工吗？"
                                    @onConfirm="handleDeleteEmployee(scope.row)"
                            >
                                <el-button
                                        slot="reference"
                                        size="medium"
                                        type="danger"
                                        circle
                                        icon="el-icon-delete"
                                ></el-button>
                            </el-popconfirm>
                        </template>
                    </template>
                </el-table-column>

            </el-table>
        </el-dialog>

        <!--            添加员工或者修改的表单-->
        <el-dialog  :title="isUpdateEmployee" :visible.sync="dialogFormVisible">

            <el-form :model="employeeForm" :rules="employeeFormRules" ref="employeeFormRules">
                <el-form-item label="员工工号"  label-width="150px" prop="eno" >
                    <el-input v-model="employeeForm.eno" autocomplete="off" placeholder="请输入员工工号" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="员工名字"  label-width="150px" prop="ename" >
                    <el-input v-model="employeeForm.ename" autocomplete="off" placeholder="请输入员工名字" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="登录密码"  label-width="150px" prop="epassword" >
                    <el-input v-model="employeeForm.epassword" autocomplete="off" placeholder="请输入员工密码" style="width: 300px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button round @click="dialogFormVisible = false">取 消</el-button>
                <el-button  round type="success" @click="addEmployee">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "department",
        methods: {

            handleaddEmployee(row){
                this.isUpdateEmployee = '添加员工';
                this.employeeForm.depId = row.depId;
                this.dialogFormVisible = true;
            },

            addEmployee() {
                this.$refs['employeeFormRules'].validate((valid) => {
                    if (valid) {
                        let flag = this.employeeForm.eid;
                        let _this = this;
                        _this.axios.post("/employee/add", _this.employeeForm, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res => {
                            if(flag === null || flag === '' ) {
                                _this.$message.success("添加成功")
                                _this.employeeForm = {
                                    eid:'',
                                    ename:'',
                                    eno:'',
                                    epassword:'',
                                    depId:'',
                                };

                                _this.dialogFormVisible = false;
                            }
                            else {
                                _this.$message.success("修改成功")
                                //刷新表格
                                _this.axios.get("/employee/getby/"+_this.employeeForm.depId,{
                                    headers:{
                                        "Authorization":localStorage.getItem("token")
                                    }
                                }).then(res=>{
                                    _this.employees = res.data.data;
                                });
                                _this.employeeForm = {
                                    eid:'',
                                    ename:'',
                                    eno:'',
                                    epassword:'',
                                    depId:'',
                                };

                                _this.dialogFormVisible = false;
                            }

                        })


                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            handleDeleteEmployee(row){
                let _this = this;
                _this.axios.delete("/employee/delete/"+row.eid,{
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("删除成功");
                    //刷新表格
                    _this.axios.get("/employee/getby/"+row.depId,{
                        headers:{
                            "Authorization":localStorage.getItem("token")
                        }
                    }).then(res=>{
                        _this.employees = res.data.data;
                    })
                })
            },

            handleEditEmployee(row){
                this.isUpdateEmployee = '修改员工信息';
                let temp = JSON.stringify(row);
                this.employeeForm = JSON.parse(temp);
                this.employeeForm.epassword='';
                this.dialogFormVisible = true;
            },

            lookEmployee(row){
                let depId = row.depId;
                let _this = this;
                this.axios.get('/employee/getby/'+depId,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.employees = res.data.data;
                    _this.dialogTableVisible = true;
                })

            },

            closeDrawer(){
                this.update=false;
                //关闭抽屉时  把数据清空
                this.ruleForm = {depNo: '',
                    depName: '',
                    depPersonCount:'',
                    depPassword: '',
                    depEmail: '',};
            },

            getAllDep(){
                let _this = this
                _this.axios.get("/department/listAll",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.deps = res.data.data;
                    //console.log(this.deps)
                })
            },

            updateForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        _this.axios.post("/department/update",_this.ruleForm,{

                            headers:{
                                "Authorization":localStorage.getItem("token")
                            }
                        }).then(res=>{
                            _this.$message.success("修改成功");
                            _this.dialog=false;
                            _this.update=false;

                            //把表单的数据清空 不然会还会保留本次的数据
                            _this.ruleForm = {depNo: '',
                                depName: '',
                                depPersonCount:'',
                                depPassword: '',
                                depEmail: '',};
                            _this.getAllDep();

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      let _this = this;
                      _this.axios.post("/department/add",_this.ruleForm,{
                          headers:{
                              "Authorization":localStorage.getItem("token")
                          }
                      }).then(res=>{
                          _this.$message.success("添加成功");
                          _this.dialog=false;
                          //把表单的数据清空 不然会还会保留本次的数据
                          _this.ruleForm = {depNo: '',
                              depName: '',
                              depPersonCount:'',
                              depPassword: '',
                              depEmail: '',};
                          _this.getAllDep()

                      })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.ruleForm={
                    depNo: '',
                    depName: '',
                    depPersonCount:'',
                    depPassword: '',
                    depEmail: '',
                }
            },

            handleEdit(index, row) {
                this.update = true;

                //避免引用传递 当修改时 表单验证没通过 但是改了别的东西 列表显示也会跟着改  不希望出现这样的
               let JsonData = JSON.stringify(row);
               let rowData = JSON.parse(JsonData);

                //将这个设置为true则打开抽屉
                this.dialog=true;
                this.ruleForm=rowData;
                this.ruleForm.depPassword=''
            },
            handleDelete(index, row) {
                let _this = this
                _this.axios.delete("/department/delete/"+row.depNo,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("删除成功")
                    _this.getAllDep()
                })
            },

            tableRowClassName({row, rowIndex}) {
                if (rowIndex===1) {
                    return 'warning-row';
                } else if (rowIndex===3) {
                    return 'success-row';
                }else if(rowIndex==5){
                    return 'warning-row';
                }else if(rowIndex===7){
                    return 'success-row'
                }
                return '';
            }
        },
        data() {
            return {

                employeeFormRules:{
                    eno: [
                        {required: true, message: '请输入员工工号', trigger: 'blur'},
                        {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
                    ],
                    ename: [
                        {required: true, message: '请输入员工名字', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 8 个字符', trigger: 'blur'}
                    ],
                    epassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 5 个字符', trigger: 'blur'}
                    ],
                },

                employeeForm:{
                    ename:'',
                    eno:'',
                    epassword:'',
                    depId:'',
                },

                isUpdateEmployee:'添加员工',

                dialogFormVisible:false,

                employees:[
                    {
                        eid:'',
                        eno:'00001',
                        ename:'小明',
                        epassword:'123456',
                        depId:'',

                    }
                ],

                dialogTableVisible:false,

                //抽屉表单中更新还是添加部门的判断依据
                update:false,

                deps: [
                    {
                        depId:'',
                        depNo: '002',
                        depName: '研发部',
                        depPersonCount: 23,
                        depEmail: "619122012@qq.com"
                    },

                ],
                search: '',
                dialog: false,
                ruleForm: {
                    depNo: '',
                    depName: '',
                    depPersonCount:'',
                    depPassword: '',
                    depEmail: '',
                },



                rules: {
                    depNo: [
                        {required: true, message: '请输入部门编号', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    depName: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 8 个字符', trigger: 'blur'}
                    ],
                    depPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 5 个字符', trigger: 'blur'}
                    ],
                    depPersonCount: [
                        {required: true, message: '请输入部门人数', trigger: 'blur'},
                        {type:'number',message: '人数必须为数字值', trigger: 'blur' }
                    ],
                    depEmail: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                    ]
                },
            }
        },
        created() {
            this.getAllDep()
        }
    }
</script>

<style >
    .el-table .warning-row {
        background: #f0f9eb;
    }

    .el-table  .success-row {
        background: #f0f9eb;
    }

</style>