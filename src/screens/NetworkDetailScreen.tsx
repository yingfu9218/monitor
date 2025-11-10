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
import { ArrowLeftIcon, NetworkIcon, ArrowUpIcon, ArrowDownIcon } from '../components/icons';
import { Card } from '../components/ui/Card';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { apiService } from '../services/api';
import { formatNetworkSpeed } from '../utils/format';

interface NetworkDetailScreenProps {
  serverName: string;
  serverId?: string;
  onBack: () => void;
}

interface NetworkInterface {
  id: string;
  name: string;
  type: string;
  uploadSpeed: number;
  downloadSpeed: number;
  totalUpload: number;
  totalDownload: number;
  status: string;
}

export function NetworkDetailScreen({ serverName, serverId, onBack }: NetworkDetailScreenProps) {
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([
    {
      id: '1',
      name: 'eth0',
      type: '以太网',
      uploadSpeed: 5.5,    // MB/s - 后端返回的单位已经是 MB/s
      downloadSpeed: 8.3,  // MB/s
      totalUpload: 1250,   // MB - 后端返回的单位是 MB
      totalDownload: 3480, // MB
      status: 'active',
    },
    {
      id: '2',
      name: 'eth1',
      type: '以太网',
      uploadSpeed: 2.2,    // MB/s
      downloadSpeed: 4.6,  // MB/s
      totalUpload: 680,    // MB
      totalDownload: 1920, // MB
      status: 'active',
    },
    {
      id: '3',
      name: 'lo',
      type: '本地回环',
      uploadSpeed: 0.1,    // MB/s
      downloadSpeed: 0.1,  // MB/s
      totalUpload: 15,     // MB
      totalDownload: 15,   // MB
      status: 'active',
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const fetchNetworkData = async () => {
    if (!serverId) return;

    try {
      const data = await apiService.getNetwork(serverId);
      if (data && data.length > 0) {
        setInterfaces(
          data.map((iface: any) => ({
            id: iface.name,
            name: iface.name,
            type: iface.type || '以太网',
            uploadSpeed: iface.uploadSpeed || 0,
            downloadSpeed: iface.downloadSpeed || 0,
            totalUpload: iface.totalUpload || 0,
            totalDownload: iface.totalDownload || 0,
            status: iface.status || 'active',
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch network data:', error);
      // Keep current static data if fetch fails
    }
  };

  useEffect(() => {
    fetchNetworkData();

    // Auto-refresh every 3 seconds
    const interval = setInterval(() => {
      fetchNetworkData();
    }, 3000);

    return () => clearInterval(interval);
  }, [serverId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNetworkData();
    setRefreshing(false);
  };

  // 移除本地的 formatSpeed 函数，统一使用全局的 formatNetworkSpeed 函数

  const formatTotal = (mb: number) => {
    // 后端返回的总流量单位是 MB
    if (mb >= 1024 * 1024) {
      // >= 1 TB
      return `${(mb / 1024 / 1024).toFixed(2)} TB`;
    } else if (mb >= 1024) {
      // >= 1 GB
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
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
            <Text style={styles.headerTitle}>网络详情</Text>
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
        {interfaces.map((iface) => (
          <Card key={iface.id} style={styles.interfaceCard}>
            <View style={styles.interfaceHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.orange500 + '20' }]}>
                <NetworkIcon size={24} color={colors.orange500} />
              </View>
              <View style={styles.interfaceInfo}>
                <Text style={styles.interfaceName}>{iface.name}</Text>
                <Text style={styles.interfaceType}>{iface.type}</Text>
              </View>
            </View>

            <View style={styles.speedGrid}>
              <View style={[styles.speedCard, { backgroundColor: colors.success + '10' }]}>
                <View style={styles.speedHeader}>
                  <ArrowDownIcon size={16} color={colors.success} />
                  <Text style={[styles.speedLabel, { color: colors.success }]}>下行速度</Text>
                </View>
                <Text style={styles.speedValue}>{formatNetworkSpeed(iface.downloadSpeed)}</Text>
              </View>

              <View style={[styles.speedCard, { backgroundColor: colors.blue500 + '10' }]}>
                <View style={styles.speedHeader}>
                  <ArrowUpIcon size={16} color={colors.blue500} />
                  <Text style={[styles.speedLabel, { color: colors.blue500 }]}>上行速度</Text>
                </View>
                <Text style={styles.speedValue}>{formatNetworkSpeed(iface.uploadSpeed)}</Text>
              </View>
            </View>

            <View style={styles.trafficInfo}>
              <View style={styles.trafficRow}>
                <Text style={styles.trafficLabel}>总下载流量</Text>
                <Text style={styles.trafficValue}>{formatTotal(iface.totalDownload)}</Text>
              </View>
              <View style={styles.trafficRow}>
                <Text style={styles.trafficLabel}>总上传流量</Text>
                <Text style={styles.trafficValue}>{formatTotal(iface.totalUpload)}</Text>
              </View>
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
  interfaceCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  interfaceHeader: {
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
  interfaceInfo: {
    flex: 1,
  },
  interfaceName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  interfaceType: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  speedGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  speedCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  speedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  speedLabel: {
    fontSize: fontSize.xs,
  },
  speedValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  trafficInfo: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  trafficRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  trafficLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  trafficValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
});
