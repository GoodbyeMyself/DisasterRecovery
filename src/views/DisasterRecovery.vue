<template>
    <div class="disaster-recovery">
        <!-- 日志查看 -->
        <el-card class="log-card">
            <div slot="header">
                <span>运行日志</span>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="refreshLogs"
                >
                    刷新日志
                </el-button>
            </div>
            <el-tabs v-model="activeLogTab">
                <el-tab-pane label="数据备份日志" name="backup">
                    <div class="log-content">
                        <pre>{{ backupLogs }}</pre>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="数据恢复日志" name="restore">
                    <div class="log-content">
                        <pre>{{ restoreLogs }}</pre>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import { disasterRecoveryApi } from "@/api/disasterRecovery";

export default {
    name: "DisasterRecovery",
    data() {
        return {
            activeLogTab: "backup",
            backupLogs: "",
            restoreLogs: "",
            logTimer: null,
        };
    },
    mounted() {
        this.startLogPolling();
    },
    beforeDestroy() {
        if (this.logTimer) {
            clearInterval(this.logTimer);
        }
    },
    methods: {
        // 刷新日志
        async refreshLogs() {
            try {
                const logs = await disasterRecoveryApi.getLogs();
                this.backupLogs = logs.backup;
                this.restoreLogs = logs.restore;
            } catch (error) {
                console.error("刷新日志失败:", error);
            }
        },

        // 开始日志轮询
        startLogPolling() {
            this.logTimer = setInterval(() => {
                this.refreshLogs();
            }, 5000); // 每5秒刷新一次
        },
    },
};
</script>

<style lang="scss" scoped>
.disaster-recovery {
    padding: 20px;

    .log-card {
        margin-bottom: 20px;
    }

    .log-content {
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 15px;
        max-height: 400px;
        overflow-y: auto;

        pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: "Courier New", monospace;
            font-size: 12px;
            line-height: 1.5;
        }
    }
}
</style>
