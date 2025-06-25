# Element UI 主题配置指南

## 概述

本项目使用 LESS 作为主要的样式预处理器，但 Element UI 的源码是 SCSS 格式的。为了解决这个问题，我们采用了混合方案：

- 在 LESS 中定义主题变量（`src/assets/less/element-theme.less`）
- 在 SCSS 中使用这些变量（`src/element-variables.scss`）
- 在 main.js 中导入 SCSS 文件来应用主题

## 文件结构

```
src/
├── assets/
│   └── less/
│       ├── element-theme.less    # Element UI 主题变量定义（LESS）
│       └── index.less           # 主 LESS 文件，导入主题变量
├── element-variables.scss       # Element UI 主题配置（SCSS）
└── main.js                     # 导入 SCSS 主题文件
```

## 如何修改主题

### 方法一：修改 LESS 变量（推荐）

在 `src/assets/less/element-theme.less` 中修改变量：

```less
// 主色调
@element-primary-color: #409eff;  // 修改主色调
@element-success-color: #67c23a;
@element-warning-color: #e6a23c;
@element-danger-color: #f56c6c;
@element-info-color: #909399;
```

然后同步更新 `src/element-variables.scss` 中对应的变量：

```scss
// 主色调
$--color-primary: #409eff;  // 与 LESS 变量保持一致
$--color-success: #67c23a;
$--color-warning: #e6a23c;
$--color-danger: #f56c6c;
$--color-info: #909399;
```

### 方法二：直接修改 SCSS 变量

直接在 `src/element-variables.scss` 中修改变量：

```scss
$--color-primary: #409eff;
```

## 可用的主题变量

### 主色调
- `$--color-primary`: 主色调
- `$--color-success`: 成功色
- `$--color-warning`: 警告色
- `$--color-danger`: 危险色
- `$--color-info`: 信息色

### 文字颜色
- `$--color-text-primary`: 主要文字颜色
- `$--color-text-regular`: 常规文字颜色
- `$--color-text-secondary`: 次要文字颜色
- `$--color-text-placeholder`: 占位符文字颜色

### 边框颜色
- `$--border-color-base`: 基础边框颜色
- `$--border-color-light`: 浅色边框
- `$--border-color-lighter`: 更浅的边框
- `$--border-color-extra-light`: 最浅的边框

### 背景颜色
- `$--background-color-base`: 基础背景色

## 注意事项

1. 修改主题变量后需要重启开发服务器
2. 确保 LESS 和 SCSS 中的变量值保持一致
3. 如果需要添加新的主题变量，请同时在两个文件中添加
4. 字体路径变量 `$--font-path` 是必需的，不要修改

## 依赖

项目已安装以下依赖来支持 SCSS：
- `sass`: SCSS 编译器
- `sass-loader`: Webpack 的 SCSS 加载器 