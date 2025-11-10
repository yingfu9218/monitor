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
import { ArrowLeftIcon, CpuIcon, ActivityIcon } from '../components/icons';
import { Card } from '../components/ui/Card';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { apiService } from '../services/api';

interface ProcessListScreenProps {
  serverName: string;
  serverId?: string;
  onBack: () => void;
}

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user: string;
  status: string;
}

export function ProcessListScreen({ serverName, serverId, onBack }: ProcessListScreenProps) {
  const [processes, setProcesses] = useState<Process[]>([
    { pid: 1234, name: 'nginx', cpu: 45.2, memory: 12.5, user: 'root', status: 'running' },
    { pid: 5678, name: 'mysql', cpu: 32.8, memory: 35.6, user: 'mysql', status: 'running' },
    { pid: 9012, name: 'node', cpu: 28.5, memory: 18.3, user: 'www', status: 'running' },
    { pid: 3456, name: 'redis-server', cpu: 15.7, memory: 8.2, user: 'redis', status: 'running' },
    { pid: 7890, name: 'php-fpm', cpu: 12.3, memory: 22.1, user: 'www', status: 'running' },
    { pid: 2345, name: 'python', cpu: 10.5, memory: 15.8, user: 'root', status: 'running' },
    { pid: 6789, name: 'apache2', cpu: 8.9, memory: 9.5, user: 'www', status: 'running' },
    { pid: 1357, name: 'mongod', cpu: 7.2, memory: 28.4, user: 'mongodb', status: 'running' },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const fetchProcessData = async () => {
    if (!serverId) return;

    try {
      const data = await apiService.getProcesses(serverId, 'cpu', 20);
      if (data && data.length > 0) {
        setProcesses(data);
      }
    } catch (error) {
      console.error('Failed to fetch process data:', error);
      // Keep current static data if fetch fails
    }
  };

  useEffect(() => {
    fetchProcessData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchProcessData();
    }, 5000);

    return () => clearInterval(interval);
  }, [serverId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProcessData();
    setRefreshing(false);
  };

  const sortedProcesses = [...processes].sort((a, b) => b.cpu - a.cpu);

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
            <Text style={styles.headerTitle}>进程管理</Text>
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
        <Text style={styles.sortInfo}>
          按 CPU 使用率排序，显示占用最高的进程
        </Text>

        {sortedProcesses.map((process) => (
          <Card key={process.pid} style={styles.processCard}>
            <View style={styles.processHeader}>
              <View style={styles.processInfo}>
                <Text style={styles.processName}>{process.name}</Text>
                <Text style={styles.processPid}>PID: {process.pid}</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: colors.blue500 + '10' }]}>
                <View style={styles.metricContent}>
                  <CpuIcon size={20} color={colors.blue500} />
                  <View style={styles.metricInfo}>
                    <Text style={[styles.metricLabel, { color: colors.blue500 }]}>CPU</Text>
                    <Text style={styles.metricValue}>{process.cpu.toFixed(1)}%</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.metricCard, { backgroundColor: colors.green500 + '10' }]}>
                <View style={styles.metricContent}>
                  <ActivityIcon size={20} color={colors.green500} />
                  <View style={styles.metricInfo}>
                    <Text style={[styles.metricLabel, { color: colors.green500 }]}>内存</Text>
                    <Text style={styles.metricValue}>{process.memory.toFixed(1)}%</Text>
                  </View>
                </View>
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
  sortInfo: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  processCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  processHeader: {
    marginBottom: spacing.md,
  },
  processInfo: {
    flex: 1,
  },
  processName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  processPid: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
