<template>
    <div class="disaster-recovery">
        <!-- 日志查看 -->
        <el-card class="log-card">
            <el-tabs v-model="activeLogTab" @tab-click="handleTabClick">
                <el-tab-pane label="主应用日志" name="primary">
                    <div class="log-container">
                        <el-input
                            type="textarea"
                            :value="primaryLogText"
                            :rows="25"
                            readonly
                            placeholder="暂无日志数据..."
                            class="log-textarea"
                        />
                        
                        <!-- 刷新按钮 - 主应用日志 -->
                        <div class="refresh-container">
                            <el-button
                                :loading="primaryLoading"
                                @click="refreshPrimaryLogs"
                                type="primary"
                                size="medium"
                                class="refresh-btn"
                            >
                                <span v-if="!primaryLoading">刷新日志</span>
                                <span v-else>刷新中...</span>
                            </el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="备用日志" name="backup">
                    <div class="log-container">
                        <el-input
                            type="textarea"
                            :value="backupLogText"
                            :rows="25"
                            readonly
                            placeholder="暂无日志数据..."
                            class="log-textarea"
                        />
                        
                        <!-- 刷新按钮 - 备用日志 -->
                        <div class="refresh-container">
                            <el-button
                                :loading="backupLoading"
                                @click="refreshBackupLogs"
                                type="primary"
                                size="medium"
                                class="refresh-btn"
                            >
                                <span v-if="!backupLoading">刷新日志</span>
                                <span v-else>刷新中...</span>
                            </el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
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
            activeLogTab: "primary",
            primaryLogs: [],
            backupLogs: [],
            primaryLoading: false,
            backupLoading: false,
            primaryHasMore: true,
            backupHasMore: true,
            skipLineNum: 1,
            pageSize: 200,
        };
    },
    computed: {
        // 主应用日志文本
        primaryLogText() {
            return this.primaryLogs.join('\n');
        },
        // 备用日志文本
        backupLogText() {
            return this.backupLogs.join('\n');
        }
    },
    created() {
        // 获取主应用日志
        this.GetLogs();
    },
    methods: {
        ...mapActions([
            // 公共请求
            storeStatic.A_ACTION_COMMON
        ]),
        GetLogs() {
            const logType = this.activeLogTab === 'primary' ? 'master' : 'slave';
            
            this[storeStatic.A_ACTION_COMMON]({
                url: `log?type=${logType}&skipLineNum=${this.skipLineNum}&limit=${this.pageSize}`,
            }).then(res => {
                console.log('日志接口返回:', res);
                
                if (res && res.code === '0' && res.data && Array.isArray(res.data)) {
                    const logData = res.data; // 直接使用字符串数组
                    
                    if (this.activeLogTab === 'primary') {
                        this.primaryLogs = logData;
                        this.primaryHasMore = logData.length === this.pageSize;
                    } else {
                        this.backupLogs = logData;
                        this.backupHasMore = logData.length === this.pageSize;
                    }
                    
                    if (logData.length > 0) {
                        // this.$message.success(`成功加载 ${logData.length} 条日志`);
                    } else {
                        this.$message.info('没有更多日志了');
                        if (this.activeLogTab === 'primary') {
                            this.primaryHasMore = false;
                        } else {
                            this.backupHasMore = false;
                        }
                    }
                } else {
                    this.$message.error('加载日志失败');
                    console.error('日志接口返回错误:', res);
                }
            }).catch(error => {
                console.error('获取日志失败:', error);
                this.$message.error('获取日志失败，请重试');
            });
        },
        
        // 刷新主应用日志
        async refreshPrimaryLogs() {
            if (this.primaryLoading) return;
            
            this.primaryLoading = true;
            this.activeLogTab = 'primary';
            
            try {
                await this.GetLogs();
                this.$message.success('主应用日志已刷新');
            } catch (error) {
                console.error('刷新主应用日志失败:', error);
                this.$message.error('刷新日志失败，请重试');
            } finally {
                this.primaryLoading = false;
            }
        },

        // 刷新备用日志
        async refreshBackupLogs() {
            if (this.backupLoading) return;
            
            this.backupLoading = true;
            this.activeLogTab = 'backup';
            
            try {
                await this.GetLogs();
                this.$message.success('备用日志已刷新');
            } catch (error) {
                console.error('刷新备用日志失败:', error);
                this.$message.error('刷新日志失败，请重试');
            } finally {
                this.backupLoading = false;
            }
        },

        // 切换标签时重新加载数据
        handleTabClick() {
            const currentLogs = this.activeLogTab === 'primary' ? this.primaryLogs : this.backupLogs;
            if (currentLogs.length === 0) {
                this.GetLogs();
            }
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

    .log-container {
        .log-textarea {
            ::v-deep .el-textarea__inner {
                background: #1a1a1a;
                color: #00ff00;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 16px;
                resize: vertical;
                min-height: 600px;
                
                &:focus {
                    border-color: #000000;
                    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
                }
                
                &::placeholder {
                    color: #666666;
                }
            }
        }
    }

    // 刷新按钮容器样式
    .refresh-container {
        text-align: center;
        padding: 24px 0;
        margin-top: 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        
        .refresh-btn {
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
</style>
