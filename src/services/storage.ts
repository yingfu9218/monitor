import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

const STORAGE_KEYS = {
  SETTINGS: '@monitor_app_settings',
};

const DEFAULT_SETTINGS: AppSettings = {
  apiUrl: 'http://localhost',
  apiPort: '8080',
  apiKey: '',
};

/**
 * 保存应用设置
 */
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
};

/**
 * 加载应用设置
 */
export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * 清除应用设置
 */
export const clearSettings = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error('Failed to clear settings:', error);
    throw error;
  }
};
