import axios from 'axios'

export const disasterSwitchApi = {
  // 停止主中心服务
  stopPrimaryService(serviceName) {
    return axios.post(`/api/disaster-switch/stop-primary-service`, {
      service: serviceName
    }).then(res => res.data)
  },

  // 检查数据备份状态
  checkBackupStatus() {
    return axios.get('/api/disaster-switch/backup-status').then(res => res.data)
  },

  // 检查数据恢复状态
  checkRestoreStatus() {
    return axios.get('/api/disaster-switch/restore-status').then(res => res.data)
  },

  // 启动数据恢复
  startRestore() {
    return axios.post('/api/disaster-switch/start-restore').then(res => res.data)
  },

  // 停止数据备份脚本
  stopBackupScript() {
    return axios.post('/api/disaster-switch/stop-backup-script').then(res => res.data)
  },

  // 停止数据恢复脚本
  stopRestoreScript() {
    return axios.post('/api/disaster-switch/stop-restore-script').then(res => res.data)
  },

  // 启动备中心服务
  startBackupServices() {
    return axios.post('/api/disaster-switch/start-backup-services').then(res => res.data)
  },

  // 交换主备中心配置
  swapCenterConfig() {
    return axios.post('/api/disaster-switch/swap-config').then(res => res.data)
  },

  // 获取切换状态
  getSwitchStatus() {
    return axios.get('/api/disaster-switch/status').then(res => res.data)
  },

  // 获取切换日志
  getSwitchLogs() {
    return axios.get('/api/disaster-switch/logs').then(res => res.data)
  }
} 