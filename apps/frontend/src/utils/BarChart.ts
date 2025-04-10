export const data = {
  labels: ['SOC 1', 'SOC 2', 'SOC 3', 'SOC 4', 'SOC 5', 'SOC 6'],
  datasets: [
    {
      label: 'charged',
      data: [50, 50, 50, 50, 50, 50],
      backgroundColor: '#2b8a3e',
      borderWidth: 0,
      barPercentage: 0.7,
      type: 'bar', // 添加type以顯示為bar
    },
    {
      label: 'remain',
      data: [100, 100, 100, 100, 100, 100],
      backgroundColor: '#ffc107', // 添加背景顏色以便於顯示
      borderWidth: 1,
      barPercentage: 0.7,
      type: 'bar', // 確保remain也顯示為bar
    },
  ],
}

export const config = {
  responsive: true, // 確保圖表是響應式的
  maintainAspectRatio: false, // 允許圖表隨容器調整大小
  width: 600, // 設定圖表寬度
  height: 400, // 設定圖表高度
  // Title configuration
  plugins: {
    title: {
      display: true,
      text: 'capacity', // 圖表標題
      font: {
        size: 18,
        color: 'white', // 新增文字顏色為白色
      },
    },
  },

  // Scales configuration
  scales: {
    x: {
      stacked: true,
    },
    y: {
      beginAtZero: true, // 確保Y軸從0開始
      stacked: true,
      min: 0,
      max: 100,
      title: {
        display: true,
        text: 'Capacity', // Y軸標題
        color: 'white', // 新增文字顏色為白色
      },
    },
  },
}
