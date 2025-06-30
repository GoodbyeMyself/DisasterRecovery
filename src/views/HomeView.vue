<template>
    <div class="disaster-recovery">
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
            <div class="switch-control">
                <el-button type="warning" @click="switchCenter">
                    主备切换
                </el-button>
            </div>
        </el-card>
        <el-card class="config-card">
            <div slot="header">
                <span>周期配置</span>
            </div>
            <!-- 周期配置 -->
            <el-form
                :model="configForm"
                :rules="rules"
                ref="configForm"
                label-width="120px"
            >
                <el-form-item
                    label="间隔时间"
                    prop="intervalTime"
                >
                    <el-input-number
                        v-model="configForm.intervalTime"
                        :min="1"
                        placeholder="间隔秒数"
                    >
                    </el-input-number>
                    <span style="margin-left: 10px">秒</span>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="saveConfig">
                        保存配置
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 数据同步 -->
        <el-card class="control-card">
            <div slot="header">
                <span>数据同步</span>
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
    </div>
</template>

<script>
export default {
    name: "DisasterRecovery",
    data() {
        return {
            configForm: {
                intervalTime: 30,
            },
            rules: {
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
        };
    },
    mounted() {
        // 移除API调用
    },
    methods: {
        // 保存配置 - 改为静态处理
        async saveConfig() {
            try {
                await this.$refs.configForm.validate();
                // 模拟保存成功
                this.$message.success("配置保存成功");
            } catch (error) {
                this.$message.error("配置保存失败: " + error.message);
            }
        },

        // 开始同步 - 改为静态处理
        async startSync() {
            try {
                this.syncLoading = true;
                // 模拟异步操作
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.isRunning = true;
                this.backupStatus = "running";
                this.$message.success("同步已开始");
                
                // 模拟同步完成
                setTimeout(() => {
                    this.backupStatus = "completed";
                    this.restoreStatus = "completed";
                }, 3000);
            } catch (error) {
                this.$message.error("启动同步失败: " + error.message);
            } finally {
                this.syncLoading = false;
            }
        },

        // 停止同步 - 改为静态处理
        async stopSync() {
            try {
                this.stopLoading = true;
                // 模拟异步操作
                await new Promise(resolve => setTimeout(resolve, 500));
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

        // 切换主备中心 - 改为静态处理
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

                // 模拟切换操作
                const temp = { ...this.primaryCenter };
                this.primaryCenter = { ...this.backupCenter };
                this.backupCenter = temp;
                
                this.$message.success("主备中心切换成功");
            } catch (error) {
                if (error !== "cancel") {
                    this.$message.error("切换失败: " + error.message);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.disaster-recovery {
    padding: 20px;

    .config-card,
    .flow-card,
    .control-card {
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

    .switch-control {
        text-align: center;
        padding: 15px 0 5px 0;
        border-top: 1px solid #ebeef5;
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
}
</style>
