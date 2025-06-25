<template>
    <el-container style="height: 100vh">
        <el-aside width="240px" style="background: #2d3a4b; color: #fff">
            <el-menu
                :default-active="$route.path"
                class="el-menu-vertical-demo"
                background-color="#2d3a4b"
                text-color="#fff"
                active-text-color="#ffd04b"
                router
            >
                <el-menu-item
                    v-for="item in menuList"
                    :key="item.path"
                    :index="item.path"
                >
                    <i :class="item.icon"></i>
                    <span slot="title">
                        {{ item.title }}
                    </span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header
                style="
                    background: #fff;
                    box-shadow: 0 2px 8px #f0f1f2;
                    height: 48px;
                    display: flex;
                    align-items: center;
                "
            >
                <span style="font-size: 16px; font-weight: bold">
                    Header 区域
                </span>
            </el-header>
            <el-main style="background: #f5f7fa">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import menuList from "../menu.config.js";
export default {
    name: "Layout",
    data() {
        return {
            menuList,
        };
    },
};
</script>

<style scoped>
.el-menu {
    border-right: none;
}
</style>
