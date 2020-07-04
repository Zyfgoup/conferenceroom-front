<template>
    <div>
        <el-tabs v-model="auditState" @tab-click="handleClick">
            <el-tab-pane key="admin0" name="0">
                <span slot="label"><i class="iconfont icontongguo"></i> 未审核</span>


                <div class="mConditions" style="margin-left: 20px;margin-bottom: 10px">
                    <el-select  v-model="depName" clearable placeholder="部门" @change="change">
                        <el-option
                                v-for="item in depNames"
                                :key="item.depName"
                                :label="item.depName"
                                :value="item.depName">
                        </el-option>
                    </el-select>
                </div>

                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase())
                || data.depName.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="会议室类型">
                                    <span>{{ props.row.roomType }}</span>
                                </el-form-item>
                                <el-form-item label="会议摘要">
                                    <span>{{ props.row.digest }}</span>
                                </el-form-item>
                                <el-form-item label="会议人数">
                                    <span>{{ props.row.personCount }}</span>
                                </el-form-item>
                                <el-form-item label="会议时间">
                                    <span>{{ props.row.startTime}} -- {{props.row.endTime}}</span>
                                </el-form-item>
                                <el-form-item label="申请时间">
                                    <span>{{ props.row.applyTime }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="会议主题"
                            prop="theme"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            label="会议室门牌号"
                            prop="roomNo"
                    align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室楼层"
                            prop="roomFloor"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="申请部门"
                            prop="depName"
                            align="center">
                    </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、门牌号、楼层、部门"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                    size="small"
                                    @click="access(scope.row)"
                                    round
                                    type="success"
                                    style="margin-right: 10px"
                            >通 过</el-button>

                                    <el-button
                                            size="small"
                                            type="danger"
                                           round
                                            @click="reject(scope.row)"
                                    >驳 回</el-button>

                            </template>
                    </el-table-column>

                </el-table>
                <div style="text-align: center;position:relative;margin-top: 20px">
                    <el-pagination
                            layout="total,prev, pager, next,jumper"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :total="total"
                            :page-size=pageSize
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane key="admin1" name="1">
                <span slot="label"><i class="iconfont icontongguo"></i> 已批准</span>
                <div class="mConditions" style="margin-left: 20px;margin-bottom: 10px">
                    <el-select  v-model="depName" clearable placeholder="部门" @change="change">
                        <el-option
                                v-for="item in depNames"
                                :key="item.depName"
                                :label="item.depName"
                                :value="item.depName">
                        </el-option>
                    </el-select>
                </div>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase())
                 || data.depName.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="会议室类型">
                                    <span>{{ props.row.roomType }}</span>
                                </el-form-item>
                                <el-form-item label="会议摘要">
                                    <span>{{ props.row.digest }}</span>
                                </el-form-item>
                                <el-form-item label="会议人数">
                                    <span>{{ props.row.personCount }}</span>
                                </el-form-item>
                                <el-form-item label="会议时间">
                                    <span>{{ props.row.startTime}} -- {{props.row.endTime}}</span>
                                </el-form-item>
                                <el-form-item label="申请时间">
                                    <span>{{ props.row.applyTime }}</span>
                                </el-form-item>
                                <el-form-item label="审核时间">
                                    <span>{{ props.row.auditTime }}</span>
                                </el-form-item>

                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="会议主题"
                            prop="theme"
                    width="180">
                    </el-table-column>
                    <el-table-column
                            label="会议室门牌号"
                            prop="roomNo"
                    align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室楼层"
                            prop="roomFloor"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="申请部门"
                            prop="depName"
                            align="center">
                    </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、门牌号、楼层、部门"/>
                        </template>
                        <template slot-scope="scope">
                            <el-popconfirm
                                    title="确定删除该申请记录吗？"
                                    @onConfirm="handleDelete(scope.row)"
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
                    </el-table-column>
                </el-table>
                <div style="text-align: center;position:relative;margin-top: 20px">
                    <el-pagination
                            layout="total,prev, pager, next,jumper"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :total="total"
                            :page-size=pageSize
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane key="admin2" name="2">
                <span slot="label"><i class="iconfont icontongguo"></i> 已驳回</span>
                <div class="mConditions" style="margin-left: 20px;margin-bottom: 10px">
                    <el-select  v-model="depName" clearable placeholder="部门" @change="change">
                        <el-option
                                v-for="item in depNames"
                                :key="item.depName"
                                :label="item.depName"
                                :value="item.depName">
                        </el-option>
                    </el-select>
                </div>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase())
                 || data.depName.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">

                                <el-form-item label="驳回理由">
                                    <span>{{ props.row.rejectReason }}</span>
                                </el-form-item>
                                <el-form-item label="审核时间">
                                    <span>{{ props.row.auditTime }}</span>
                                </el-form-item>
                                <el-form-item label="会议室类型">
                                    <span>{{ props.row.roomType }}</span>
                                </el-form-item>
                                <el-form-item label="会议摘要">
                                    <span>{{ props.row.digest }}</span>
                                </el-form-item>
                                <el-form-item label="会议人数">
                                    <span>{{ props.row.personCount }}</span>
                                </el-form-item>
                                <el-form-item label="会议时间">
                                    <span>{{ props.row.startTime}} -- {{props.row.endTime}}</span>
                                </el-form-item>
                                <el-form-item label="申请时间">
                                    <span>{{ props.row.applyTime }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="会议主题"
                            prop="theme"
                    width="180">
                    </el-table-column>
                    <el-table-column
                            label="会议室门牌号"
                            prop="roomNo"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="会议室楼层"
                            prop="roomFloor"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="申请部门"
                            prop="depName"
                            align="center">
                    </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、门牌号、楼层、部门"/>
                        </template>
                        <template slot-scope="scope">
                            <el-popconfirm
                                    title="确定删除该申请记录吗？"
                                    @onConfirm="handleDelete(scope.row)"
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
                    </el-table-column>
                </el-table>
                <div style="text-align: center;position:relative;margin-top: 20px">
                    <el-pagination
                            layout="total,prev, pager, next,jumper"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :total="total"
                            :page-size=pageSize
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "conferenceRecordByAdmin",
        data(){
            return {
                auditState: '0',
                depName: '',
                search: '',
                currentPage: 1,
                total: 1,
                pageSize: 7,

                formData: [
                    {
                        "applyId": 5,
                        "auditStatus": null,
                        "applyTime": "2020-06-24 10:52:11",
                        "auditTime": null,
                        "rejectReason": null,
                        "startTime": "2020-06-24 02:54:59",
                        "endTime": "2020-06-24 03:55:02",
                        "theme": "asdas",
                        "personCount": 12,
                        "digest": "asdasd",
                        "depNo": "007",
                        "depName": "公关部",
                        "depEmail":"6191220122@qq.com",
                        "roomId": null,
                        "roomNo": "302",
                        "roomFloor": "14",
                        "roomType": "小多媒体会议室",
                    },

                ],

                depNames: [
                    {"depName": "研发部"}
                ]
            }
        },

        methods:{
            handleDelete(row){
                let _this = this;
                _this.axios.delete("/record/deleteby/"+row.applyId,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.getRecords(this.depName, this.auditState, this.currentPage);
                    _this.getTotal();
                    _this.$message({
                        message: '删除记录成功',
                        type: 'success',
                        center: true
                    });
                })
            },

            reject(row){
                this.$prompt('请输入驳回理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                        let map = {
                            "applyId":row.applyId,
                            "roomId":row.roomId,
                            "startTime":row.startTime,
                            "endTime":row.endTime,
                            "auditState":2,
                            "rejectReason":value,
                            "roomFloor":row.roomFloor,
                            "roomNo":row.roomNo,
                            "theme":row.theme,
                            "depEmail":row.depEmail,
                            "applyTime":row.applyTime,
                            "result":'申请被驳回'
                        };

                        let _this = this;
                        _this.axios.put("/record/changeauditstate",map,{
                            headers:{
                                "Authorization":localStorage.getItem("token")
                            }
                        }).then(res=>{

                            _this.getRecords(this.depName, this.auditState, this.currentPage);
                            _this.$message({
                                message: '驳回申请成功',
                                type: 'success',
                                center: true
                            });
                        })
                })
            },

           access(row) {
                let map = {
                    "applyId":row.applyId,
                    "roomId":row.roomId,
                    "startTime":row.startTime,
                    "endTime":row.endTime,
                    "auditState":1,
                    "roomFloor":row.roomFloor,
                    "roomNo":row.roomNo,
                    "theme":row.theme,
                    "depEmail":row.depEmail,
                    "applyTime":row.applyTime,
                    "result":'申请通过'


                };

                let _this = this;
                _this.axios.put("/record/changeauditstate",map,{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.$message({
                        message: '通过申请成功',
                        type: 'success',
                        center: true
                    });

                    _this.getRecords(this.depName, this.auditState, this.currentPage);
                })
            },
            change(){
                this.currentPage=1;
                this.getRecords(this.depName, this.auditState, 1);
            },

            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                } else if (rowIndex === 5) {
                    return 'warning-row';
                }
                return '';
            },

            handleCurrentChange(currentPage) {
                this.getRecords(this.depName, this.auditState, currentPage);
            },

            getRecords(depName, auditState, currentPage) {

                //JSON格式转一下 防止为空的时候不能传递参数
                let name = JSON.stringify(depName);

                //查看所有记录
                let deleted = null;
                deleted = JSON.stringify(deleted);
                let _this = this;
                _this.axios.get("/record/listbyconditions/" + auditState + "/" + name + "/" + currentPage+"/"+deleted, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.formData = res.data.data;
                    console.log(_this.formData);
                    if(_this.formData.length===0){


                        let newCurrentPage;
                        //不等于1的情况下 才要-1
                        if(currentPage!==1) {
                            newCurrentPage = currentPage - 1;
                        }else{
                            newCurrentPage = currentPage;
                        }
                        //在审核当前页面最后一个申请时，审核完 刷新数据 但是还是提交的当前页面的页码 查出来肯定是没有数据的。所以页码要减一来查
                        //url不能进行计算
                        _this.axios.get("/record/listbyconditions/" + auditState + "/" + name + "/" +newCurrentPage+"/"+deleted, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res => {
                            _this.formData = res.data.data;
                            _this.currentPage  = newCurrentPage;

                        })
                    }else {

                        //不是这种情况的话就还是等于当前页面
                        _this.currentPage = currentPage;
                    }
                });

            },

            getTotal(){
                let name = JSON.stringify(this.depName);
                let deleted = null; //只查出没有被部门进行删除的
                deleted = JSON.stringify(deleted);
                let _this = this;
                _this.axios.get("/record/gettotalbyconditions/" + _this.auditState + "/" + name+"/"+deleted, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.total = res.data.data;
                });
            },

            handleClick() {
                //换状态时  depName重新为空
                this.getRecords(this.depName, this.auditState, 1)
                this.getTotal();
                this.currentPage = 1;
            },

            getAllDeps(){
                let _this = this;
                _this.axios.get("/department/getalldeps",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                }).then(res=>{
                    _this.depNames = res.data.data;
                })

            }

        },



        created() {
            this.getAllDeps();
            this.getRecords(this.depName, this.auditState, 1);
            this.getTotal();

        }
    }
</script>

<style scoped>

</style>