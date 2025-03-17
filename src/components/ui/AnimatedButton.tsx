
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  shine?: boolean;
  href?: string;
}

const AnimatedButton = ({
  children,
  className,
  variant = 'default',
  size = 'default',
  onClick,
  disabled = false,
  type = 'button',
  shine = true,
  href,
}: AnimatedButtonProps) => {
  const content = (
    <Button
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-in-out active:scale-[0.98]',
        shine && 'group',
        className
      )}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
      asChild={!!href}
    >
      <>
        {children}
        {shine && (
          <div className="absolute inset-0 z-0 h-full translate-x-[-100%] transform bg-shine bg-[length:200%_100%] opacity-0 transition-all duration-1000 group-hover:translate-x-[100%] group-hover:opacity-30 group-hover:duration-1000" />
        )}
      </>
    </Button>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
};

export default AnimatedButton;
