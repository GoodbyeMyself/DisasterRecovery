<template>
    <div class="dashboard">
        <!-- 页面标题 -->
        <div class="dashboard-header">
            <h1 class="dashboard-title">
                <i class="el-icon-monitor"></i>
                系统监控面板
            </h1>
            <div class="dashboard-time">
                <i class="el-icon-time"></i>
                {{ currentTime }}
            </div>
        </div>

        <!-- 统计卡片区域 -->
        <div class="stats-grid">
            <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                    <div class="stat-icon cpu-icon">
                        <i class="el-icon-cpu"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">{{ systemStats.cpu }}%</div>
                        <div class="stat-label">CPU使用率</div>
                    </div>
                </div>
                <el-progress 
                    :percentage="systemStats.cpu" 
                    :color="getProgressColor(systemStats.cpu)"
                    :stroke-width="8"
                ></el-progress>
            </el-card>

            <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                    <div class="stat-icon memory-icon">
                        <i class="el-icon-coin"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">{{ systemStats.memory }}%</div>
                        <div class="stat-label">内存使用率</div>
                    </div>
                </div>
                <el-progress 
                    :percentage="systemStats.memory" 
                    :color="getProgressColor(systemStats.memory)"
                    :stroke-width="8"
                ></el-progress>
            </el-card>

            <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                    <div class="stat-icon disk-icon">
                        <i class="el-icon-folder"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">{{ systemStats.disk }}%</div>
                        <div class="stat-label">磁盘使用率</div>
                    </div>
                </div>
                <el-progress 
                    :percentage="systemStats.disk" 
                    :color="getProgressColor(systemStats.disk)"
                    :stroke-width="8"
                ></el-progress>
            </el-card>

            <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                    <div class="stat-icon network-icon">
                        <i class="el-icon-connection"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">{{ systemStats.network }}</div>
                        <div class="stat-label">网络连接数</div>
                    </div>
                </div>
                <div class="stat-trend">
                    <i class="el-icon-top" style="color: #67C23A;"></i>
                    <span style="color: #67C23A;">+12%</span>
                </div>
            </el-card>
        </div>

        <!-- 主要内容区域 -->
        <div class="main-content">
            <!-- 左侧图表区域 -->
            <div class="charts-section">
                <el-card class="chart-card" shadow="hover">
                    <div slot="header" class="chart-header">
                        <span>系统性能趋势</span>
                        <el-button type="text" @click="refreshData">
                            <i class="el-icon-refresh"></i>
                        </el-button>
                    </div>
                    <div class="chart-container">
                        <div class="chart-placeholder">
                            <i class="el-icon-data-analysis"></i>
                            <p>性能监控图表</p>
                            <small>这里可以集成 ECharts 或其他图表库</small>
                        </div>
                    </div>
                </el-card>

                <el-card class="chart-card" shadow="hover">
                    <div slot="header" class="chart-header">
                        <span>服务状态监控</span>
                        <el-tag :type="getServiceStatusType()" size="small">
                            {{ getServiceStatusText() }}
                        </el-tag>
                    </div>
                    <div class="service-list">
                        <div 
                            v-for="service in serviceList" 
                            :key="service.name"
                            class="service-item"
                        >
                            <div class="service-info">
                                <i :class="service.icon"></i>
                                <span class="service-name">{{ service.name }}</span>
                            </div>
                            <div class="service-status">
                                <el-tag 
                                    :type="service.status === 'running' ? 'success' : 'danger'"
                                    size="mini"
                                >
                                    {{ service.status === 'running' ? '运行中' : '已停止' }}
                                </el-tag>
                                <span class="service-uptime">{{ service.uptime }}</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>

            <!-- 右侧信息区域 -->
            <div class="info-section">
                <el-card class="info-card" shadow="hover">
                    <div slot="header" class="info-header">
                        <span>系统告警</span>
                        <el-badge :value="alerts.length" class="alert-badge">
                            <i class="el-icon-bell"></i>
                        </el-badge>
                    </div>
                    <div class="alert-list">
                        <div 
                            v-for="alert in alerts" 
                            :key="alert.id"
                            class="alert-item"
                            :class="alert.level"
                        >
                            <i :class="getAlertIcon(alert.level)"></i>
                            <div class="alert-content">
                                <div class="alert-title">{{ alert.title }}</div>
                                <div class="alert-time">{{ alert.time }}</div>
                            </div>
                            <el-button type="text" size="mini" @click="dismissAlert(alert.id)">
                                <i class="el-icon-close"></i>
                            </el-button>
                        </div>
                    </div>
                </el-card>

                <el-card class="info-card" shadow="hover">
                    <div slot="header" class="info-header">
                        <span>快速操作</span>
                    </div>
                    <div class="quick-actions">
                        <el-button type="primary" icon="el-icon-refresh" @click="refreshSystem">
                            刷新系统
                        </el-button>
                        <el-button type="success" icon="el-icon-download" @click="exportData">
                            导出数据
                        </el-button>
                        <el-button type="warning" icon="el-icon-setting" @click="openSettings">
                            系统设置
                        </el-button>
                        <el-button type="info" icon="el-icon-document" @click="viewLogs">
                            查看日志
                        </el-button>
                    </div>
                </el-card>
            </div>
        </div>

        <!-- 系统信息弹窗 -->
        <el-dialog
            title="系统设置"
            :visible.sync="settingsVisible"
            width="50%"
            :before-close="handleClose"
        >
            <div class="settings-content">
                <el-form :model="settingsForm" label-width="120px">
                    <el-form-item label="自动刷新间隔">
                        <el-select v-model="settingsForm.refreshInterval" placeholder="选择刷新间隔">
                            <el-option label="30秒" value="30"></el-option>
                            <el-option label="1分钟" value="60"></el-option>
                            <el-option label="5分钟" value="300"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="告警通知">
                        <el-switch v-model="settingsForm.notifications"></el-switch>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="settingsVisible = false">取消</el-button>
                <el-button type="primary" @click="saveSettings">确定</el-button>
            </span>
        </el-dialog>
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
            currentTime: '',
            settingsVisible: false,
            systemStats: {
                cpu: 45,
                memory: 68,
                disk: 32,
                network: 156
            },
            serviceList: [
                { name: 'Web服务', status: 'running', uptime: '15天 3小时', icon: 'el-icon-globe' },
                { name: '数据库', status: 'running', uptime: '30天 12小时', icon: 'el-icon-data-base' },
                { name: '缓存服务', status: 'running', uptime: '7天 8小时', icon: 'el-icon-coin' },
                { name: '文件服务', status: 'stopped', uptime: '0天 0小时', icon: 'el-icon-folder' }
            ],
            alerts: [
                { id: 1, title: '内存使用率超过80%', level: 'warning', time: '2分钟前' },
                { id: 2, title: '数据库连接数异常', level: 'error', time: '5分钟前' },
                { id: 3, title: '系统更新可用', level: 'info', time: '1小时前' }
            ],
            settingsForm: {
                refreshInterval: '60',
                notifications: true
            },
            timer: null
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
        this.updateTime();
        this.startTimer();
        this.loadSystemData();
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        ...mapActions([
            // 公共请求
            storeStatic.A_ACTION_COMMON
        ]),
        
        /**
         * @description: 更新当前时间
         */
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleString('zh-CN');
        },

        /**
         * @description: 启动定时器
         */
        startTimer() {
            this.timer = setInterval(() => {
                this.updateTime();
                this.updateSystemStats();
            }, 1000);
        },

        /**
         * @description: 更新系统统计数据
         */
        updateSystemStats() {
            // 模拟数据变化
            this.systemStats.cpu = Math.floor(Math.random() * 30) + 30;
            this.systemStats.memory = Math.floor(Math.random() * 20) + 60;
            this.systemStats.disk = Math.floor(Math.random() * 10) + 30;
            this.systemStats.network = Math.floor(Math.random() * 50) + 150;
        },

        /**
         * @description: 获取进度条颜色
         */
        getProgressColor(percentage) {
            if (percentage < 50) return '#67C23A';
            if (percentage < 80) return '#E6A23C';
            return '#F56C6C';
        },

        /**
         * @description: 获取服务状态类型
         */
        getServiceStatusType() {
            const runningCount = this.serviceList.filter(s => s.status === 'running').length;
            const totalCount = this.serviceList.length;
            if (runningCount === totalCount) return 'success';
            if (runningCount > totalCount / 2) return 'warning';
            return 'danger';
        },

        /**
         * @description: 获取服务状态文本
         */
        getServiceStatusText() {
            const runningCount = this.serviceList.filter(s => s.status === 'running').length;
            const totalCount = this.serviceList.length;
            return `${runningCount}/${totalCount} 运行中`;
        },

        /**
         * @description: 获取告警图标
         */
        getAlertIcon(level) {
            const icons = {
                info: 'el-icon-info',
                warning: 'el-icon-warning',
                error: 'el-icon-error'
            };
            return icons[level] || 'el-icon-info';
        },

        /**
         * @description: 刷新数据
         */
        refreshData() {
            this.loadSystemData();
            this.$message.success('数据已刷新');
        },

        /**
         * @description: 加载系统数据
         */
        loadSystemData() {
            // 这里可以调用实际的API
            this[storeStatic.A_ACTION_COMMON]({
                url: 'system/stats',
                mock: true
            }).then(res => {
                console.log('系统数据加载成功', res);
            }).catch(err => {
                console.error('系统数据加载失败', err);
            });
        },

        /**
         * @description: 关闭告警
         */
        dismissAlert(alertId) {
            this.alerts = this.alerts.filter(alert => alert.id !== alertId);
            this.$message.success('告警已关闭');
        },

        /**
         * @description: 刷新系统
         */
        refreshSystem() {
            this.$confirm('确定要刷新系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message.success('系统刷新中...');
            });
        },

        /**
         * @description: 导出数据
         */
        exportData() {
            this.$message.success('数据导出功能开发中...');
        },

        /**
         * @description: 打开设置
         */
        openSettings() {
            this.settingsVisible = true;
        },

        /**
         * @description: 查看日志
         */
        viewLogs() {
            this.$message.info('日志查看功能开发中...');
        },

        /**
         * @description: 保存设置
         */
        saveSettings() {
            this.$message.success('设置已保存');
            this.settingsVisible = false;
        },

        /**
         * @description: 弹出层关闭处理
         * @author: M.yunlong
         * @date: 2023-04-26 10:42:53
        */
        handleClose(done) {
            this.$confirm('确认关闭？').then(_ => {
                done();
            }).catch(_ => {});
        },

        /**
         * @description: 测试接口
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

<style lang="scss" scoped>
.dashboard {
    padding: 20px;
    background: #f5f7fa;
    min-height: 100vh;

    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .dashboard-title {
            margin: 0;
            color: #303133;
            font-size: 24px;
            font-weight: 600;

            i {
                margin-right: 10px;
                color: #409EFF;
            }
        }

        .dashboard-time {
            color: #909399;
            font-size: 14px;

            i {
                margin-right: 5px;
            }
        }
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 20px;

        .stat-card {
            .stat-content {
                display: flex;
                align-items: center;
                margin-bottom: 15px;

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    font-size: 24px;
                    color: white;

                    &.cpu-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                    &.memory-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
                    &.disk-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
                    &.network-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
                }

                .stat-info {
                    flex: 1;

                    .stat-value {
                        font-size: 28px;
                        font-weight: bold;
                        color: #303133;
                        margin-bottom: 5px;
                    }

                    .stat-label {
                        color: #909399;
                        font-size: 14px;
                    }
                }

                .stat-trend {
                    text-align: right;
                    font-size: 12px;
                }
            }
        }
    }

    .main-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;

        .charts-section {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .chart-card {
                .chart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                }

                .chart-container {
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .chart-placeholder {
                        text-align: center;
                        color: #909399;

                        i {
                            font-size: 48px;
                            margin-bottom: 10px;
                            display: block;
                        }

                        p {
                            margin: 10px 0;
                            font-size: 16px;
                        }

                        small {
                            font-size: 12px;
                        }
                    }
                }
            }

            .service-list {
                .service-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #f0f0f0;

                    &:last-child {
                        border-bottom: none;
                    }

                    .service-info {
                        display: flex;
                        align-items: center;

                        i {
                            margin-right: 10px;
                            color: #409EFF;
                        }

                        .service-name {
                            font-weight: 500;
                        }
                    }

                    .service-status {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        .service-uptime {
                            font-size: 12px;
                            color: #909399;
                        }
                    }
                }
            }
        }

        .info-section {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .info-card {
                .info-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;

                    .alert-badge {
                        margin-left: 10px;
                    }
                }

                .alert-list {
                    .alert-item {
                        display: flex;
                        align-items: center;
                        padding: 12px 0;
                        border-bottom: 1px solid #f0f0f0;

                        &:last-child {
                            border-bottom: none;
                        }

                        &.warning i { color: #E6A23C; }
                        &.error i { color: #F56C6C; }
                        &.info i { color: #909399; }

                        i {
                            margin-right: 10px;
                            font-size: 16px;
                        }

                        .alert-content {
                            flex: 1;

                            .alert-title {
                                font-size: 14px;
                                margin-bottom: 4px;
                            }

                            .alert-time {
                                font-size: 12px;
                                color: #909399;
                            }
                        }
                    }
                }

                .quick-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin: 0 -12px;
                    padding: 0 12px;

                    .el-button {
                        width: 100%;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        margin-left: 0;
                        
                        i {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }
    }
}

// 响应式设计
@media (max-width: 1200px) {
    .dashboard .main-content {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .dashboard {
        padding: 10px;

        .dashboard-header {
            flex-direction: column;
            gap: 10px;
            text-align: center;
        }

        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
