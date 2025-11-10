import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../utils/theme';

interface MetricsChartProps {
  data: any[];
  dataKey: string;
  dataKey2?: string;
  color: string;
  color2?: string;
  label: string;
  unit: string;
}

export function MetricsChart({
  data,
  dataKey,
  dataKey2,
  color,
  color2,
}: MetricsChartProps) {
  const screenWidth = Dimensions.get('window').width - 32;

  // 确保至少有一些数据点
  const safeData = data && data.length > 0 ? data : [
    { [dataKey]: 0, [dataKey2 || 'temp']: 0 }
  ];

  // 准备数据
  const labels = safeData.slice(-8).map((_, index) => {
    if (index % 2 === 0) return `${8 - index}m`;
    return '';
  }).reverse();

  let values = safeData.slice(-8).map(item => Number(item[dataKey]) || 0).reverse();
  let values2 = dataKey2 ? safeData.slice(-8).map(item => Number(item[dataKey2]) || 0).reverse() : null;

  // 确保至少有2个数据点（图表库要求）
  if (values.length < 2) {
    values = [0, 0];
  }
  if (values2 && values2.length < 2) {
    values2 = [0, 0];
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => color + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      },
      ...(values2 ? [{
        data: values2,
        color: (opacity = 1) => (color2 || color) + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      }] : []),
    ],
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={200}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 1,
          color: (opacity = 1) => colors.slate400 + Math.round(opacity * 255).toString(16).padStart(2, '0'),
          labelColor: (opacity = 1) => colors.slate500 + Math.round(opacity * 255).toString(16).padStart(2, '0'),
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '0',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.slate200,
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
