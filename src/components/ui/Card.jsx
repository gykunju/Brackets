import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Modern Card Component
 * Flexible container with variants and hover effects
 */
const Card = forwardRef(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default:
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      elevated:
        'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow',
      gradient:
        'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700',
      glass:
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50',
    };

    const hoverEffect = hover
      ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl overflow-hidden',
          variants[variant],
          hoverEffect,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pb-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-400 mt-2', className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-4 border-t border-gray-200 dark:border-gray-700', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
