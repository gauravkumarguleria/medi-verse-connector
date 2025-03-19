
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  active: boolean;
}

interface NavItemsProps {
  items: NavItem[];
  className?: string;
  itemClassName?: string;
}

const NavItems: React.FC<NavItemsProps> = ({ 
  items, 
  className,
  itemClassName,
}) => {
  return (
    <nav className={cn("flex", className)}>
      {items.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            item.active ? "text-primary" : "text-muted-foreground",
            itemClassName
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
