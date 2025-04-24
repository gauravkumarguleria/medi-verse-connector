
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { 
  User, 
  Stethoscope, 
  PillBottle, 
  LayoutDashboard,
  CheckCircle
} from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  className?: string;
  disabled?: boolean; // Added disabled prop
}

interface RoleOption {
  id: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect, className, disabled = false }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles: RoleOption[] = [
    {
      id: 'patient',
      label: 'Patient',
      description: 'Book appointments, track health, buy medicines',
      icon: <User className="h-6 w-6" />,
    },
    {
      id: 'doctor',
      label: 'Doctor',
      description: 'Consult patients, manage prescriptions',
      icon: <Stethoscope className="h-6 w-6" />,
    },
    {
      id: 'pharmacist',
      label: 'Pharmacist',
      description: 'Manage medicines, process orders',
      icon: <PillBottle className="h-6 w-6" />,
    },
    {
      id: 'admin',
      label: 'Admin',
      description: 'Oversee the system, manage users',
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
  ];

  const handleSelect = (role: UserRole) => {
    if (disabled) return; // Don't allow selection if disabled
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className={cn('grid gap-4 md:grid-cols-2', className)}>
      {roles.map((role) => (
        <div
          key={role.id}
          className={cn(
            'relative cursor-pointer rounded-xl p-4 transition-all duration-300',
            'border border-border hover:border-primary/50 hover:shadow-sm',
            selectedRole === role.id 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'bg-white',
            disabled ? 'opacity-60 cursor-not-allowed' : '' // Add styling for disabled state
          )}
          onClick={() => handleSelect(role.id)}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              'rounded-full p-2',
              selectedRole === role.id 
                ? 'bg-primary/10 text-primary' 
                : 'bg-muted text-muted-foreground'
            )}>
              {role.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{role.label}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
            {selectedRole === role.id && (
              <div className="absolute right-4 top-4 text-primary">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleSelector;
