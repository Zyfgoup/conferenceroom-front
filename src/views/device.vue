<template>
    <div>
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
    </div>
</template>

<script>
    export default {
        name: "device",
        data(){
            return{

            }
        },
        methods:{

        },
        created() {

        }

    }
</script>

<style scoped>

</style>