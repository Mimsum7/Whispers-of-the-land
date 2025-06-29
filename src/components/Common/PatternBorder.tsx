import React from 'react';

interface PatternBorderProps {
  children: React.ReactNode;
  className?: string;
}

const PatternBorder: React.FC<PatternBorderProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-african-pattern opacity-20 rounded-lg"></div>
      <div className="relative bg-cream-50 border-2 border-ochre-300 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default PatternBorder;