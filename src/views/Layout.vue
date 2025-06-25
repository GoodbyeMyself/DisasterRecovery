<template>
    <el-container class="layout-container">
        <el-aside width="240px" class="layout-aside">
            <div class="logo-area">
                <img src="../assets/images/logo.svg" alt="logo">
                灾备管理系统
            </div>
            <el-menu
                :default-active="$route.path"
                class="el-menu-vertical-demo"
                background-color="#1a1a1a"
                text-color="#ffffff"
                active-text-color="#409eff"
                router
            >
            <el-menu-item index="/home">
                    <i class="el-icon-house"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
                <el-menu-item index="/disaster-recovery">
                    <i class="el-icon-s-operation"></i>
                    <span slot="title">灾备管理</span>
                </el-menu-item>
                <el-menu-item index="/disaster-switch">
                    <i class="el-icon-refresh"></i>
                    <span slot="title">灾备切换</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="layout-header">
                <div class="header-content">
                    <div class="user-avatar">
                        <el-dropdown trigger="click">
                            <div class="avatar-wrapper">
                                <el-avatar 
                                    :size="32" 
                                    src="../assets/images/user.png"
                                >
                                    <img src="../assets/images/user.png" />
                                </el-avatar>
                                <span class="username">管理员</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <i class="el-icon-user"></i>
                                    个人信息
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <i class="el-icon-setting"></i>
                                    系统设置
                                </el-dropdown-item>
                                <el-dropdown-item divided>
                                    <i class="el-icon-switch-button"></i>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>
            <el-main class="layout-main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: "Layout",
    data() {
        return {
            loading: false
        };
    },
};
</script>

<style lang="scss">
.layout-container {
    height: 100vh;
}

.layout-aside {
    background: #1a1a1a;
    color: #ffffff;
    border-right: 1px solid #333333;
}

.logo-area {
    height: 48px;
    display: flex;
    background: #000000;
    font-size: 14px;
    line-height: 48px;
    padding-left: 12px;
    color: #ffffff;
    border-bottom: 1px solid #333333;
    img {
        display: inline-block;
        width: 18px;
        height: 48px;
        margin-right: 12px;
    }
}

.el-menu {
    border-right: none!important;
    
    .el-menu-item {
        position: relative;
        transition: all 0.3s ease;
        
        &:hover {
            background-color: #2a2a2a !important;
            color: #ffffff !important;
        }
        
        &.is-active {
            background-color: #409eff !important;
            color: #ffffff !important;
            font-weight: 500;
            
            // &::before {
            //     content: '';
            //     position: absolute;
            //     left: 0;
            //     top: 0;
            //     bottom: 0;
            //     width: 4px;
            //     background-color: #ffffff;
            // }
            
            &::after {
                content: '';
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                width: 1px;
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            i {
                color: #ffffff !important;
            }
        }
        
        i {
            margin-right: 8px;
            font-size: 16px;
            transition: color 0.3s ease;
        }
        
        span {
            font-size: 14px;
        }
    }
}

.layout-header {
    background: #fff;
    height: 48px!important;
    line-height: 48px;
    padding: 0 20px;
}

.header-content {
    height: 100%;
}

.header-title {
    font-size: 16px;
    font-weight: bold;
}

.user-avatar {
    height: 48px;
    float: right;
    .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 8px;
        border-radius: 4px;
        transition: background-color 0.3s;
        
        &:hover {
            background-color: #f5f7fa;
        }
        
        .username {
            margin: 0 8px;
            font-size: 14px;
            color: #606266;
        }
        
        .el-icon-arrow-down {
            font-size: 12px;
            color: #c0c4cc;
        }
    }
}

.el-dropdown-menu {
    .el-dropdown-item {
        display: flex;
        align-items: center;
        
        i {
            margin-right: 8px;
            font-size: 14px;
        }
    }
}

.layout-main {
    background: #f5f7fa;
}
</style>
