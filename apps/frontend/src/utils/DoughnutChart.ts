export const data = {
  labels: ['charged', 'remain'],
  datasets: [
    {
      backgroundColor: ['#2b8a3e', '#495057'],
      borderWidth: 1,
      borderColor: '#ffffff',
      data: [60, 40],
    },
  ],
}

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '50%', // 調整圓心大小，使圓形更飽滿
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        display: true,
        position: 'top',
      },
    },
    centerText: {
      text: '59%', // 設定要顯示的文字
      color: '#ffffff', // 設定文字顏色
      font: {
        size: '18', // 設定字型大小
        weight: 'bold', // 設定字型粗細
      },
    },
  },
  elements: {
    arc: {
      borderWidth: 2, // 確保邊框寬度設置正確
    },
  },
}

// Custom plugin to draw text in the center
export const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: { options?: any; width?: any; height?: any; ctx?: any }) {
    const { width, height, ctx } = chart
    ctx.save()

    // 設定字型大小
    const fontSize = (height / 8).toFixed(2)
    ctx.font = `${fontSize}px Arial`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'

    // 取得設定的文字
    const text = chart.options.plugins.centerText.text || ''
    const textX = width / 2
    const textY = height / 2

    ctx.fillStyle = chart.options.plugins.centerText.color // 使用設定的顏色
    ctx.fillText(text, textX, textY)
    ctx.restore()
  },
}
