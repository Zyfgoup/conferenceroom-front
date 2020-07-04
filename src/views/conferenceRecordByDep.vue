<template>
    <div>
        <el-tabs v-model="auditState" @tab-click="handleClick">


            <el-tab-pane key="user1" name="1">
                <span slot="label"><i class="iconfont icontongguo"></i> 已批准</span>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase()))"
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
                            prop="theme">
                    </el-table-column>
                    <el-table-column
                            label="会议室门牌号"
                            prop="roomNo">
                    </el-table-column>
                    <el-table-column
                            label="会议室楼层"
                            prop="roomFloor">
                    </el-table-column>
                    <el-table-column
                            label="会议人数"
                            prop="personCount">
                    </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、门牌号、楼层"/>
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


            <el-tab-pane  key="user0" name="0">
                <span slot="label"><i class="iconfont icontongguo"></i> 未审核</span>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase()))"
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
                            prop="theme">
                    </el-table-column>
                    <el-table-column
                            label="会议室门牌号"
                            prop="roomNo">
                    </el-table-column>
                    <el-table-column
                            label="会议室楼层"
                            prop="roomFloor">
                    </el-table-column>
                    <el-table-column
                            label="会议人数"
                            prop="personCount">
                    </el-table-column>
                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、门牌号、楼层"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                    size="small"
                                    @click="handleEdit(scope.$index, scope.row)"
                                    round
                                    type="danger"
                                    style="margin-right: 10px">撤 回</el-button>
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



            <el-tab-pane key="user2"  name="2">
                <span slot="label"><i class="iconfont icontongguo"></i> 已驳回</span>
                <el-table
                        :data="formData.filter(data => !search || data.theme.toLowerCase().includes(search.toLowerCase())||
                data.roomNo.toLowerCase().includes(search.toLowerCase()) ||  data.roomFloor.toLowerCase().includes(search.toLowerCase()))"
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
                                <el-form-item label="会议时间">
                                    <span>{{ props.row.startTime}} -- {{props.row.endTime}}</span>
                                </el-form-item>
                                <el-form-item label="申请时间">
                                    <span>{{ props.row.applyTime }}</span>
                                </el-form-item>
                                <el-form-item label="审核时间">
                                    <span>{{ props.row.auditTime }}</span>
                                </el-form-item>
                                <el-form-item label="驳回理由">
                                    <span>{{ props.row.rejectReason }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="会议主题"
                            prop="theme">
                    </el-table-column>
                    <el-table-column
                            label="会议室门牌号"
                            prop="roomNo">
                    </el-table-column>
                    <el-table-column
                            label="会议室楼层"
                            prop="roomFloor">
                    </el-table-column>
                    <el-table-column
                            label="会议人数"
                            prop="personCount">
                    </el-table-column>


                    <el-table-column align="right" >
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mid"
                                    placeholder="输入主题、门牌号、楼层"/>
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
    import Cookies from 'js-cookie';
    export default {
        name: "ConferenceRecordByDep",
        data(){
            return{
                auditState: '1',
                formData:[
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
                    "roomId": null,
                    "roomNo": "302",
                    "roomFloor": "14",
                    "roomType": "小多媒体会议室"
                 },

                ],
                depName:'',
                search:'',
                currentPage:1,
                total:1,
                pageSize:7,
            }
        },
        methods: {

            handleDelete(row){
               let _this = this;
               _this.axios.delete("/record/delete/"+row.applyId,{
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

            handleEdit(index, row) {
                let _this = this;
                this.axios.put("/record/recallapply", {"applyId": row.applyId}, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {

                    //加分页了 这里这个1要更改
                    _this.getRecords(this.depName, this.auditState, this.currentPage);

                    _this.$message({
                        message: '撤销申请成功',
                        type: 'success',
                        center: true
                    });
                })
            },

            getTotal(){
                let name = JSON.stringify(this.depName);
                let _this = this;
                let deleted = 0; //只查出没有被部门进行删除的
                deleted = JSON.stringify(deleted);
                this.axios.get("/record/gettotalbyconditions/" + _this.auditState + "/" + name+"/"+deleted, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.total = res.data.data;
                });
            },

            getRecords(depName, auditState, currentPage) {
                //因为管理员那个模块中 是可以选择部门来查看记录  但是当部门为空时就是查询所有 但是为空传递不了参数 所以要用
                let name = JSON.stringify(depName);
                let deleted = 0; //只查出没有被部门进行删除的
                deleted = JSON.stringify(deleted);
                let _this = this;
                this.axios.get("/record/listbyconditions/" + auditState + "/" + name + "/" + currentPage+"/"+deleted, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.formData = res.data.data;
                    _this.currentPage  = currentPage;
                });

            },

            handleClick() {
                this.getRecords(this.depName, this.auditState, 1)
                this.getTotal();
                this.currentPage = 1;
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
        },

            created() {
                //获取到depName
                let depId = JSON.parse(Cookies.get("userInfo")).id;
                let _this = this;
                this.axios.get("/department/getby/" + depId, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.depName = res.data.data.depName;
                    //先显示审核通过的
                    _this.getRecords(_this.depName, _this.auditState, 1);
                    _this.getTotal();
                })
            }
    }
</script>

<style>
    .demo-table-expand {
        font-size: 0;

    }
    .demo-table-expand label{
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .center{
        text-align: center;
    }

</style>