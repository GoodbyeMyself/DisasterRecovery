<template>
    <div class="disaster-recovery">
        <el-card class="config-card">
            <div slot="header">
                <span>灾备管理系统</span>
            </div>

            <!-- 脚本调用周期配置 -->
            <el-form
                :model="configForm"
                :rules="rules"
                ref="configForm"
                label-width="120px"
            >
                <el-form-item label="运行模式" prop="runMode">
                    <el-radio-group v-model="configForm.runMode">
                        <el-radio label="once">单次定时运行</el-radio>
                        <el-radio label="interval">间隔时间周期运行</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item
                    v-if="configForm.runMode === 'once'"
                    label="定时时间"
                    prop="scheduleTime"
                >
                    <el-date-picker
                        v-model="configForm.scheduleTime"
                        type="datetime"
                        placeholder="选择定时执行时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item
                    v-if="configForm.runMode === 'interval'"
                    label="间隔时间"
                    prop="intervalTime"
                >
                    <el-input-number
                        v-model="configForm.intervalTime"
                        :min="1"
                        :max="1440"
                        placeholder="间隔分钟数"
                    >
                    </el-input-number>
                    <span style="margin-left: 10px">分钟</span>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="saveConfig"
                        >保存配置</el-button
                    >
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 数据流向显示 -->
        <el-card class="flow-card">
            <div slot="header">
                <span>数据流向</span>
            </div>
            <div class="data-flow">
                <div class="center-info primary-center">
                    <h3>主中心</h3>
                    <p>IP: {{ primaryCenter.ip }}</p>
                    <p>端口: {{ primaryCenter.port }}</p>
                    <p>用户: {{ primaryCenter.user }}</p>
                </div>
                <div class="flow-arrow">
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="center-info backup-center">
                    <h3>备中心</h3>
                    <p>IP: {{ backupCenter.ip }}</p>
                    <p>端口: {{ backupCenter.port }}</p>
                    <p>用户: {{ backupCenter.user }}</p>
                </div>
            </div>
        </el-card>

        <!-- 操作控制 -->
        <el-card class="control-card">
            <div slot="header">
                <span>操作控制</span>
            </div>
            <div class="control-buttons">
                <el-button
                    type="success"
                    :loading="syncLoading"
                    :disabled="isRunning"
                    @click="startSync"
                >
                    开始同步
                </el-button>
                <el-button
                    type="danger"
                    :loading="stopLoading"
                    :disabled="!isRunning"
                    @click="stopSync"
                >
                    停止同步
                </el-button>
                <el-button type="warning" @click="switchCenter">
                    切换主备中心
                </el-button>
            </div>

            <!-- 运行状态 -->
            <div class="status-info">
                <el-alert
                    v-if="backupStatus === 'running'"
                    title="数据备份正在运行中"
                    type="info"
                    :closable="false"
                    show-icon
                >
                </el-alert>
                <el-alert
                    v-if="restoreStatus === 'running'"
                    title="数据恢复正在运行中"
                    type="info"
                    :closable="false"
                    show-icon
                >
                </el-alert>
                <el-alert
                    v-if="
                        backupStatus === 'completed' &&
                        restoreStatus === 'completed'
                    "
                    title="同步已完成"
                    type="success"
                    :closable="false"
                    show-icon
                >
                </el-alert>
            </div>
        </el-card>

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
            configForm: {
                runMode: "once",
                scheduleTime: "",
                intervalTime: 30,
            },
            rules: {
                runMode: [
                    {
                        required: true,
                        message: "请选择运行模式",
                        trigger: "change",
                    },
                ],
                scheduleTime: [
                    {
                        required: true,
                        message: "请选择定时时间",
                        trigger: "change",
                    },
                ],
                intervalTime: [
                    {
                        required: true,
                        message: "请输入间隔时间",
                        trigger: "blur",
                    },
                ],
            },
            primaryCenter: {
                ip: "192.168.1.100",
                port: 22,
                user: "sdc",
                password: "",
            },
            backupCenter: {
                ip: "192.168.1.101",
                port: 22,
                user: "sdc",
                password: "",
            },
            syncLoading: false,
            stopLoading: false,
            isRunning: false,
            backupStatus: "idle", // idle, running, completed, error
            restoreStatus: "idle",
            activeLogTab: "backup",
            backupLogs: "",
            restoreLogs: "",
            logTimer: null,
        };
    },
    mounted() {
        this.loadConfig();
        this.loadCenterInfo();
        this.startLogPolling();
    },
    beforeDestroy() {
        if (this.logTimer) {
            clearInterval(this.logTimer);
        }
    },
    methods: {
        // 加载配置
        async loadConfig() {
            try {
                const config = await disasterRecoveryApi.getConfig();
                this.configForm = { ...this.configForm, ...config };
            } catch (error) {
                console.error("加载配置失败:", error);
            }
        },

        // 加载中心信息
        async loadCenterInfo() {
            try {
                const centerInfo = await disasterRecoveryApi.getCenterInfo();
                this.primaryCenter = centerInfo.primary;
                this.backupCenter = centerInfo.backup;
            } catch (error) {
                console.error("加载中心信息失败:", error);
            }
        },

        // 保存配置
        async saveConfig() {
            try {
                await this.$refs.configForm.validate();
                await disasterRecoveryApi.saveConfig(this.configForm);
                this.$message.success("配置保存成功");
            } catch (error) {
                this.$message.error("配置保存失败: " + error.message);
            }
        },

        // 开始同步
        async startSync() {
            try {
                this.syncLoading = true;
                await disasterRecoveryApi.startSync();
                this.isRunning = true;
                this.$message.success("同步已开始");
                this.checkStatus();
            } catch (error) {
                this.$message.error("启动同步失败: " + error.message);
            } finally {
                this.syncLoading = false;
            }
        },

        // 停止同步
        async stopSync() {
            try {
                this.stopLoading = true;
                await disasterRecoveryApi.stopSync();
                this.$message.success("同步已停止");
                this.isRunning = false;
                this.backupStatus = "idle";
                this.restoreStatus = "idle";
            } catch (error) {
                this.$message.error("停止同步失败: " + error.message);
            } finally {
                this.stopLoading = false;
            }
        },

        // 切换主备中心
        async switchCenter() {
            try {
                await this.$confirm(
                    "确认要切换主备中心吗？这将停止当前服务并重新启动。",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                );

                await disasterRecoveryApi.switchCenter();
                this.$message.success("主备中心切换成功");
                this.loadCenterInfo();
            } catch (error) {
                if (error !== "cancel") {
                    this.$message.error("切换失败: " + error.message);
                }
            }
        },

        // 检查状态
        async checkStatus() {
            try {
                const status = await disasterRecoveryApi.getStatus();
                this.backupStatus = status.backup;
                this.restoreStatus = status.restore;
                this.isRunning =
                    status.backup === "running" || status.restore === "running";
            } catch (error) {
                console.error("检查状态失败:", error);
            }
        },

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
                this.checkStatus();
            }, 5000); // 每5秒刷新一次
        },
    },
};
</script>

<style lang="scss" scoped>
.disaster-recovery {
    padding: 20px;

    .config-card,
    .flow-card,
    .control-card,
    .log-card {
        margin-bottom: 20px;
    }

    .data-flow {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;

        .center-info {
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            min-width: 200px;

            &.primary-center {
                background-color: #f0f9ff;
                border: 2px solid #409eff;
            }

            &.backup-center {
                background-color: #f0f9ff;
                border: 2px solid #67c23a;
            }

            h3 {
                margin: 0 0 10px 0;
                color: #303133;
            }

            p {
                margin: 5px 0;
                color: #606266;
            }
        }

        .flow-arrow {
            margin: 0 30px;
            font-size: 24px;
            color: #409eff;
        }
    }

    .control-buttons {
        margin-bottom: 20px;

        .el-button {
            margin-right: 15px;
        }
    }

    .status-info {
        .el-alert {
            margin-bottom: 10px;
        }
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
