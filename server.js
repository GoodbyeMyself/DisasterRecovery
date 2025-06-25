const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据
let switchStatus = {
    isRunning: false,
    currentStep: 0,
    logs: []
};

// 灾备切换API路由
app.post('/api/disaster-switch/stop-primary-service', (req, res) => {
    const { service } = req.body;
    console.log(`停止主中心服务: ${service}`);
    
    // 模拟异步操作
    setTimeout(() => {
        res.json({
            success: true,
            message: `${service}服务已停止`,
            service: service
        });
    }, 1000);
});

app.get('/api/disaster-switch/backup-status', (req, res) => {
    // 模拟数据备份状态
    const statuses = ['idle', 'running', 'completed', 'error'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    res.json({
        status: randomStatus,
        message: `数据备份状态: ${randomStatus}`
    });
});

app.get('/api/disaster-switch/restore-status', (req, res) => {
    // 模拟数据恢复状态
    const statuses = ['idle', 'running', 'completed', 'error'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    res.json({
        status: randomStatus,
        message: `数据恢复状态: ${randomStatus}`
    });
});

app.post('/api/disaster-switch/start-restore', (req, res) => {
    console.log('启动数据恢复');
    
    setTimeout(() => {
        res.json({
            success: true,
            message: '数据恢复已启动'
        });
    }, 1000);
});

app.post('/api/disaster-switch/stop-backup-script', (req, res) => {
    console.log('停止数据备份脚本');
    
    setTimeout(() => {
        res.json({
            success: true,
            message: '数据备份脚本已停止'
        });
    }, 500);
});

app.post('/api/disaster-switch/stop-restore-script', (req, res) => {
    console.log('停止数据恢复脚本');
    
    setTimeout(() => {
        res.json({
            success: true,
            message: '数据恢复脚本已停止'
        });
    }, 500);
});

app.post('/api/disaster-switch/start-backup-services', (req, res) => {
    console.log('启动备中心服务');
    
    setTimeout(() => {
        res.json({
            success: true,
            message: '备中心服务启动成功'
        });
    }, 2000);
});

app.post('/api/disaster-switch/swap-config', (req, res) => {
    console.log('交换主备中心配置');
    
    setTimeout(() => {
        res.json({
            success: true,
            message: '主备中心配置信息交换完成'
        });
    }, 1000);
});

app.get('/api/disaster-switch/status', (req, res) => {
    res.json(switchStatus);
});

app.get('/api/disaster-switch/logs', (req, res) => {
    res.json({
        logs: switchStatus.logs
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`灾备切换API服务器运行在 http://localhost:${port}`);
}); 