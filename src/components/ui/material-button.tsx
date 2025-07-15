import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface MaterialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

const MaterialButton = forwardRef<HTMLButtonElement, MaterialButtonProps>(
  ({ className, variant = 'primary', size = 'md', elevated = true, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'relative overflow-hidden font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          'before:content-[""] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:bg-white/20 before:rounded-full before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:transition-all before:duration-300',
          'active:before:w-72 active:before:h-72',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary': variant === 'secondary',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive': variant === 'destructive',
            'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'px-3 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
            'shadow-md hover:shadow-lg': elevated,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MaterialButton.displayName = 'MaterialButton';

export { MaterialButton };
