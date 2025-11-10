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
import {
  ArrowLeftIcon,
  RefreshIcon,
  CpuIcon,
  ActivityIcon,
  NetworkIcon,
  HardDriveIcon,
  ChevronRightIcon,
  ListOrderedIcon,
} from '../components/icons';
import { Card } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Tabs } from '../components/ui/Tabs';
import { MetricsChart } from '../components/MetricsChart';
import { Server } from '../types';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { apiService } from '../services/api';
import {
  formatCpuUsage,
  formatMemoryUsage,
  formatNetworkSpeed,
  formatDiskIOSpeed,
} from '../utils/format';

interface ServerDetailScreenProps {
  server: Server;
  onBack: () => void;
  onDiskDetail?: () => void;
  onProcessList?: () => void;
  onNetworkDetail?: () => void;
}

interface Metrics {
  cpu: number;
  memory: number;
  diskRead: number;
  diskWrite: number;
  networkIn: number;
  networkOut: number;
}

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days} 天 ${hours} 小时`;
};

export function ServerDetailScreen({
  server,
  onBack,
  onDiskDetail,
  onProcessList,
  onNetworkDetail,
}: ServerDetailScreenProps) {
  const [metrics, setMetrics] = useState<Metrics>({
    cpu: 45,
    memory: 62,
    diskRead: 25,
    diskWrite: 18,
    networkIn: 120,
    networkOut: 85,
  });

  const [history, setHistory] = useState<Array<Metrics & { time: string }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [serverDetail, setServerDetail] = useState<any>(null);

  const fetchServerData = async () => {
    try {
      // Fetch server detail
      const detail = await apiService.getServerDetail(server.id);
      setServerDetail(detail);

      if (detail.metrics) {
        setMetrics({
          cpu: detail.metrics.cpu || 0,
          memory: detail.metrics.memory || 0,
          diskRead: detail.metrics.diskRead || 0,
          diskWrite: detail.metrics.diskWrite || 0,
          networkIn: detail.metrics.networkIn || 0,
          networkOut: detail.metrics.networkOut || 0,
        });
      }

      // Fetch history data
      const historyData = await apiService.getServerHistory(server.id, '20m');
      if (historyData && historyData.length > 0) {
        const formattedHistory = historyData.map((point: any) => ({
          time: new Date(point.timestamp).toLocaleTimeString(),
          cpu: point.cpu || 0,
          memory: point.memory || 0,
          diskRead: point.diskRead || 0,
          diskWrite: point.diskWrite || 0,
          networkIn: point.networkIn || 0,
          networkOut: point.networkOut || 0,
        }));
        setHistory(formattedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch server data:', error);
      // Use fallback static data
      const initialHistory = Array.from({ length: 20 }, (_, i) => ({
        time: `${19 - i}m`,
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 40) + 30,
        diskRead: Math.floor(Math.random() * 50) + 10,
        diskWrite: Math.floor(Math.random() * 40) + 10,
        networkIn: Math.floor(Math.random() * 100) + 50,
        networkOut: Math.floor(Math.random() * 100) + 30,
      }));
      setHistory(initialHistory);
    }
  };

  useEffect(() => {
    fetchServerData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchServerData();
    }, 5000);

    return () => clearInterval(interval);
  }, [server.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServerData();
    setRefreshing(false);
  };

  const tabs = [
    {
      value: 'cpu',
      label: 'CPU',
      content: (
        <MetricsChart
          data={history}
          dataKey="cpu"
          color={colors.blue500}
          label="CPU 使用率"
          unit="%"
        />
      ),
    },
    {
      value: 'memory',
      label: '内存',
      content: (
        <MetricsChart
          data={history}
          dataKey="memory"
          color={colors.green500}
          label="内存使用率"
          unit="%"
        />
      ),
    },
    {
      value: 'disk',
      label: '磁盘IO',
      content: (
        <MetricsChart
          data={history}
          dataKey="diskRead"
          dataKey2="diskWrite"
          color={colors.primary}
          color2={colors.orange500}
          label="磁盘 I/O"
          unit="MB/s"
        />
      ),
    },
    {
      value: 'network',
      label: '网络',
      content: (
        <MetricsChart
          data={history}
          dataKey="networkIn"
          dataKey2="networkOut"
          color={colors.success}
          color2={colors.error}
          label="网络流量"
          unit="MB/s"
        />
      ),
    },
  ];

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
            <Text style={styles.headerTitle}>{server.name}</Text>
            <Text style={styles.headerSubtitle}>{server.ip}</Text>
            <View style={styles.headerMeta}>
              <Text style={styles.headerMetaText}>{server.os}</Text>
              <Text style={styles.headerMetaSeparator}>•</Text>
              <Text style={styles.headerMetaText}>{server.location}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            activeOpacity={0.7}
          >
            <RefreshIcon size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          {/* CPU Card */}
          <Card style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIcon, { backgroundColor: colors.blue500 + '20' }]}>
                <CpuIcon size={20} color={colors.blue500} />
              </View>
              <View style={styles.statCardInfo}>
                <Text style={styles.statLabel}>CPU</Text>
                <Text style={styles.statValue}>{formatCpuUsage(metrics.cpu)}</Text>
              </View>
            </View>
            <Progress value={metrics.cpu} style={styles.statProgress} />
          </Card>

          {/* Memory Card */}
          <Card style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIcon, { backgroundColor: colors.green500 + '20' }]}>
                <ActivityIcon size={20} color={colors.green500} />
              </View>
              <View style={styles.statCardInfo}>
                <Text style={styles.statLabel}>内存</Text>
                <Text style={styles.statValue}>{formatMemoryUsage(metrics.memory)}</Text>
              </View>
            </View>
            <Progress value={metrics.memory} style={styles.statProgress} />
          </Card>

          {/* Network Card */}
          <Card
            style={[styles.statCard, styles.clickableCard]}
            onPress={onNetworkDetail}
          >
            <View style={styles.statCardHeader}>
              <View style={[styles.statIcon, { backgroundColor: colors.orange500 + '20' }]}>
                <NetworkIcon size={20} color={colors.orange500} />
              </View>
              <View style={styles.statCardInfo}>
                <Text style={styles.statLabel}>网络</Text>
                <Text style={styles.statValueSmall}>
                  ↓{formatNetworkSpeed(metrics.networkIn)} ↑{formatNetworkSpeed(metrics.networkOut)}
                </Text>
              </View>
              <ChevronRightIcon size={20} color={colors.slate400} />
            </View>
            <View style={styles.networkBars}>
              <View
                style={[
                  styles.networkBar,
                  { backgroundColor: colors.orange500, width: `${metrics.networkIn / 2}%` },
                ]}
              />
              <View
                style={[
                  styles.networkBar,
                  { backgroundColor: '#fdba74', width: `${metrics.networkOut / 2}%` },
                ]}
              />
            </View>
          </Card>

          {/* Disk Card */}
          <Card
            style={[styles.statCard, styles.clickableCard]}
            onPress={onDiskDetail}
          >
            <View style={styles.statCardHeader}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
                <HardDriveIcon size={20} color={colors.primary} />
              </View>
              <View style={styles.statCardInfo}>
                <Text style={styles.statLabel}>磁盘</Text>
                <Text style={styles.statValueSmall}>读 {formatDiskIOSpeed(metrics.diskRead)}</Text>
                <Text style={styles.statValueSmall}>写 {formatDiskIOSpeed(metrics.diskWrite)}</Text>
              </View>
              <ChevronRightIcon size={20} color={colors.slate400} />
            </View>
            <View style={styles.networkBars}>
              <View
                style={[
                  styles.networkBar,
                  { backgroundColor: colors.primary, width: `${metrics.diskRead}%` },
                ]}
              />
              <View
                style={[
                  styles.networkBar,
                  { backgroundColor: '#93c5fd', width: `${metrics.diskWrite}%` },
                ]}
              />
            </View>
          </Card>
        </View>

        {/* Process Management Entry */}
        <Card
          style={[styles.processCard, styles.clickableCard]}
          onPress={onProcessList}
        >
          <View style={styles.processCardContent}>
            <View style={styles.processCardLeft}>
              <View style={[styles.statIcon, { backgroundColor: colors.blue500 + '20' }]}>
                <ListOrderedIcon size={20} color={colors.blue500} />
              </View>
              <View>
                <Text style={styles.processTitle}>进程管理</Text>
                <Text style={styles.processSubtitle}>查看运行中的进程</Text>
              </View>
            </View>
            <ChevronRightIcon size={20} color={colors.slate400} />
          </View>
        </Card>

        {/* Charts */}
        <Card style={styles.chartCard}>
          <Tabs tabs={tabs} defaultValue="cpu" />
        </Card>

        {/* Detailed Info */}
        {serverDetail?.info && (
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>详细信息</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>CPU 核心数</Text>
                <Text style={styles.infoValue}>
                  {serverDetail.info.cpuCores || 'N/A'} 核
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>总内存</Text>
                <Text style={styles.infoValue}>
                  {serverDetail.info.totalMemory
                    ? `${(serverDetail.info.totalMemory / 1024).toFixed(2)} GB`
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>已用内存</Text>
                <Text style={styles.infoValue}>
                  {serverDetail.info.usedMemory
                    ? `${(serverDetail.info.usedMemory / 1024).toFixed(2)} GB`
                    : 'N/A'}
                </Text>
              </View>
              <View style={[styles.infoItem, styles.infoItemLast]}>
                <Text style={styles.infoLabel}>运行时间</Text>
                <Text style={styles.infoValue}>
                  {serverDetail.info.uptime
                    ? formatUptime(serverDetail.info.uptime)
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </Card>
        )}
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
    alignItems: 'flex-start',
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
    marginTop: 4,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
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
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  headerMetaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  headerMetaSeparator: {
    fontSize: fontSize.xs,
    color: colors.slate400,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: '48%',
    padding: spacing.lg,
  },
  clickableCard: {
    cursor: 'pointer',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statValueSmall: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
  },
  statProgress: {
    height: 8,
  },
  networkBars: {
    flexDirection: 'row',
    gap: 4,
    height: 8,
  },
  networkBar: {
    height: 8,
    borderRadius: 4,
  },
  processCard: {
    padding: spacing.lg,
  },
  processCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  processCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  processTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  processSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  chartCard: {
    padding: spacing.lg,
  },
  infoCard: {
    padding: spacing.lg,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  infoList: {
    gap: 0,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  infoItemLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
});
