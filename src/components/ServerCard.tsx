import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CpuIcon, ActivityIcon, ArrowUpIcon, ArrowDownIcon, ChevronRightIcon } from './icons';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Server } from '../types';
import { colors, spacing, fontSize } from '../utils/theme';
import { formatNetworkSpeed } from '../utils/format';

interface ServerCardProps {
  server: Server;
  onPress: () => void;
}

export function ServerCard({ server, onPress }: ServerCardProps) {
  // 直接使用服务器的实时数据，不使用随机数
  const stats = {
    cpu: server.currentMetrics?.cpu || 0,
    memory: server.currentMetrics?.memory || 0,
    upload: server.currentMetrics?.upload || 0,     // MB/s
    download: server.currentMetrics?.download || 0, // MB/s
  };

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'offline':
        return colors.error;
    }
  };

  const getStatusText = (status: Server['status']) => {
    switch (status) {
      case 'online':
        return '正常';
      case 'warning':
        return '警告';
      case 'offline':
        return '离线';
    }
  };

  const getStatusVariant = (status: Server['status']) => {
    switch (status) {
      case 'online':
        return 'success' as const;
      case 'warning':
        return 'secondary' as const;
      case 'offline':
        return 'destructive' as const;
    }
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{server.name}</Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(server.status) },
              ]}
            />
          </View>
          <Text style={styles.subtitle}>{server.ip}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{server.os}</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.metaText}>{server.location}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Badge variant={getStatusVariant(server.status)}>
            {getStatusText(server.status)}
          </Badge>
          <ChevronRightIcon size={20} color={colors.slate400} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.stats}>
        <View style={styles.stat}>
          <CpuIcon size={20} color={colors.blue500} />
          <Text style={styles.statValue}>{stats.cpu.toFixed(2)}%</Text>
        </View>
        <View style={styles.stat}>
          <ActivityIcon size={20} color={colors.green500} />
          <Text style={styles.statValue}>{stats.memory.toFixed(2)}%</Text>
        </View>
        <View style={styles.stat}>
          <View style={styles.networkStats}>
            <View style={styles.networkItem}>
              <ArrowUpIcon size={12} color={colors.error} />
              <Text style={styles.networkValue}>{formatNetworkSpeed(stats.upload)}</Text>
            </View>
            <View style={styles.networkItem}>
              <ArrowDownIcon size={12} color={colors.success} />
              <Text style={styles.networkValue}>{formatNetworkSpeed(stats.download)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  metaSeparator: {
    fontSize: fontSize.xs,
    color: colors.slate400,
  },
  divider: {
    height: 1,
    backgroundColor: colors.slate100,
    marginVertical: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  networkStats: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  networkValue: {
    fontSize: fontSize.xs - 1,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
