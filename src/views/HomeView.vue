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
                    <p>IP: {{ master.hostname }}</p>
                    <p>端口: {{ master.port }}</p>
                    <p>用户: {{ master.username }}</p>
                </div>
                <div class="flow-arrow">
                    <i class="el-icon-refresh" @click="switchCenter"></i>
                </div>
                <div class="center-info backup-center">
                    <h3>备中心</h3>
                    <p>IP: {{ slave.hostname }}</p>
                    <p>端口: {{ slave.port }}</p>
                    <p>用户: {{ slave.username }}</p>
                </div>
            </div>
            <div class="switch-control">
                <el-button type="warning" @click="switchCenter">
                    主备切换
                </el-button>
            </div>
        </el-card>
        <!-- 数据同步 -->
        <el-card class="control-card">
            <div slot="header" class="sync-header">
                <span>数据同步</span>
                <div class="header-status">
                    <el-tag 
                        :type="getStatusType(systemStatus)"
                        :class="['status-tag', getStatusClass(systemStatus)]"
                        size="medium"
                    >
                        <i :class="getStatusIcon(systemStatus)"></i>
                        {{ getStatusText(systemStatus) }}
                    </el-tag>
                </div>
            </div>
            <div class="control-buttons">
                <el-button
                    type="primary"
                    :loading="syncLoading"
                    :disabled="['running'].includes(systemStatus)"
                    @click="startSync"
                >
                    开始同步
                </el-button>
                <el-button
                    type="info"
                    :loading="stopLoading"
                    :disabled="['stopping', 'stopped'].includes(systemStatus)"
                    @click="stopSync"
                >
                    停止同步
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
                    prop="interval"
                >
                    <el-input-number
                        v-model="configForm.interval"
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
    </div>
</template>

<script>
// vuex
import * as storeStatic from 'store@/storeStatic.js';
import { mapActions } from 'vuex';
export default {
    name: "DisasterRecovery",
    data() {
        return {
            // 数据流向
            master: {
                hostname: '',
                port: '',
                username: ''
            },
            // 备应用
            slave: {
                hostname: '',
                port: '',
                username: ''
            },
            // 周期配置
            configForm: {
                interval: 0,
            },
            rules: {
                interval: [
                    {
                        required: true,
                        message: "请输入间隔时间",
                        trigger: "blur",
                    },
                ],
            },
            // 同步状态
            syncLoading: false,
            // 停止状态
            stopLoading: false,
            // 系统状态:  stopping 停止中, running 运行中, stopped 已停止
            systemStatus: ''
        };
    },
    mounted() {
        // 获取 数据流向
        this.GetMonitor();
        // 获取 状态查询
        this.GetQueryStatus();
    },
    methods: {
        ...mapActions([
            // 公共请求
            storeStatic.A_ACTION_COMMON
        ]),
        /**
         * @description: 获取 数据流向
         * @author: M.yunlong
         * @date: 2025-06-30 15:49:39
        */
        GetMonitor() {
            this[storeStatic.A_ACTION_COMMON]({
                url: 'getMonitor'
            }).then(res => {
                if (res.data) {
                    // 主应用
                    this.master = res.data.master;
                    // 备应用
                    this.slave = res.data.slave;
                    // 周期配置
                    this.configForm.interval = res.data.master.backupInterval || 30;
                }
            });
        },
        // 切换主备中心 - 改为静态处理
        async switchCenter() {
            try {
                await this.$confirm(
                    "确认要切换主备中心吗 ？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                );

                this[storeStatic.A_ACTION_COMMON]({
                    url: 'changeMaster',
                    method: 'post'
                }).then(res => {
                    // messages
                    this.$message.success("主备中心切换成功");
                    // 获取 数据流向
                    this.GetMonitor();
                });
            } catch (error) {
                if (error !== "cancel") {
                    this.$message.error("切换失败: " + error.message);
                }
            }
        },
        /**
         * @description: 周期配置
         * @author: M.yunlong
         * @date: 2025-06-30 16:42:43
        */
        async saveConfig() {
            try {
                // --
                await this.$refs.configForm.validate();
                // --
                this[storeStatic.A_ACTION_COMMON]({
                    url: 'setCycleConfig?interval=' + this.configForm.interval,
                    method: 'post'
                }).then(res => {
                    // 模拟保存成功
                    this.$message.success("配置保存成功");
                });
            } catch (error) {
                this.$message.error("配置保存失败: " + error.message);
            }
        },
        /**
         * @description: 状态查询
         * @author: M.yunlong
         * @date: 2025-06-30 16:41:56
        */
        GetQueryStatus() {
            this[storeStatic.A_ACTION_COMMON]({
                url: 'queryStatus',
            }).then(res => {
                // --
                this.systemStatus = res.data || 'stopped';
            });
        },
        // 开始同步 - 改为静态处理
        async startSync() {
            try {
                this.syncLoading = true;
                this.systemStatus = 'running';
                // 异步操作
                this[storeStatic.A_ACTION_COMMON]({
                    url: 'startSync',
                    method: 'post'
                }).then(res => {
                    this.$message.success("同步已开始");
                });
            } catch (error) {
                // --
                this.systemStatus = 'stopped';
                // --
                this.$message.error("启动同步失败: " + error.message);
            } finally {
                this.syncLoading = false;
            }
        },
        // 停止同步 - 改为静态处理
        async stopSync() {
            try {
                this.stopLoading = true;
                this.systemStatus = 'stopping';
                // 异步操作
                this[storeStatic.A_ACTION_COMMON]({
                    url: 'stopSync',
                    method: 'post'
                }).then(res => {
                    // --
                    this.systemStatus = 'stopped';
                    // --
                    this.$message.success("同步已停止");
                });
            } catch (error) {
                this.$message.error("停止同步失败: " + error.message);
            } finally {
                this.stopLoading = false;
            }
        },
        // 获取状态类型
        getStatusType(status) {
            switch (status) {
                case 'running':
                    return 'success';
                case 'stopping':
                    return 'warning';
                case 'stopped':
                    return 'info';
                default:
                    return 'info';
            }
        },
        // 获取状态样式类
        getStatusClass(status) {
            switch (status) {
                case 'running':
                    return 'status-running';
                case 'stopping':
                    return 'status-stopping';
                case 'stopped':
                    return 'status-stopped';
                default:
                    return 'status-stopped';
            }
        },
        // 获取状态图标
        getStatusIcon(status) {
            switch (status) {
                case 'running':
                    return 'el-icon-success';
                case 'stopping':
                    return 'el-icon-warning';
                case 'stopped':
                    return 'el-icon-info';
                default:
                    return 'el-icon-info';
            }
        },
        // 获取状态文本
        getStatusText(status) {
            switch (status) {
                case 'running':
                    return '运行中';
                case 'stopping':
                    return '停止中';
                case 'stopped':
                    return '已停止';
                default:
                    return '已停止';
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.disaster-recovery {
    padding: 30px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    min-height: 50vh;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    ::v-deep .el-card {
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.95);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        &:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .el-card__header {
            background: linear-gradient(90deg, #ffffff 0%, #f8f9fa 100%);
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            padding: 12px 24px;
            
            span {
                font-size: 18px;
                font-weight: 600;
                color: #1a1a1a;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }

            .sync-header {
                span {
                    font-weight: inherit;
                    color: inherit;
                    letter-spacing: inherit;
                    text-transform: inherit;
                }
            }
        }

        .el-card__body {
            padding: 32px 24px;
        }
    }

    .config-card,
    .flow-card,
    .control-card {
        margin-bottom: 24px;
    }

    .data-flow {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, transparent, #000000, transparent);
            border-radius: 2px;
        }

        .center-info {
            padding: 32px 28px;
            border-radius: 16px;
            text-align: center;
            min-width: 240px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
                z-index: 1;
            }

            > * {
                position: relative;
                z-index: 2;
            }

            &.primary-center {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
                border: 2px solid #000000;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

                &::after {
                    content: 'PRIMARY';
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: #000000;
                    color: white;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 4px 8px;
                    border-radius: 4px;
                    letter-spacing: 1px;
                    z-index: 3;
                }
            }

            &.backup-center {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
                border: 2px solid #666666;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

                &::after {
                    content: 'BACKUP';
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: #666666;
                    color: white;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 4px 8px;
                    border-radius: 4px;
                    letter-spacing: 1px;
                    z-index: 3;
                }
            }

            h3 {
                margin: 0 0 20px 0;
                color: #1a1a1a;
                font-size: 20px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            p {
                margin: 8px 0;
                color: #4a4a4a;
                font-size: 14px;
                font-weight: 500;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
                background: rgba(0, 0, 0, 0.04);
                padding: 6px 12px;
                border-radius: 6px;
                border-left: 3px solid #000000;
            }

            &:hover {
                transform: translateY(-4px);
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
            }
        }

        .flow-arrow {
            margin: 0 40px;
            font-size: 32px;
            color: #000000;
            position: relative;
            animation: pulse 2s infinite;
            cursor: pointer;

            &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 50%;
                z-index: -1;
            }
        }
    }

    .switch-control {
        text-align: center;
        padding: 24px 0 8px 0;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        position: relative;

        &::before {
            content: 'SWITCH CONTROL';
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            color: #666666;
            font-size: 11px;
            font-weight: 600;
            padding: 0 16px;
            letter-spacing: 1px;
        }
    }

    .control-buttons {
        margin-bottom: 32px;
        display: flex;
        gap: 16px;
        justify-content: center;
    }

    .sync-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .header-status {
            .status-tag {
                font-weight: 600;
                font-size: 12px;
                padding: 0px 12px !important;
                border-radius: 8px;
                transition: all 0.3s ease;

                i {
                    margin-right: 6px;
                    font-size: 16px;
                }

                &.status-running {
                    background: linear-gradient(135deg, #4CAF50, #66BB6A) !important;
                    border-color: #4CAF50 !important;
                    color: white !important;
                    animation: pulse-success 2s infinite;
                }

                &.status-stopping {
                    background: linear-gradient(135deg, #FF9800, #FFB74D) !important;
                    border-color: #FF9800 !important;
                    color: white !important;
                    animation: pulse-warning 1s infinite;
                }

                &.status-stopped {
                    background: linear-gradient(135deg, #607D8B, #78909C) !important;
                    border-color: #607D8B !important;
                    color: white !important;
                }
            }
        }
    }

    @keyframes pulse-success {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
        }
        50% {
            box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
        }
    }

    @keyframes pulse-warning {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
        }
        50% {
            box-shadow: 0 0 0 6px rgba(255, 152, 0, 0);
        }
    }

    ::v-deep .el-form {
        .el-form-item__label {
            color: #1a1a1a;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.5px;
        }

        .el-input-number {
            .el-input__inner {
                border: 2px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 12px 16px;
                font-weight: 500;
                transition: all 0.3s ease;

                &:focus {
                    border-color: #000000;
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

// 全局按钮样式覆盖
::v-deep .el-button {
    font-family: inherit;
}
</style>
