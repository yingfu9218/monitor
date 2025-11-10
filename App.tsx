import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, StyleSheet, View, useColorScheme, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ServerListScreen } from './src/screens/ServerListScreen';
import { ServerDetailScreen } from './src/screens/ServerDetailScreen';
import { NetworkDetailScreen } from './src/screens/NetworkDetailScreen';
import { DiskDetailScreen } from './src/screens/DiskDetailScreen';
import { ProcessListScreen } from './src/screens/ProcessListScreen';
import { SettingsDialog } from './src/components/SettingsDialog';
import { Server, AppSettings } from './src/types';
import { apiService } from './src/services/api';
import { loadSettings, saveSettings } from './src/services/storage';

type ViewType = 'list' | 'detail' | 'network' | 'disk' | 'process';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [settingsDialogVisible, setSettingsDialogVisible] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    apiUrl: 'http://localhost',
    apiPort: '8080',
    apiKey: '',
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // 加载保存的设置
  useEffect(() => {
    const initSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    initSettings();
  }, []);

  // 配置 API 服务并获取数据
  useEffect(() => {
    if (isLoadingSettings) {
      return; // 等待设置加载完成
    }

    if (settings.apiUrl && settings.apiPort) {
      apiService.configure(settings.apiUrl, settings.apiPort, settings.apiKey);
      fetchServers();

      // 设置自动刷新，每5秒刷新一次服务器列表
      const interval = setInterval(() => {
        fetchServers();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [settings, isLoadingSettings]);

  const fetchServers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getServers();
      setServers(data);
    } catch (err) {
      console.error('Failed to fetch servers:', err);
      setError('无法连接到服务器，请检查API设置');
      // 如果获取失败，使用静态数据作为后备
      setServers([
        {
          id: 'demo-1',
          name: '演示服务器 01',
          ip: '192.168.1.100',
          status: 'online',
          os: 'Ubuntu 22.04',
          location: '北京',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Android back button
  const handleBackPress = useCallback(() => {
    if (currentView === 'network' || currentView === 'disk' || currentView === 'process') {
      // From sub-detail views, go back to detail
      setCurrentView('detail');
      return true;
    } else if (currentView === 'detail') {
      // From detail, go back to list
      handleBackToList();
      return true;
    }
    // On list view, allow app to exit
    return false;
  }, [currentView, handleBackToList]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const handleSaveSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      // 保存到本地存储
      await saveSettings(newSettings);
      // 更新状态
      setSettings(newSettings);
      // 重新配置 API 服务
      apiService.configure(newSettings.apiUrl, newSettings.apiPort, newSettings.apiKey);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, []);

  const handleSelectServer = useCallback((id: string) => {
    setSelectedServerId(id);
    setCurrentView('detail');
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentView('list');
    setSelectedServerId(null);
  }, []);

  const handleSettings = useCallback(() => {
    setSettingsDialogVisible(true);
  }, []);

  const handleNetworkDetail = useCallback(() => {
    setCurrentView('network');
  }, []);

  const handleDiskDetail = useCallback(() => {
    setCurrentView('disk');
  }, []);

  const handleProcessList = useCallback(() => {
    setCurrentView('process');
  }, []);

  const handleBackToDetail = useCallback(() => {
    setCurrentView('detail');
  }, []);

  const selectedServer = servers.find(s => s.id === selectedServerId);

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return (
          <ServerListScreen
            servers={servers}
            onSelectServer={handleSelectServer}
            onSettings={handleSettings}
          />
        );
      case 'detail':
        return selectedServer ? (
          <ServerDetailScreen
            server={selectedServer}
            onBack={handleBackToList}
            onNetworkDetail={handleNetworkDetail}
            onDiskDetail={handleDiskDetail}
            onProcessList={handleProcessList}
          />
        ) : null;
      case 'network':
        return selectedServer ? (
          <NetworkDetailScreen
            serverName={selectedServer.name}
            serverId={selectedServer.id}
            onBack={handleBackToDetail}
          />
        ) : null;
      case 'disk':
        return selectedServer ? (
          <DiskDetailScreen
            serverName={selectedServer.name}
            serverId={selectedServer.id}
            onBack={handleBackToDetail}
          />
        ) : null;
      case 'process':
        return selectedServer ? (
          <ProcessListScreen
            serverName={selectedServer.name}
            serverId={selectedServer.id}
            onBack={handleBackToDetail}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {renderView()}
        <SettingsDialog
          visible={settingsDialogVisible}
          onClose={() => setSettingsDialogVisible(false)}
          settings={settings}
          onSave={handleSaveSettings}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
