import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { AppSettings } from '../types';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

interface SettingsDialogProps {
  visible: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export function SettingsDialog({
  visible,
  onClose,
  settings,
  onSave,
}: SettingsDialogProps) {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [errors, setErrors] = useState<Partial<Record<keyof AppSettings, string>>>({});

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AppSettings, string>> = {};

    if (!formData.apiUrl.trim()) {
      newErrors.apiUrl = '请输入接口地址';
    }

    if (!formData.apiPort.trim()) {
      newErrors.apiPort = '请输入端口';
    } else if (!/^\d+$/.test(formData.apiPort)) {
      newErrors.apiPort = '端口必须是数字';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData(settings);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        />
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.dialogContainer}>
            <View style={styles.dialog}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>API设置</Text>
                <Text style={styles.description}>配置API服务器接口信息</Text>
              </View>

              {/* Form */}
              <ScrollView
                style={styles.formContainer}
                showsVerticalScrollIndicator={false}
              >
                <Input
                  label="接口地址 *"
                  placeholder="例如：http://localhost"
                  value={formData.apiUrl}
                  onChangeText={(text) => {
                    setFormData({ ...formData, apiUrl: text });
                    if (errors.apiUrl) {
                      setErrors({ ...errors, apiUrl: undefined });
                    }
                  }}
                  error={errors.apiUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Input
                  label="端口 *"
                  placeholder="例如：8080"
                  value={formData.apiPort}
                  onChangeText={(text) => {
                    setFormData({ ...formData, apiPort: text });
                    if (errors.apiPort) {
                      setErrors({ ...errors, apiPort: undefined });
                    }
                  }}
                  error={errors.apiPort}
                  keyboardType="number-pad"
                />

                <Input
                  label="认证秘钥"
                  placeholder="输入API秘钥（可选）"
                  value={formData.apiKey}
                  onChangeText={(text) =>
                    setFormData({ ...formData, apiKey: text })
                  }
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </ScrollView>

              {/* Footer Buttons */}
              <View style={styles.footer}>
                <Button
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.button}
                >
                  取消
                </Button>
                <Button onPress={handleSubmit} style={styles.button}>
                  保存
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '90%',
    maxWidth: 400,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  formContainer: {
    maxHeight: 400,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    height: 48,
  },
});
