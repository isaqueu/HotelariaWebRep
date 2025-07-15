import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, icon, value, onChange, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value !== undefined && value !== '' && value !== null;

    return (
      <div className="relative">
        <input
          className={cn(
            'peer w-full px-3 pt-6 pb-2 border border-gray-300 rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-colors duration-200',
            'placeholder-transparent',
            icon && 'pr-10',
            className
          )}
          placeholder=" "
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          ref={ref}
          {...props}
        />
        <label
          className={cn(
            'absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none',
            'peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500',
            'peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary',
            (focused || hasValue) && 'top-1 text-xs text-primary'
          )}
        >
          {label}
        </label>
        {icon && (
          <div className="absolute right-3 top-4 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingLabelInput };
