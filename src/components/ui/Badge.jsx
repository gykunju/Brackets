import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Modern Badge Component
 * For status indicators, labels, and tags
 */
const Badge = forwardRef(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const variants = {
      default:
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      primary:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      secondary:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      success:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      warning:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      danger:
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      outline:
        'border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      default: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-semibold transition-colors',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
