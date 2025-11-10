import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

// 使用 Unicode 符号作为图标
const iconMap: { [key: string]: string } = {
  // 系统监控
  'cpu': '⚙️',
  'memory': '💾',
  'network': '📡',
  'server': '🖥️',
  'disk': '💿',
  'activity': '📊',

  // 导航
  'chevron-right': '›',
  'chevron-left': '‹',
  'arrow-left': '←',
  'arrow-right': '→',

  // 设置和操作
  'settings': '⚙',
  'refresh': '↻',
  'list': '☰',
  'close': '✕',

  // 状态
  'check': '✓',
  'alert': '⚠',
  'info': 'ℹ',
};

export function Icon({ name, size = 20, color = '#000', style }: IconProps) {
  const icon = iconMap[name] || '•';

  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color,
          lineHeight: size * 1.2,
        },
        style,
      ]}
    >
      {icon}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
