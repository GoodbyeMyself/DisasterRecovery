<template>
    <div class="home">
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
            :modal="false"
            :modal-append-to-body="false"
        >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <img alt="Vue logo" src="../assets/logo.png">
        <br>
        <el-button type="primary" @click="testInfo()">
            testInfo
        </el-button>
    </div>
</template>

<script>
// vuex
import * as storeStatic from 'store@/storeStatic.js';
import { mapActions } from 'vuex';
export default {
    name: 'HomeView',
    data() {
        return {
            dialogVisible: false
        };
    },
    computed: {
        /**
         * @description: 是否来自 QIANKUN
         * @author: M.yunlong
         * @date: 2023-04-25 16:19:25
        */
        POWERED_BY_QIANKUN() {
            return window.__POWERED_BY_QIANKUN__;
        }
    },
    created() {
    },
    methods: {
        ...mapActions([
            // 公共请求
            storeStatic.A_ACTION_COMMON
        ]),
        /**
         * @description: 弹出层
         * @author: M.yunlong
         * @date: 2023-04-26 10:42:53
        */
        handleClose(done) {
            this.$confirm('确认关闭？').then(_ => {
                done();
            }).catch(_ => {});
        },
        /**
         * @description: 401
         * @author: M.yunlong
         * @date: 2023-04-18 14:07:32
        */
        testInfo() {
            this[storeStatic.A_ACTION_COMMON]({
                url: 'testInfo',
                mock: true
            }).then(res => {
                console.log(res, '<- 打印 axios res');
            });
        }
    }
}
</script>
