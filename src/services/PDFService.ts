
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MetricData {
  time: string;
  value: number;
}

export const generateIoTReport = (
  latestData: any,
  chartData: MetricData[],
  metricType: string,
  timeRange: string
) => {
  // Create a new PDF document
  const pdf = new jsPDF();
  
  // Add title
  pdf.setFontSize(22);
  pdf.setTextColor(33, 37, 41);
  pdf.text('Health Monitoring Report', 20, 20);
  
  // Add report generation details
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  pdf.text(`Generated on: ${dateStr}`, 20, 30);
  
  // Add current metrics section title
  pdf.setFontSize(16);
  pdf.setTextColor(33, 37, 41);
  pdf.text('Current Health Metrics', 20, 45);
  
  // Current metrics table
  const currentMetricsData = [
    ['Metric', 'Value', 'Status'],
    ['Heart Rate', `${latestData.heartRate} BPM`, getHeartRateStatus(latestData.heartRate)],
    ['Body Temperature', `${latestData.temperature.toFixed(1)}°C`, getTemperatureStatus(latestData.temperature)],
    ['Activity Level', `${latestData.activityLevel}`, getActivityStatus(latestData.activityLevel)],
    ['Device Battery', `${latestData.batteryLevel}%`, getBatteryStatus(latestData.batteryLevel)]
  ];
  
  autoTable(pdf, {
    startY: 50,
    head: [currentMetricsData[0]],
    body: currentMetricsData.slice(1),
    theme: 'grid',
    styles: { fontSize: 12, cellPadding: 5 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 60 },
      2: { cellWidth: 60 }
    }
  });
  
  // Add metric trends section title
  pdf.setFontSize(16);
  pdf.setTextColor(33, 37, 41);
  pdf.text(`${getMetricLabel(metricType)} Trends (Last ${getTimeRangeLabel(timeRange)})`, 20, pdf.lastAutoTable.finalY + 20);
  
  // Metric trends table
  const tableData = chartData.map(item => [item.time, item.value.toString(), getMetricUnit(metricType)]);
  
  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 25,
    head: [['Time', 'Value', 'Unit']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 12, cellPadding: 5 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Add recommendations
  pdf.setFontSize(16);
  pdf.setTextColor(33, 37, 41);
  pdf.text('Health Recommendations', 20, pdf.lastAutoTable.finalY + 20);
  
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  
  const recommendations = getRecommendations(latestData);
  let yPosition = pdf.lastAutoTable.finalY + 30;
  
  recommendations.forEach(recommendation => {
    pdf.text(`• ${recommendation}`, 20, yPosition);
    yPosition += 10;
  });
  
  // Add footer
  const pageCount = pdf.getNumberOfPages();
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.text('HealthcareAI - Patient Monitoring System', 20, pdf.internal.pageSize.height - 10);
    pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.width - 40, pdf.internal.pageSize.height - 10);
  }
  
  return pdf;
};

// Helper functions for status and recommendations
function getHeartRateStatus(rate: number): string {
  if (rate < 60) return 'Low';
  if (rate > 100) return 'High';
  return 'Normal';
}

function getTemperatureStatus(temp: number): string {
  if (temp < 36) return 'Low';
  if (temp > 37.5) return 'High';
  return 'Normal';
}

function getActivityStatus(level: number): string {
  if (level < 30) return 'Low';
  if (level > 70) return 'High';
  return 'Normal';
}

function getBatteryStatus(level: number): string {
  if (level < 20) return 'Low';
  if (level < 50) return 'Medium';
  return 'Good';
}

function getMetricLabel(metricType: string): string {
  switch(metricType) {
    case 'heartRate': return 'Heart Rate';
    case 'temperature': return 'Body Temperature';
    case 'activityLevel': return 'Activity Level';
    case 'batteryLevel': return 'Battery Level';
    default: return 'Metric';
  }
}

function getMetricUnit(metricType: string): string {
  switch(metricType) {
    case 'heartRate': return 'BPM';
    case 'temperature': return '°C';
    case 'activityLevel': return 'level';
    case 'batteryLevel': return '%';
    default: return '';
  }
}

function getTimeRangeLabel(timeRange: string): string {
  switch(timeRange) {
    case '1h': return '1 hour';
    case '12h': return '12 hours';
    case '1d': return '1 day';
    case '7d': return '7 days';
    default: return timeRange;
  }
}

function getRecommendations(latestData: any): string[] {
  const recommendations = [];
  
  if (latestData.heartRate < 60) {
    recommendations.push('Your heart rate is below normal range. Consider increasing physical activity.');
  } else if (latestData.heartRate > 100) {
    recommendations.push('Your heart rate is above normal range. Rest and avoid strenuous activities.');
  }
  
  if (latestData.temperature < 36) {
    recommendations.push('Your body temperature is below normal. Keep warm and monitor for changes.');
  } else if (latestData.temperature > 37.5) {
    recommendations.push('Your body temperature is elevated. Rest and stay hydrated.');
  }
  
  if (latestData.activityLevel < 30) {
    recommendations.push('Your activity level is low. Try to increase daily movement.');
  } else if (latestData.activityLevel > 70) {
    recommendations.push('Your activity level is high. Ensure proper rest between activities.');
  }
  
  if (latestData.batteryLevel < 20) {
    recommendations.push('Device battery is low. Please charge your device soon.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All health metrics are within normal ranges. Keep up the good work!');
  }
  
  return recommendations;
}
