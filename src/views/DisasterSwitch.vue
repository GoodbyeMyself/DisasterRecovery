<template>
    <div class="disaster-switch">
        <el-card class="switch-card">
            <div slot="header">
                <span>灾备切换模块</span>
            </div>

            <!-- 切换按钮 -->
            <div class="switch-control">
                <el-button
                    type="danger"
                    size="large"
                    :loading="switchLoading"
                    :disabled="isSwitching"
                    @click="startDisasterSwitch"
                >
                    <i class="el-icon-refresh"></i>
                    灾备切换
                </el-button>
            </div>

            <!-- 切换步骤显示 -->
            <div class="switch-steps" v-if="isSwitching || switchCompleted">
                <el-steps :active="currentStep" finish-status="success" align-center>
                    <el-step title="停止主中心服务" description="停止govern、etl、seata-server服务"></el-step>
                    <el-step title="检查数据状态" description="检查数据备份和恢复状态"></el-step>
                    <el-step title="启动备中心服务" description="启动备中心所有服务"></el-step>
                    <el-step title="交换配置信息" description="自动交换主备中心配置"></el-step>
                </el-steps>
            </div>

            <!-- 步骤详情 -->
            <div class="step-details" v-if="isSwitching || switchCompleted">
                <el-card class="detail-card">
                    <div slot="header">
                        <span>执行详情</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="clearLogs"
                        >
                            清空日志
                        </el-button>
                    </div>
                    <div class="log-container">
                        <div
                            v-for="(log, index) in executionLogs"
                            :key="index"
                            class="log-item"
                            :class="log.type"
                        >
                            <span class="log-time">{{ log.time }}</span>
                            <span class="log-message">{{ log.message }}</span>
                        </div>
                    </div>
                </el-card>
            </div>

            <!-- 状态信息 -->
            <div class="status-info" v-if="isSwitching || switchCompleted">
                <el-alert
                    v-if="isSwitching"
                    title="灾备切换正在进行中，请勿关闭页面"
                    type="warning"
                    :closable="false"
                    show-icon
                >
                </el-alert>
                <el-alert
                    v-if="switchCompleted && switchSuccess"
                    title="灾备切换成功完成"
                    type="success"
                    :closable="false"
                    show-icon
                >
                </el-alert>
                <el-alert
                    v-if="switchCompleted && !switchSuccess"
                    title="灾备切换失败"
                    type="error"
                    :closable="false"
                    show-icon
                >
                </el-alert>
            </div>
        </el-card>
    </div>
</template>

<script>
import { disasterSwitchApi } from "@/api/disasterSwitch";

export default {
    name: "DisasterSwitch",
    data() {
        return {
            switchLoading: false,
            isSwitching: false,
            switchCompleted: false,
            switchSuccess: false,
            currentStep: 0,
            executionLogs: [],
            stepStatus: {
                step1: 'waiting',
                step2: 'waiting',
                step3: 'waiting',
                step4: 'waiting'
            }
        };
    },
    methods: {
        // 开始灾备切换
        async startDisasterSwitch() {
            try {
                await this.$confirm(
                    "确认要执行灾备切换吗？此操作将停止主中心服务并启动备中心服务。",
                    "警告",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                );

                this.switchLoading = true;
                this.isSwitching = true;
                this.switchCompleted = false;
                this.currentStep = 0;
                this.executionLogs = [];
                this.resetStepStatus();

                this.addLog('info', '开始执行灾备切换流程...');

                // 执行步骤1：停止主中心服务
                await this.executeStep1();

                // 执行步骤2：检查数据状态
                await this.executeStep2();

                // 执行步骤3：启动备中心服务
                await this.executeStep3();

                // 执行步骤4：交换配置信息
                await this.executeStep4();

                this.switchSuccess = true;
                this.switchCompleted = true;
                this.addLog('success', '灾备切换流程执行完成！');

            } catch (error) {
                if (error !== "cancel") {
                    this.switchSuccess = false;
                    this.switchCompleted = true;
                    this.addLog('error', `灾备切换失败: ${error.message}`);
                    this.$message.error("灾备切换失败: " + error.message);
                }
            } finally {
                this.switchLoading = false;
                this.isSwitching = false;
            }
        },

        // 执行步骤1：停止主中心服务
        async executeStep1() {
            try {
                this.currentStep = 1;
                this.stepStatus.step1 = 'running';
                this.addLog('info', '步骤1: 开始停止主中心服务...');

                // 停止govern服务
                this.addLog('info', '正在停止govern服务...');
                await disasterSwitchApi.stopPrimaryService('govern');
                this.addLog('success', 'govern服务已停止');

                // 停止etl服务
                this.addLog('info', '正在停止etl服务...');
                await disasterSwitchApi.stopPrimaryService('etl');
                this.addLog('success', 'etl服务已停止');

                // 停止seata-server服务
                this.addLog('info', '正在停止seata-server服务...');
                await disasterSwitchApi.stopPrimaryService('seata-server');
                this.addLog('success', 'seata-server服务已停止');

                this.stepStatus.step1 = 'success';
                this.addLog('success', '步骤1完成: 主中心服务已全部停止');

            } catch (error) {
                this.stepStatus.step1 = 'error';
                this.addLog('error', `步骤1失败: ${error.message}`);
                throw error;
            }
        },

        // 执行步骤2：检查数据状态
        async executeStep2() {
            try {
                this.currentStep = 2;
                this.stepStatus.step2 = 'running';
                this.addLog('info', '步骤2: 开始检查数据备份和恢复状态...');

                // 检查数据备份状态
                this.addLog('info', '正在检查数据备份状态...');
                const backupStatus = await disasterSwitchApi.checkBackupStatus();
                this.addLog('info', `数据备份状态: ${backupStatus.status}`);

                // 检查数据恢复状态
                this.addLog('info', '正在检查数据恢复状态...');
                const restoreStatus = await disasterSwitchApi.checkRestoreStatus();
                this.addLog('info', `数据恢复状态: ${restoreStatus.status}`);

                // 根据状态决定下一步操作
                if (backupStatus.status === 'running') {
                    this.addLog('info', '数据备份正在运行，等待完成...');
                    await this.waitForBackupComplete();
                    this.addLog('success', '数据备份已完成');
                    
                    this.addLog('info', '开始执行数据恢复...');
                    await disasterSwitchApi.startRestore();
                    this.addLog('success', '数据恢复已启动');
                    
                    this.addLog('info', '等待数据恢复完成...');
                    await this.waitForRestoreComplete();
                    this.addLog('success', '数据恢复已完成');
                } else if (restoreStatus.status === 'running') {
                    this.addLog('info', '数据恢复正在运行，等待完成...');
                    await this.waitForRestoreComplete();
                    this.addLog('success', '数据恢复已完成');
                } else {
                    this.addLog('info', '数据备份和恢复都未在运行中');
                }

                // 停止相关脚本
                this.addLog('info', '正在停止数据备份脚本...');
                await disasterSwitchApi.stopBackupScript();
                this.addLog('success', '数据备份脚本已停止');

                this.addLog('info', '正在停止数据恢复脚本...');
                await disasterSwitchApi.stopRestoreScript();
                this.addLog('success', '数据恢复脚本已停止');

                this.stepStatus.step2 = 'success';
                this.addLog('success', '步骤2完成: 数据状态检查和处理完成');

            } catch (error) {
                this.stepStatus.step2 = 'error';
                this.addLog('error', `步骤2失败: ${error.message}`);
                throw error;
            }
        },

        // 执行步骤3：启动备中心服务
        async executeStep3() {
            try {
                this.currentStep = 3;
                this.stepStatus.step3 = 'running';
                this.addLog('info', '步骤3: 开始启动备中心服务...');

                this.addLog('info', '正在启动备中心所有服务...');
                await disasterSwitchApi.startBackupServices();
                this.addLog('success', '备中心服务启动成功');

                this.stepStatus.step3 = 'success';
                this.addLog('success', '步骤3完成: 备中心服务已启动');

            } catch (error) {
                this.stepStatus.step3 = 'error';
                this.addLog('error', `步骤3失败: ${error.message}`);
                throw error;
            }
        },

        // 执行步骤4：交换配置信息
        async executeStep4() {
            try {
                this.currentStep = 4;
                this.stepStatus.step4 = 'running';
                this.addLog('info', '步骤4: 开始交换主备中心配置信息...');

                this.addLog('info', '正在交换后台配置文件中的主备中心连接信息...');
                await disasterSwitchApi.swapCenterConfig();
                this.addLog('success', '主备中心配置信息交换完成');

                this.stepStatus.step4 = 'success';
                this.addLog('success', '步骤4完成: 配置信息交换完成');

            } catch (error) {
                this.stepStatus.step4 = 'error';
                this.addLog('error', `步骤4失败: ${error.message}`);
                throw error;
            }
        },

        // 等待数据备份完成
        async waitForBackupComplete() {
            let attempts = 0;
            const maxAttempts = 60; // 最多等待5分钟

            while (attempts < maxAttempts) {
                const status = await disasterSwitchApi.checkBackupStatus();
                if (status.status === 'completed') {
                    return;
                }
                await this.sleep(5000); // 等待5秒
                attempts++;
            }
            throw new Error('数据备份超时');
        },

        // 等待数据恢复完成
        async waitForRestoreComplete() {
            let attempts = 0;
            const maxAttempts = 60; // 最多等待5分钟

            while (attempts < maxAttempts) {
                const status = await disasterSwitchApi.checkRestoreStatus();
                if (status.status === 'completed') {
                    return;
                }
                await this.sleep(5000); // 等待5秒
                attempts++;
            }
            throw new Error('数据恢复超时');
        },

        // 添加日志
        addLog(type, message) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString();
            this.executionLogs.push({
                type: type,
                time: timeStr,
                message: message
            });
        },

        // 重置步骤状态
        resetStepStatus() {
            this.stepStatus = {
                step1: 'waiting',
                step2: 'waiting',
                step3: 'waiting',
                step4: 'waiting'
            };
        },

        // 清空日志
        clearLogs() {
            this.executionLogs = [];
        },

        // 睡眠函数
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
};
</script>

<style lang="scss" scoped>
.disaster-switch {
    padding: 20px;

    .switch-card {
        margin-bottom: 20px;
    }

    .switch-control {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;

        .el-button {
            font-size: 16px;
            padding: 12px 30px;
        }
    }

    .switch-steps {
        margin-bottom: 30px;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }

    .step-details {
        margin-bottom: 20px;

        .detail-card {
            .log-container {
                max-height: 400px;
                overflow-y: auto;
                background-color: #f5f5f5;
                border-radius: 4px;
                padding: 15px;

                .log-item {
                    margin-bottom: 8px;
                    padding: 5px 0;
                    border-bottom: 1px solid #e0e0e0;

                    &:last-child {
                        border-bottom: none;
                    }

                    .log-time {
                        color: #666;
                        font-size: 12px;
                        margin-right: 10px;
                        font-family: monospace;
                    }

                    .log-message {
                        color: #333;
                    }

                    &.info {
                        .log-message {
                            color: #409eff;
                        }
                    }

                    &.success {
                        .log-message {
                            color: #67c23a;
                        }
                    }

                    &.error {
                        .log-message {
                            color: #f56c6c;
                        }
                    }

                    &.warning {
                        .log-message {
                            color: #e6a23c;
                        }
                    }
                }
            }
        }
    }

    .status-info {
        .el-alert {
            margin-bottom: 10px;
        }
    }
}
</style> 