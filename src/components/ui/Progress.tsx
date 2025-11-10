import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../../utils/theme';

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  style?: ViewStyle;
}

export function Progress({ value, max = 100, color, style }: ProgressProps) {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;

  const getColor = () => {
    if (color) return color;
    if (percentage >= 80) return colors.error;
    if (percentage >= 60) return colors.warning;
    return colors.primary;
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${percentage}%`,
            backgroundColor: getColor(),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 8,
    backgroundColor: colors.slate100,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
});
