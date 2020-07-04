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
    </div>
</template>

<script>
    export default {
        name: "department",
        methods: {
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

                //抽屉表单中更新还是添加部门的判断依据
                update:false,

                deps: [
                    {
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