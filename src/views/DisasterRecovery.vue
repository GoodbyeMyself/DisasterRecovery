<template>
    <div class="disaster-recovery">
        <!-- 日志查看 -->
        <el-card class="log-card">
            <el-tabs v-model="activeLogTab">
                <el-tab-pane label="主应用日志" name="primary">
                    <div class="table-container">
                        <el-table
                            :data="primaryLogs"
                            style="width: 100%"
                            height="500"
                            stripe
                            :header-cell-style="{ background: '#f8f9fa', color: '#1a1a1a', fontWeight: '600' }"
                        >
                            <el-table-column
                                prop="timestamp"
                                label="时间"
                                width="180"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.timestamp }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="level"
                                label="级别"
                                width="100"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <el-tag
                                        :type="getLogLevelType(scope.row.level)"
                                        disable-transitions
                                        size="small"
                                    >
                                        {{ scope.row.level }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="module"
                                label="模块"
                                width="150"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <span class="module-tag">{{ scope.row.module }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="message"
                                label="消息内容"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="状态"
                                width="120"
                            >
                                <template slot-scope="scope">
                                    <el-tag
                                        :type="getStatusType(scope.row.status)"
                                        disable-transitions
                                        size="small"
                                    >
                                        {{ scope.row.status }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                        
                        <!-- 加载更多按钮 - 主应用日志 -->
                        <div class="load-more-container">
                            <el-button
                                v-if="primaryHasMore"
                                :loading="primaryLoading"
                                @click="loadMorePrimaryLogs"
                                type="primary"
                                size="medium"
                                class="load-more-btn"
                            >
                                <span v-if="!primaryLoading">加载更多日志</span>
                                <span v-else>加载中...</span>
                            </el-button>
                            <div v-else class="no-more-data">
                                <i class="el-icon-info"></i>
                                <span>已加载全部日志</span>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="备用日志" name="backup">
                    <div class="table-container">
                        <el-table
                            :data="backupLogs"
                            style="width: 100%"
                            height="500"
                            stripe
                            :header-cell-style="{ background: '#f8f9fa', color: '#1a1a1a', fontWeight: '600' }"
                        >
                            <el-table-column
                                prop="timestamp"
                                label="时间"
                                width="180"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.timestamp }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="level"
                                label="级别"
                                width="100"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <el-tag
                                        :type="getLogLevelType(scope.row.level)"
                                        disable-transitions
                                        size="small"
                                    >
                                        {{ scope.row.level }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="module"
                                label="模块"
                                width="150"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <span class="module-tag">{{ scope.row.module }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="message"
                                label="消息内容"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="状态"
                                width="120"
                            >
                                <template slot-scope="scope">
                                    <el-tag
                                        :type="getStatusType(scope.row.status)"
                                        disable-transitions
                                        size="small"
                                    >
                                        {{ scope.row.status }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                        
                        <!-- 加载更多按钮 - 备用日志 -->
                        <div class="load-more-container">
                            <el-button
                                v-if="backupHasMore"
                                :loading="backupLoading"
                                @click="loadMoreBackupLogs"
                                type="primary"
                                size="medium"
                                class="load-more-btn"
                            >
                                <span v-if="!backupLoading">加载更多日志</span>
                                <span v-else>加载中...</span>
                            </el-button>
                            <div v-else class="no-more-data">
                                <i class="el-icon-info"></i>
                                <span>已加载全部日志</span>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "DisasterRecovery",
    data() {
        return {
            activeLogTab: "primary",
            primaryLogs: [
                {
                    id: 1,
                    timestamp: "2024-01-15 14:30:25",
                    level: "INFO",
                    module: "同步服务",
                    message: "主应用数据同步服务启动成功，开始监控数据变化",
                    status: "正常"
                },
                {
                    id: 2,
                    timestamp: "2024-01-15 14:32:15",
                    level: "INFO",
                    module: "数据库连接",
                    message: "已成功连接到主数据库 192.168.1.100:3306",
                    status: "正常"
                },
                {
                    id: 3,
                    timestamp: "2024-01-15 14:35:42",
                    level: "WARN",
                    module: "网络监控",
                    message: "检测到网络延迟较高，当前延迟: 280ms",
                    status: "警告"
                },
                {
                    id: 4,
                    timestamp: "2024-01-15 14:38:30",
                    level: "INFO",
                    module: "数据同步",
                    message: "完成数据表 user_info 同步，同步记录数: 1,245条",
                    status: "正常"
                },
                {
                    id: 5,
                    timestamp: "2024-01-15 14:40:18",
                    level: "ERROR",
                    module: "数据验证",
                    message: "数据完整性检查失败，发现 3 条记录存在异常",
                    status: "错误"
                },
                {
                    id: 6,
                    timestamp: "2024-01-15 14:42:05",
                    level: "INFO",
                    module: "故障恢复",
                    message: "自动修复完成，已重新同步异常数据",
                    status: "正常"
                },
                {
                    id: 7,
                    timestamp: "2024-01-15 14:45:30",
                    level: "INFO",
                    module: "监控报告",
                    message: "系统运行状态良好，CPU使用率: 45%, 内存使用率: 62%",
                    status: "正常"
                },
                {
                    id: 8,
                    timestamp: "2024-01-15 14:48:12",
                    level: "WARN",
                    module: "存储空间",
                    message: "主存储空间使用率达到 78%，建议及时清理",
                    status: "警告"
                }
            ],
            backupLogs: [
                {
                    id: 1,
                    timestamp: "2024-01-15 14:30:28",
                    level: "INFO",
                    module: "备份服务",
                    message: "备用系统初始化完成，等待主系统数据同步",
                    status: "正常"
                },
                {
                    id: 2,
                    timestamp: "2024-01-15 14:32:20",
                    level: "INFO",
                    module: "数据库连接",
                    message: "已成功连接到备用数据库 192.168.1.101:3306",
                    status: "正常"
                },
                {
                    id: 3,
                    timestamp: "2024-01-15 14:35:45",
                    level: "INFO",
                    module: "数据接收",
                    message: "开始接收主系统同步数据",
                    status: "正常"
                },
                {
                    id: 4,
                    timestamp: "2024-01-15 14:38:35",
                    level: "INFO",
                    module: "数据写入",
                    message: "成功写入数据表 user_info，写入记录数: 1,245条",
                    status: "正常"
                },
                {
                    id: 5,
                    timestamp: "2024-01-15 14:40:22",
                    level: "WARN",
                    module: "数据校验",
                    message: "检测到数据不一致，正在等待主系统重新发送",
                    status: "警告"
                },
                {
                    id: 6,
                    timestamp: "2024-01-15 14:42:08",
                    level: "INFO",
                    module: "数据修复",
                    message: "接收到修复数据，数据一致性已恢复",
                    status: "正常"
                },
                {
                    id: 7,
                    timestamp: "2024-01-15 14:45:33",
                    level: "INFO",
                    module: "系统状态",
                    message: "备用系统运行正常，准备就绪状态",
                    status: "正常"
                },
                {
                    id: 8,
                    timestamp: "2024-01-15 14:48:15",
                    level: "INFO",
                    module: "存储监控",
                    message: "备用存储空间充足，使用率: 45%",
                    status: "正常"
                }
            ],
            primaryLoading: false,
            backupLoading: false,
            primaryHasMore: true,
            backupHasMore: true,
            primaryPage: 1,
            backupPage: 1,
            pageSize: 10,
        };
    },
    methods: {
        // 加载更多主应用日志
        async loadMorePrimaryLogs() {
            if (this.primaryLoading || !this.primaryHasMore) return;
            
            this.primaryLoading = true;
            
            try {
                // 模拟API调用延迟
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // 生成更多日志数据
                const newLogs = this.generateMoreLogs('primary', this.primaryPage + 1);
                
                if (newLogs.length > 0) {
                    this.primaryLogs.push(...newLogs);
                    this.primaryPage++;
                    
                    // 模拟数据有限，假设最多加载5页
                    if (this.primaryPage >= 5) {
                        this.primaryHasMore = false;
                    }
                    
                    this.$message.success(`成功加载 ${newLogs.length} 条新日志`);
                } else {
                    this.primaryHasMore = false;
                    this.$message.info('没有更多日志了');
                }
            } catch (error) {
                console.error('加载主应用日志失败:', error);
                this.$message.error('加载日志失败，请重试');
            } finally {
                this.primaryLoading = false;
            }
        },

        // 加载更多备用日志
        async loadMoreBackupLogs() {
            if (this.backupLoading || !this.backupHasMore) return;
            
            this.backupLoading = true;
            
            try {
                // 模拟API调用延迟
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // 生成更多日志数据
                const newLogs = this.generateMoreLogs('backup', this.backupPage + 1);
                
                if (newLogs.length > 0) {
                    this.backupLogs.push(...newLogs);
                    this.backupPage++;
                    
                    // 模拟数据有限，假设最多加载5页
                    if (this.backupPage >= 5) {
                        this.backupHasMore = false;
                    }
                    
                    this.$message.success(`成功加载 ${newLogs.length} 条新日志`);
                } else {
                    this.backupHasMore = false;
                    this.$message.info('没有更多日志了');
                }
            } catch (error) {
                console.error('加载备用日志失败:', error);
                this.$message.error('加载日志失败，请重试');
            } finally {
                this.backupLoading = false;
            }
        },

        // 生成更多日志数据
        generateMoreLogs(type, page) {
            const logs = [];
            const baseId = type === 'primary' ? this.primaryLogs.length : this.backupLogs.length;
            
            // 模拟日志数据
            const logTemplates = {
                primary: [
                    { level: 'INFO', module: '数据同步', message: '完成增量数据同步，同步记录数: {count}条', status: '正常' },
                    { level: 'INFO', module: '系统监控', message: 'CPU使用率: {cpu}%, 内存使用率: {memory}%', status: '正常' },
                    { level: 'WARN', module: '网络监控', message: '检测到网络延迟: {delay}ms', status: '警告' },
                    { level: 'INFO', module: '数据库', message: '数据库连接池状态检查完成，活动连接: {conn}个', status: '正常' },
                    { level: 'ERROR', module: '数据验证', message: '发现 {errors} 条数据异常，正在处理', status: '错误' },
                    { level: 'INFO', module: '备份任务', message: '定时备份任务执行完成，备份大小: {size}MB', status: '正常' }
                ],
                backup: [
                    { level: 'INFO', module: '备份服务', message: '接收到主系统数据，处理记录数: {count}条', status: '正常' },
                    { level: 'INFO', module: '数据校验', message: '数据完整性校验通过，校验记录: {count}条', status: '正常' },
                    { level: 'WARN', module: '存储监控', message: '备用存储使用率: {usage}%', status: '警告' },
                    { level: 'INFO', module: '系统状态', message: '备用系统运行正常，响应时间: {time}ms', status: '正常' },
                    { level: 'INFO', module: '数据写入', message: '成功写入数据表 {table}，写入记录: {count}条', status: '正常' },
                    { level: 'INFO', module: '监控报告', message: '备用系统健康检查完成，所有指标正常', status: '正常' }
                ]
            };
            
            // 生成指定数量的日志
            for (let i = 0; i < this.pageSize; i++) {
                const template = logTemplates[type][Math.floor(Math.random() * logTemplates[type].length)];
                const now = new Date();
                now.setMinutes(now.getMinutes() - Math.random() * 60 * 24); // 随机时间（24小时内）
                
                const timestamp = now.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(/\//g, '-');

                // 替换消息模板中的占位符
                let message = template.message;
                message = message.replace('{count}', Math.floor(Math.random() * 1000) + 100);
                message = message.replace('{cpu}', Math.floor(Math.random() * 30) + 30);
                message = message.replace('{memory}', Math.floor(Math.random() * 40) + 40);
                message = message.replace('{delay}', Math.floor(Math.random() * 200) + 50);
                message = message.replace('{conn}', Math.floor(Math.random() * 20) + 5);
                message = message.replace('{errors}', Math.floor(Math.random() * 5) + 1);
                message = message.replace('{size}', Math.floor(Math.random() * 500) + 100);
                message = message.replace('{usage}', Math.floor(Math.random() * 30) + 40);
                message = message.replace('{time}', Math.floor(Math.random() * 100) + 50);
                message = message.replace('{table}', ['user_info', 'order_data', 'system_config', 'log_archive'][Math.floor(Math.random() * 4)]);

                logs.push({
                    id: baseId + i + 1,
                    timestamp: timestamp,
                    level: template.level,
                    module: template.module,
                    message: message,
                    status: template.status
                });
            }
            
            // 模拟最后一页返回较少数据
            if (page >= 5) {
                return [];
            }
            
            return logs;
        },

        // 获取日志级别对应的标签类型
        getLogLevelType(level) {
            const typeMap = {
                'INFO': '',
                'WARN': 'warning',
                'ERROR': 'danger',
                'DEBUG': 'info'
            };
            return typeMap[level] || '';
        },

        // 获取状态对应的标签类型
        getStatusType(status) {
            const typeMap = {
                '正常': 'success',
                '警告': 'warning',
                '错误': 'danger',
                '运行中': 'info'
            };
            return typeMap[status] || '';
        }
    },
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
        border-radius: 16px;
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
            padding: 20px 24px;
            
            span {
                font-size: 18px;
                font-weight: 600;
                color: #1a1a1a;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
        }

        .el-card__body {
            padding: 12px 24px;
        }
    }

    .log-card {
        margin-bottom: 24px;
    }

    ::v-deep .el-tabs {
        .el-tabs__header {
            margin: 0 0 24px 0;
            
            .el-tabs__nav-wrap {
                &::after {
                    background-color: rgba(0, 0, 0, 0.08);
                }
            }
            
            .el-tabs__item {
                color: #666666;
                font-weight: 600;
                font-size: 14px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                padding: 0 24px;
                
                &.is-active {
                    color: #000000;
                }
                
                &:hover {
                    color: #333333;
                }
            }
            
            .el-tabs__active-bar {
                background-color: #000000;
                height: 3px;
            }
        }
    }

    .table-container {
        ::v-deep .el-table {
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.08);
            
            .el-table__header-wrapper {
                th {
                    border-bottom: 2px solid rgba(0, 0, 0, 0.08);
                    
                    .cell {
                        color: #1a1a1a;
                        font-weight: 600;
                        font-size: 13px;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }
                }
            }
            
            .el-table__body-wrapper {
                tr {
                    transition: all 0.3s ease;
                    
                    &:hover {
                        background-color: rgba(0, 0, 0, 0.02) !important;
                    }
                    
                    td {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                        
                        .cell {
                            color: #333333;
                            font-size: 13px;
                            line-height: 1.6;
                        }
                    }
                }
                
                .el-table__row--striped {
                    background-color: rgba(0, 0, 0, 0.02);
                }
            }
        }
        
        .module-tag {
            background: rgba(0, 0, 0, 0.06);
            color: #1a1a1a;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            letter-spacing: 0.5px;
        }
        
        ::v-deep .el-tag {
            border-radius: 6px;
            font-weight: 600;
            font-size: 11px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            border: none;
            
            &.el-tag--success {
                background: linear-gradient(135deg, #000000 0%, #333333 100%);
                color: white;
            }
            
            &.el-tag--warning {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                color: #1a1a1a;
                border: 1px solid rgba(0, 0, 0, 0.2);
            }
            
            &.el-tag--danger {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                color: #1a1a1a;
                border: 1px solid rgba(0, 0, 0, 0.3);
            }
            
            &.el-tag--info {
                background: rgba(0, 0, 0, 0.06);
                color: #1a1a1a;
            }
            
            &:not(.el-tag--success) {
                background: rgba(0, 0, 0, 0.06);
                color: #1a1a1a;
            }
        }
        
        .el-icon-time {
            color: #666666;
            font-size: 14px;
        }
    }

    // 加载更多容器样式
    .load-more-container {
        text-align: center;
        padding: 24px 0;
        margin-top: 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        
        .load-more-btn {
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            border: none;
            border-radius: 12px;
            padding: 12px 32px;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 160px;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                background: linear-gradient(135deg, #333333 0%, #555555 100%);
            }
            
            &:active {
                transform: translateY(0);
            }
            
            &.is-loading {
                background: linear-gradient(135deg, #666666 0%, #888888 100%);
                cursor: not-allowed;
                
                &:hover {
                    transform: none;
                    box-shadow: none;
                }
            }
            
            .el-icon-loading {
                margin-right: 8px;
                animation: rotating 2s linear infinite;
            }
        }
        
        .no-more-data {
            color: #999999;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            
            i {
                font-size: 16px;
                color: #cccccc;
            }
            
            span {
                color: #666666;
            }
        }
    }
}

// 旋转动画
@keyframes rotating {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

// 全局样式覆盖
::v-deep .el-button {
    font-family: inherit;
}

::v-deep .el-table {
    font-family: inherit;
}
</style>
