<template>
        <div id="app">

            <div class="maddButton">
                <el-button type="success" round size="medium" @click="dialog = true" >添加会议室</el-button>
            </div>
            <el-drawer
                    title="添加/修改会议室"
                    direction="rtl"
                    :visible.sync="dialog"
                    custom-class="demo-drawer"
                    :with-header="false"
                    ref="drawer"
                    @close="closeDrawer"
            >
                <div class="demo-drawer__content" style="margin-top: 20px;width: 400px">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="门牌号" prop="roomNo">
                            <el-input v-model="ruleForm.roomNo" ></el-input>
                        </el-form-item>
                        <el-form-item label="楼层" prop="roomFloor">
                            <el-input v-model="ruleForm.roomFloor"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="roomType">
                            <el-input  v-model="ruleForm.roomType"></el-input>
                        </el-form-item>
                        <el-form-item label="可容纳人数" prop="roomSize">
                            <el-input v-model.number="ruleForm.roomSize"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="update" style="background-color: oldlace"  round @click="updateForm('ruleForm')">更 新</el-button>
                            <el-button v-if="!update" style="background-color: oldlace" round @click="submitForm('ruleForm')">立即添加</el-button>
                            <el-button @click="resetForm('ruleForm')" round>重 置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-drawer>

<!--            按照条件搜索-->
            <div class="mConditions">
                <el-select  v-model="roomFloor" clearable placeholder="楼层" @change="change">
                    <el-option
                            v-for="item in floors"
                            :key="item.roomFloor"
                            :label="item.roomFloor"
                            :value="item.roomFloor">
                    </el-option>
                </el-select>

                <el-select
                        class="mselect"
                        v-model="roomType"
                        clearable
                        placeholder="类型"
                        @change="change">
                    <el-option
                            v-for="item in types"
                            :key="item.roomType"
                            :label="item.roomType"
                            :value="item.roomType">
                    </el-option>
                </el-select>

                <el-select
                        class="mselect"
                        v-model="roomSize"
                        clearable
                        placeholder="可容纳人数"
                        @change="change">
                    <el-option
                            v-for="item in sizes"
                            :key="item.roomSize"
                            :label="item.roomSize"
                            :value="item.roomSize">
                    </el-option>
                </el-select>

            </div>


            <el-table :data="conferenceRooms.filter(data => !this.search || data.roomNo.toLowerCase().includes(this.search.toLowerCase())||
                data.roomFloor.toLowerCase().includes(this.search.toLowerCase()) || data.roomType.toLowerCase().includes(this.search.toLowerCase()))"
                    style="width: 100%;text-align: center"
                    :row-class-name="this.tableRowClassName">
                <el-table-column
                        prop="roomNo"
                        label="门牌号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="roomFloor"
                        label="楼层"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="roomType"
                        label="类型"
                        width="180"
                align="center">
                </el-table-column>
                <el-table-column
                        prop="roomSize"
                        label="可容纳人数"
                        width="150"
                        align="center">
                </el-table-column>
                <el-table-column label="可用状态" width="150"  align="center">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.roomState"
                                :active-value="1"
                                :inactive-value="0"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="getState(scope.row)"/>
                    </template>

                </el-table-column>

                <el-table-column label="设备"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookDevice(scope.row)">查看</el-button>
                    </template>

                </el-table-column>



                <el-table-column
                        align="right" >
                    <template slot="header" slot-scope="scope">
                        <el-input
                                v-model="search"
                                size="mid"
                                placeholder="输入楼层、门牌号、类型、人数"/>
                    </template>



                    <template slot-scope="scope">
                        <el-button
                                size="medium"
                                @click="handleaddDevice(scope.row)"
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


<!--            查看设备的表格-->
            <el-dialog title="设备" :visible.sync="dialogTableVisible">
                <el-table
                        :data="devices"
                        align="center"
                        :row-class-name="tableRowClassName"
                        >
                    <el-table-column
                            prop="dname"
                            label="设备名称" >
                    </el-table-column>
                    <el-table-column
                            label="数量" align="center">
                        <template slot-scope="scope">
                             <el-input-number v-model="scope.row.dnumber" @change="handleChange(scope.row.did,scope.row.dnumber)" :min="0"  label="设备数量"></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column  label="操作" align="center" >
                        <template slot-scope="scope">
                            <el-button
                                    size="medium"
                                    @click="handleEditDevice(scope.row)"
                                    icon="el-icon-edit"
                                    circle
                                    type="warning"
                                    style="margin-right: 10px"
                            ></el-button>

                            <template>
                                <el-popconfirm
                                        title="确定删除该设备吗？"
                                        @onConfirm="handleDeleteDevice(scope.row)"
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

<!--            添加设备或者修改的表单-->
            <el-dialog  :title="isUpdateDevice" :visible.sync="dialogFormVisible">

            <el-form :model="deviceForm" :rules="deviceFormRules" ref="deviceFormRules">
                <el-form-item label="设备名称"  label-width="150px" prop="dname" >
                    <el-input v-model="deviceForm.dname" autocomplete="off" placeholder="请输入设备名称" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="设备数量"  label-width="150px">
                    <el-input-number v-model="deviceForm.dnumber"  :min="0"  label="设备名称"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button round @click="dialogFormVisible = false">取 消</el-button>
                <el-button  round type="success" @click="addDevice">确 定</el-button>
            </div>
        </el-dialog>

        </div>
</template>

<script>
    export default {
        name: "conference_room",
        data(){
            return{
                isUpdateDevice:'添加设备',

                devices:[
                    {   "did":'',
                       "dname":'',
                       "dnumber":'',
                        "roomId":'',

                    }
                ],


                deviceForm:{
                    "roomId":'',
                    "dname":'',
                    "dnumber":'',
                },

                dialogFormVisible:false,

                dialogTableVisible:false,

                //查出没有重复的条件 进行筛选 后台数据用list嵌套map传到前端
                floors:[{
                    roomFloor:'1'
                }],
                types:[{
                    roomType:'多媒体'
                }],
                sizes:[{
                    roomSize:100
                }],

                //与下拉选框双向绑定
                roomFloor:'',
                roomSize:'',
                roomType:'',

                //抽屉表单中更新还是添加部门的判断依据
                update:false,
                search:'',
                conferenceRooms: [{
                    roomId:2,
                    roomNo: "003",
                    roomFloor: 11,
                    roomType: '大多媒体会议室',
                    roomSize: '300',
                    roomState: 1
                }],
                dialog: false,

                //如果是添加 id 状态是没有数据的 所以在后台中会判断成添加会议室 并且状态设置为1表示可用
                //如果是编辑 那么会调用handleEdit方法 把该行的数据给ruleForm 回显在表单中 此时的ruleForm是有Id的
                ruleForm: {
                    roomId:'',
                    roomNo: '',
                    roomFloor: '',
                    roomType:'',
                    roomState: '',
                   roomSize: '',
                },




                rules: {
                    roomNo: [
                        {required: true, message: '请输入门牌号', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    roomFloor: [
                        {required: true, message: '请输入楼层', trigger: 'blur'},
                    ],
                    roomType: [
                        {required: true, message: '请输入会议室类型', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    roomSize: [
                        { required: true, message: '请输入可容纳人数', trigger: 'blur' },
                        { type: 'number', message: '必须为数字', trigger: 'blur' }
                    ]
                },

                deviceFormRules:{
                    dname: [
                        {required: true, message: '请输入设备名称', trigger: 'blur'},
                        {min: 2, max:25, message: '长度在 2 到 25 个字符', trigger: 'blur'}
                    ],
                }
            }
        },

        methods: {
            handleChange(did,number){
                let _this = this;
                _this.axios.put("/device/changenumber",{
                    "did":did,
                    "number":number,
                },{
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res=>{

                })
         },

            handleEditDevice(row){
                this.isUpdateDevice = '修改设备信息';
              let temp = JSON.stringify(row);
              this.deviceForm = JSON.parse(temp);
              this.dialogFormVisible = true;
             },

            handleDeleteDevice(row){
                let _this = this;
                _this.axios.delete("/device/delete/"+row.did,{
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("删除成功");
                    //刷新表格
                    _this.axios.get("/device/listby/"+row.roomId,{
                        headers:{
                            "Authorization":localStorage.getItem("token")
                        }
                    }).then(res=>{
                        _this.devices = res.data.data;
                    })
                })
            } ,


            addDevice() {
                this.$refs['deviceFormRules'].validate((valid) => {
                    if (valid) {
                    let flag = this.deviceForm.did;
                        let _this = this;
                        _this.axios.post("/device/add", _this.deviceForm, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res => {
                            if(flag === null || flag === '' ) {
                                _this.$message.success("添加成功")

                                _this.deviceForm = {
                                    "did":'',
                                    "roomId": '',
                                    "dname": '',
                                    "dnumber": '',
                                };

                                _this.dialogFormVisible = false;
                            }
                            else {
                                _this.$message.success("修改成功")
                                //刷新表格
                                _this.axios.get("/device/listby/"+_this.deviceForm.roomId,{
                                    headers:{
                                        "Authorization":localStorage.getItem("token")
                                    }
                                }).then(res=>{
                                    _this.devices = res.data.data;
                                });
                                _this.deviceForm = {
                                    "did":'',
                                    "roomId": '',
                                    "dname": '',
                                    "dnumber": '',
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

            lookDevice(row){
                let roomId = row.roomId;
                let _this = this;
                _this.axios.get("/device/listby/"+roomId,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.devices = res.data.data;
                    this.dialogTableVisible = true;
                })

            },


            handleaddDevice(row){
                this.isUpdateDevice = '添加设备';
                this.deviceForm.roomId = row.roomId;
                this.dialogFormVisible = true;

            },

            change(){
                //这样才能避免为空的时候也能传递数据  因为后台restFul风格下传递的参数不能不传 如果直接写this.xxx
                //当属性为空时  传递不了
                let floor = JSON.stringify(this.roomFloor);
                let type1  = JSON.stringify(this.roomType);
                let size = JSON.stringify(this.roomSize);
                let url = "/conference-room/listby/"+floor+"/"+type1+"/"+size;

                let _this = this;
                this.axios.get(url,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.conferenceRooms = res.data.data;
                })
            },

            getConditions(){
                let _this = this;
                this.axios.get("/conference-room/getconditions",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.floors = res.data.data.floors;
                    _this.types = res.data.data.types;
                    _this.sizes = res.data.data.sizes;
                })
            },

            closeDrawer(){

                this.update=false;
                //关闭抽屉时  把数据清空
                this.ruleForm = {
                    roomId:'',
                    roomNo: '',
                    roomFloor: '',
                    roomType:'',
                    roomState: '',
                    roomSize: '',
                };
            },

            updateForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        _this.axios.post("/conference-room/add",_this.ruleForm,{

                            headers:{
                                "Authorization":localStorage.getItem("token")
                            }
                        }).then(res=>{
                            _this.$message.success("修改成功");
                            _this.dialog=false;
                            _this.update=false;
                            _this.ruleForm = {
                                roomId:'',
                                roomNo: '',
                                roomFloor: '',
                                roomType:'',
                                roomState: '',
                                roomSize: '',
                            };
                            _this.getConditions();
                            _this.getAllConferenceRoom();

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
                        _this.axios.post("/conference-room/add",_this.ruleForm,{
                            headers:{
                                "Authorization":localStorage.getItem("token")
                            }
                        }).then(res=>{
                            _this.$message.success("添加成功");
                            _this.dialog=false;
                            this.ruleForm = {
                                roomId:'',
                                roomNo: '',
                                roomFloor: '',
                                roomType:'',
                                roomState: '',
                                roomSize: '',
                            };
                            _this.getConditions();
                            _this.getAllConferenceRoom();

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.ruleForm={
                    roomId:'',
                    roomNo: '',
                    roomFloor: '',
                    roomType:'',
                    roomState: '',
                    roomSize: '',
                }
            },

            getAllConferenceRoom(){
                let _this = this;
                _this.axios.get("/conference-room/listall",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.conferenceRooms = res.data.data;
                    //console.log(this.deps)
                })
            },

            getState(row){
                this.axios.put("/conference-room/changestate",row,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                })
            },
            handleEdit(index, row) {
                this.update = true;
                //避免引用传递 当修改时 表单验证没通过 但是改了别的东西 列表显示也会跟着改  不希望出现这样的
                let JsonData = JSON.stringify(row);
                let rowData = JSON.parse(JsonData);

                //将这个设置为true则打开抽屉
                this.ruleForm=rowData;
                this.dialog=true;
            },
            handleDelete(index, row) {
                let _this = this
                _this.axios.delete("/conference-room/delete/"+row.roomId,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message.success("删除成功")

                    this.getConditions();
                    this.getAllConferenceRoom();
                })
            },

            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                } else if (rowIndex == 5) {
                    return 'warning-row';
                } else if (rowIndex === 7) {
                    return 'success-row'
                }
                return '';
            }
        },
        created() {
            this.getConditions();
            this.getAllConferenceRoom();
        }
    }
</script>

<style>
 .mConditions{
     margin-top: 15px;

 }

    .mselect{
        margin-left: 15px;
    }
</style>