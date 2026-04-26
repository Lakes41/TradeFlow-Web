import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'size' | 'strokeWidth'> {
  icon: LucideIcon;
  /**
   * Icon size in pixels
   * @default 20
   */
  size?: number;
  /**
   * Stroke width for the icon
   * @default 1.5
   */
  strokeWidth?: number;
  /**
   * Whether this icon is in a dense area (like tables)
   * Automatically sets size to 16 if true
   * @default false
   */
  dense?: boolean;
}

/**
 * Standardized Icon wrapper component for consistent icon rendering across the application.
 * 
 * Default props:
 * - size: 20 (for normal text flow)
 * - strokeWidth: 1.5
 * 
 * For dense areas (tables, compact UI), use the `dense` prop to automatically set size to 16.
 * 
 * @example
 * <Icon icon={Wallet} />
 * <Icon icon={Search} dense />
 * <Icon icon={Settings} size={24} strokeWidth={2} /> // Override when absolutely necessary
 */
export default function Icon({
  icon: IconComponent,
  size = 20,
  strokeWidth = 1.5,
  dense = false,
  className = '',
  ...props
}: IconProps) {
  const finalSize = dense ? 16 : size;

  return (
    <IconComponent
      size={finalSize}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
