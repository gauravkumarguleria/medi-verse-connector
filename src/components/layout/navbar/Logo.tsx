
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/" className={`flex items-center font-semibold text-xl ${className}`}>
      <AnimatedLogo className="mr-2" />
      MediVerse
    </Link>
  );
};

export default Logo;
