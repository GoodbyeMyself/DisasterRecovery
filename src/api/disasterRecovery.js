import axios from 'axios'

export const disasterRecoveryApi = {
  // 获取配置
  getConfig() {
    return axios.get('/api/disaster-recovery/config').then(res => res.data)
  },
  // 保存配置
  saveConfig(config) {
    return axios.post('/api/disaster-recovery/config', config)
  },
  // 获取主备中心信息
  getCenterInfo() {
    return axios.get('/api/disaster-recovery/center-info').then(res => res.data)
  },
  // 启动同步
  startSync() {
    return axios.post('/api/disaster-recovery/start')
  },
  // 停止同步
  stopSync() {
    return axios.post('/api/disaster-recovery/stop')
  },
  // 获取同步状态
  getStatus() {
    return axios.get('/api/disaster-recovery/status').then(res => res.data)
  },
  // 获取日志
  getLogs() {
    return axios.get('/api/disaster-recovery/logs').then(res => res.data)
  },
  // 切换主备中心
  switchCenter() {
    return axios.post('/api/disaster-recovery/switch-center')
  }
} 