<template>
    <div>


        <div class="warnning">
            <el-alert
                    title="提示"
                    type="error"
                    description="请尽量在会议开始前1小时之前进行申请，且每个会议之间间隔30分钟以供特殊情况时使用"
                    style="border-radius: 30px"
                    :closable="false">
            </el-alert>
        </div>

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
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="roomFloor"
                    label="楼层"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="roomType"
                    label="类型"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="roomSize"
                    label="可容纳人数"
                    width="180">
            </el-table-column>
            <el-table-column label="设备" width="180">
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
                            placeholder="输入楼层、会议室门牌号、会议室类型"/>
                </template>
                <template slot-scope="scope">
                    <el-button
                            size="medium"
                            @click="handleApply(scope.$index, scope.row)"

                            round
                            type="warning"
                            style="margin-right: 10px"
                    >申 请</el-button>

                </template>
            </el-table-column>
        </el-table>


        <!--        申请会议室弹出框-->
        <el-dialog title="申请会议室" :visible.sync="dialogFormApply">
            <el-form :model="record.conferenceRecord"  label-position="right" label-width="80px" status-icon :rules="rules" ref="applyForm">

                <el-form-item label="申请部门" prop="depId">
                    <el-select v-model="record.conferenceRecord.depId"  clearable placeholder="请选择部门"
                               style="width: 250px">
                        <el-option
                                v-for="item in deps"
                                :key="item.depId"
                                :label="item.depName"
                                :value="item.depId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="会议主题" prop="theme">
                    <el-input v-model="record.conferenceRecord.theme" placeholder="请输入会议主题" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="会议介绍"  prop="digest">
                    <el-input  type="textarea" autosize v-model="record.conferenceRecord.digest" placeholder="请输入会议摘要" style="width: 250px">
                    </el-input>
                </el-form-item>
                <el-form-item label="会议人数" prop="personCount">
                    <el-input  @blur="examinePersonCount"  v-model.number="record.conferenceRecord.personCount"  placeholder="会议人数" style="width: 250px">
                    </el-input>
                </el-form-item>

                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                            style="width: 250px"
                            v-model="record.conferenceRecord.startTime"
                            type="datetime"
                            placeholder="选择开始日期时间"
                            :picker-options="pickerOptions"
                            @blur="searchTimeConflict"
                            default-time="10:00:00"
                            value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" prop="endTime" >
                    <el-date-picker
                            style="width: 250px"
                            v-model="record.conferenceRecord.endTime"
                            type="datetime"
                            placeholder="选择结束日期时间"
                            :picker-options="pickerOptions"
                            @blur="searchTimeConflict"
                            default-time="10:30:00"
                            value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button style="background-color:oldlace " @click="submitForm('applyForm')" >提交申请</el-button>
                    <el-button @click="resetForm('applyForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--        查看设备的表格-->
        <el-dialog title="设备" :visible.sync="dialogTableVisible" style="text-align: center">
            <el-table
                    :data="devices"
                    style="text-align: center"
                    :row-class-name="tableRowClassName"
            >
                <el-table-column
                        prop="dname"
                        label="设备名称"
                >
                </el-table-column>
                <el-table-column
                        prop="dnumber"
                        label="数量"

                >

                </el-table-column>



            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: "applyConferenceByAdmin",
        data(){
            return{
                devices:[
                    {"did":'',
                        "dname":'',
                        "dnumber":'',
                        "roomId":'',

                    }
                ],

                dialogTableVisible:false,

                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },

                //申请弹出框
                dialogFormApply:false,

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

                //搜索框
                search:'',

                //表格绑定
                conferenceRooms: [{
                    roomId:2,
                    roomNo: "003",
                    roomFloor: 11,
                    roomType: '大多媒体会议室',
                    roomSize: '300',
                    roomState: 1
                }],

                record:{
                    "apply": {
                        "roomSize":'', //申请会议室时 会议人数要比较
                        "depId": '',
                        "roomId": ''
                    },
                    "conferenceRecord": {
                        "startTime": null,
                        "endTime": null,
                        "personCount":'',
                        "theme": "",
                        "digest": "",
                        "depId":'', //本来这个实体类是没有这个属性的 但是这里需要选择部门 必须带上 虽然这里有但是传到后端 实体类没有的话不会报错
                    }
                },

                deps:[
                    {
                       depId:'1',
                       depName:'研发部'
                       }
                ],

                rules: {
                    depId: [
                        {required: true, message: '请选择部门', trigger: 'blur'},
                    ],
                    theme: [
                        {required: true, message: '请输入会议主题', trigger: 'blur'},
                        {min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur'}
                    ],
                    digest: [
                        {required: true, message: '请输入会议介绍', trigger: 'blur'},
                        {min: 5, max: 50, message: '长度在 5 到 124 个字符', trigger: 'blur'}
                    ],
                    personCount: [
                        {required: true, message: '请输入参与会议人数', trigger: 'blur'},
                        { type: 'number', message: '必须为数字', trigger: 'blur' }
                    ],
                    startTime: [
                        {required: true, message: '请选择会议开始时间', trigger: 'blur'},
                    ],
                    endTime: [
                        {required: true, message: '请选择会议结束时间', trigger: 'blur'},
                    ],

                },
            }
        },

        methods:{

            lookDevice(row){
                let roomId = row.roomId;
                let _this = this;
                _this.axios.get("/device/listbyapply/"+roomId,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.devices = res.data.data;
                    this.dialogTableVisible = true;
                })

            },

            //检查参与会议人数是否小于等于会议室可容纳人数 并且不能为0
            examinePersonCount(){
                if(this.record.conferenceRecord.personCount!==null&&this.record.conferenceRecord.personCount!==0){
                    if(this.record.conferenceRecord.personCount>this.record.apply.roomSize){
                        this.$message({
                            message: '人数超过会议室可容纳人数',
                            type:'error',
                            center: true
                        });

                        this.record.conferenceRecord.personCount = '';
                    }

                }

                if(this.record.conferenceRecord.personCount === 0){
                    this.$message({
                        message: '参与会议人数不能为0',
                        type:'error',
                        center: true
                    });
                    this.record.conferenceRecord.personCount = '';
                }
            },

            //当选择时间的失去焦点时  去异步请求后台 是否时间允许 注意结束时间不能早于开始时间
            //这里判断使用！==null 那么最好一开始定义data时也用null  然后当不满足条件时 也是设置为null
            searchTimeConflict(){
                if(this.record.conferenceRecord.startTime!==null  && this.record.conferenceRecord.endTime!==null) {

                    //转为时间戳
                    let startTime = new Date(this.record.conferenceRecord.startTime);
                    let endTime = new Date(this.record.conferenceRecord.endTime);
                    let roomId = this.record.apply.roomId;
                    console.log(startTime.getHours(),endTime.getHours())

                    //结束时间必须大于开始时间 并且会议最短为10分钟
                    if (startTime.getTime() > endTime.getTime() || startTime.getTime()+(10*60*1000)>endTime.getTime()) {
                        this.$message({
                            message: '结束时间必须晚于开始时间，且会议时间最短为10分钟',
                            type: 'error',
                            center: true
                        });
                        this.record.conferenceRecord.startTime = null;
                        this.record.conferenceRecord.endTime = null;
                    } else if(startTime.getTime() < new Date().getTime()+15*60*1000){
                        //会议的开始时间最快也只能是当前时间再+15分钟的间隔
                        this.$message({
                            message: '开始时间至少比当前时间晚15分钟',
                            type: 'error',
                            center: true
                        });
                        this.record.conferenceRecord.startTime = null;
                        this.record.conferenceRecord.endTime = null;
                    } else if(startTime.getHours()<10 || endTime.getHours()>=23){
                        //会议室的使用时间只能是早上10点到晚上23点
                        //注意是10点以后 23点以前 所以是大于等于23
                        this.$message({
                            message: '会议室的使用时间为10-23点',
                            type: 'error',
                            center: true
                        });
                        this.record.conferenceRecord.startTime = null;
                        this.record.conferenceRecord.endTime = null;
                    } else {

                        let _this = this;
                        _this.axios.get("/apply/searchtimeconflict/" + roomId + "/" + _this.record.conferenceRecord.startTime
                            + "/" + _this.record.conferenceRecord.endTime, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res => {
                            if (res.data.data === '1') {


                                this.$message({
                                    message: '时间允可',
                                    type: 'success',
                                    center: true
                                });
                            } else {
                                this.$message({
                                    message: '时间冲突，请选择其他时间或者会议室',
                                    type: 'error',
                                    center: true
                                });
                                _this.record.conferenceRecord.startTime = null;
                                _this.record.conferenceRecord.endTime = null;
                            }
                        })
                    }
                }
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                          let depId = this.record.conferenceRecord.depId;
                            this.record.apply.depId = depId;
                            let _this = this;
                            _this.axios.post("/apply/addbyadmin", _this.record, {
                                headers: {
                                    "Authorization": localStorage.getItem("token")
                                }
                            }).then(res => {
                                this.$message({
                                    message: '紧急申请成功',
                                    type: 'success',
                                    center: true
                                });
                                _this.depId = '';
                                _this.dialogFormApply = false;
                                _this.record.conferenceRecord = {
                                    "startTime": null,
                                    "endTime": null,
                                    "personCount": '',
                                    "theme": "",
                                    "digest": "",
                                }
                            });

                    }else{
                            console.log('error submit!!');
                            return false;
                    }

                })
            },


            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            change(){
                //这样才能避免为空的时候也能传递数据  因为后台restFul风格下传递的参数不能不传 如果直接写this.xxx
                //当属性为空时  传递不了
                let floor = JSON.stringify(this.roomFloor);
                let type1  = JSON.stringify(this.roomType);
                let size = JSON.stringify(this.roomSize);
                let url = "/conference-room/listbyonstate/"+floor+"/"+type1+"/"+size;

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
                this.axios.get("/conference-room/getconditionsonstate",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.floors = res.data.data.floors;
                    _this.types = res.data.data.types;
                    _this.sizes = res.data.data.sizes;
                })
            },
            getAllConferenceRoom(){
                let _this = this;
                _this.axios.get("/conference-room/listallonstate",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.conferenceRooms = res.data.data;
                })
            },
            handleApply(index, row) {
                this.dialogFormApply = true;
                this.record.apply.roomId = row.roomId;
                this.record.apply.roomSize = row.roomSize;

                let _this = this;
                _this.axios.get("/department/getalldeps",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.deps = res.data.data;
                    console.log(_this.deps)
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

<style scoped>
    .warnning{
        margin-top: 30px;
    }
</style>