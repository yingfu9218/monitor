import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// CPU 图标
export const CpuIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="9" y="9" width="6" height="6" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M9 2V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M15 2V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M9 20V22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M15 20V22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M20 9H22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M20 14H22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M2 9H4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M2 14H4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Activity 图标（心率）
export const ActivityIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Network 图标
export const NetworkIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="16" y="16" width="6" height="6" rx="1" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="2" y="16" width="6" height="6" rx="1" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="9" y="2" width="6" height="6" rx="1" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 8V13" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 13L19 16" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 13L5 16" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// HardDrive 图标
export const HardDriveIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 12H2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="6" cy="16" r="1" fill={color} />
  </Svg>
);

// Server 图标
export const ServerIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="8" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="2" y="14" width="20" height="8" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M6 6H6.01" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M6 18H6.01" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Settings 图标 (齿轮形状 - 与Figma Make UI一致)
export const SettingsIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// ArrowLeft 图标
export const ArrowLeftIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// RefreshCw 图标
export const RefreshIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ChevronRight 图标
export const ChevronRightIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ListOrdered 图标
export const ListOrderedIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ArrowUp 图标
export const ArrowUpIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 19V5M5 12l7-7 7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ArrowDown 图标
export const ArrowDownIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M19 12l-7 7-7-7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Trash 图标 (删除)
export const TrashIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 11v6M14 11v6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
