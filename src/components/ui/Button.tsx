import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../utils/theme';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  onPress,
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`${variant}Container` as keyof typeof styles] as ViewStyle,
    styles[`${size}Container` as keyof typeof styles] as ViewStyle,
    disabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
    textStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={containerStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'default' ? colors.surface : colors.primary}
          size="small"
        />
      ) : typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  // Container variants
  defaultContainer: {
    backgroundColor: colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.slate200,
  },
  destructiveContainer: {
    backgroundColor: colors.error,
  },
  // Container sizes
  defaultContainerSize: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  smContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  lgContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
  },
  // Text variants
  text: {
    fontWeight: '600',
  },
  defaultText: {
    color: colors.surface,
    fontSize: fontSize.md,
  },
  ghostText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  outlineText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  destructiveText: {
    color: colors.surface,
    fontSize: fontSize.md,
  },
  // Text sizes
  defaultTextSize: {
    fontSize: fontSize.md,
  },
  smText: {
    fontSize: fontSize.sm,
  },
  lgText: {
    fontSize: fontSize.lg,
  },
  iconText: {
    fontSize: fontSize.md,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
});
