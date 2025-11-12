import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, HardDriveIcon } from '../components/icons';
import { Card } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { apiService } from '../services/api';

interface DiskDetailScreenProps {
  serverName: string;
  serverId?: string;
  onBack: () => void;
}

interface Disk {
  id: string;
  name: string;
  mountPoint: string;
  fsType: string;
  totalSize: number;
  usedSize: number;
  availableSize: number;
  usagePercent: number;
}

export function DiskDetailScreen({ serverName, serverId, onBack }: DiskDetailScreenProps) {
  const [disks, setDisks] = useState<Disk[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const fetchDiskData = async () => {
    if (!serverId) return;

    try {
      const data = await apiService.getDisks(serverId);
      if (data && data.length > 0) {
        // Add id field for each disk (using name as unique key)
        const disksWithId = data.map((disk: any, index: number) => ({
          ...disk,
          id: disk.name || `disk-${index}`,
        }));
        setDisks(disksWithId);
      }
    } catch (error) {
      console.error('Failed to fetch disk data:', error);
      setDisks([]);
    }
  };

  useEffect(() => {
    fetchDiskData();
  }, [serverId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDiskData();
    setRefreshing(false);
  };

  const formatSize = (mb: number) => {
    // 后端返回的是 MB
    if (mb >= 1024 * 1024) {
      // >= 1 TB
      return `${(mb / 1024 / 1024).toFixed(2)} TB`;
    } else if (mb >= 1024) {
      // >= 1 GB
      return `${(mb / 1024).toFixed(2)} GB`;
    } else {
      // < 1 GB
      return `${mb.toFixed(2)} MB`;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>磁盘详情</Text>
            <Text style={styles.headerSubtitle}>{serverName}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {disks.map((disk) => (
          <Card key={disk.id} style={styles.diskCard}>
            <View style={styles.diskHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <HardDriveIcon size={24} color={colors.primary} />
              </View>
              <View style={styles.diskInfo}>
                <Text style={styles.diskName}>{disk.name}</Text>
                <Text style={styles.diskMount}>挂载点: {disk.mountPoint}</Text>
              </View>
            </View>

            <View style={styles.diskStats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>总大小</Text>
                <Text style={styles.statValue}>{formatSize(disk.totalSize)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>已使用</Text>
                <Text style={styles.statValue}>{formatSize(disk.usedSize)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>剩余空间</Text>
                <Text style={styles.statValue}>{formatSize(disk.availableSize)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>文件系统</Text>
                <Text style={styles.statValue}>{disk.fsType}</Text>
              </View>
            </View>

            <View style={styles.usageSection}>
              <View style={styles.usageHeader}>
                <Text style={styles.usageLabel}>使用率</Text>
                <Text style={styles.usageValue}>{disk.usagePercent.toFixed(2)}%</Text>
              </View>
              <Progress value={disk.usagePercent} style={styles.progressBar} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  diskCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  diskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diskInfo: {
    flex: 1,
  },
  diskName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  diskMount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  diskStats: {
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  usageSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  usageLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  usageValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressBar: {
    height: 8,
  },
});
