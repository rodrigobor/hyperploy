import React from 'react';

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`bg-hl-dark-mid rounded-xl p-6 shadow-card border border-hl-accent/10 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
