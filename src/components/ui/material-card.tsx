import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface MaterialCardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 1 | 2 | 3 | 4;
  hover?: boolean;
}

const MaterialCard = forwardRef<HTMLDivElement, MaterialCardProps>(
  ({ className, elevation = 1, hover = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'bg-white rounded-lg transition-shadow duration-200',
          {
            'shadow-md': elevation === 1,
            'shadow-lg': elevation === 2,
            'shadow-xl': elevation === 3,
            'shadow-2xl': elevation === 4,
            'hover:shadow-lg': hover && elevation === 1,
            'hover:shadow-xl': hover && elevation === 2,
            'hover:shadow-2xl': hover && elevation >= 3,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MaterialCard.displayName = 'MaterialCard';

export { MaterialCard };
