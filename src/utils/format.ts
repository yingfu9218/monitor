/**
 * 格式化网络速度
 * @param speedMBps 速度（MB/s）- 后端返回的单位已经是 MB/s
 * @returns 格式化后的字符串，如 "1.23 KB/s", "45.67 MB/s", "1.23 GB/s"
 */
export const formatNetworkSpeed = (speedMBps: number | string): string => {
  const speed = typeof speedMBps === 'string' ? parseFloat(speedMBps) : speedMBps;

  if (isNaN(speed)) {
    return '0 KB/s';
  }

  // speed 已经是 MB/s
  if (speed < 1) {
    // 小于 1 MB/s，转换为 KB/s 显示
    return `${(speed * 1024).toFixed(2)} KB/s`;
  } else if (speed < 1024) {
    // 1 MB/s ~ 1024 MB/s，显示 MB/s
    return `${speed.toFixed(2)} MB/s`;
  } else {
    // 大于等于 1024 MB/s (1 GB/s)，显示 GB/s
    return `${(speed / 1024).toFixed(2)} GB/s`;
  }
};

/**
 * 格式化磁盘 I/O 速度
 * @param speedMBps 速度（MB/s）
 * @returns 格式化后的字符串
 */
export const formatDiskIOSpeed = (speedMBps: number): string => {
  if (isNaN(speedMBps)) {
    return '0 MB/s';
  }

  if (speedMBps < 1) {
    // 小于 1 MB/s，显示 KB/s
    return `${(speedMBps * 1024).toFixed(2)} KB/s`;
  } else if (speedMBps < 1024) {
    // 小于 1 GB/s，显示 MB/s
    return `${speedMBps.toFixed(2)} MB/s`;
  } else {
    // 大于等于 1 GB/s，显示 GB/s
    return `${(speedMBps / 1024).toFixed(2)} GB/s`;
  }
};

/**
 * 格式化 CPU 使用率
 * @param percent 百分比
 * @returns 格式化后的字符串，如 "45.67%"
 */
export const formatCpuUsage = (percent: number): string => {
  if (isNaN(percent)) {
    return '0.00%';
  }
  return `${percent.toFixed(2)}%`;
};

/**
 * 格式化内存使用率
 * @param percent 百分比
 * @returns 格式化后的字符串，如 "62.34%"
 */
export const formatMemoryUsage = (percent: number): string => {
  if (isNaN(percent)) {
    return '0.00%';
  }
  return `${percent.toFixed(2)}%`;
};

/**
 * 格式化百分比
 * @param percent 百分比
 * @param decimals 小数位数，默认2位
 * @returns 格式化后的字符串
 */
export const formatPercent = (percent: number, decimals: number = 2): string => {
  if (isNaN(percent)) {
    return '0.00%';
  }
  return `${percent.toFixed(decimals)}%`;
};
