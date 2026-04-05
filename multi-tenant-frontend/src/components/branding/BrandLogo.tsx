import type { FC } from 'react';
import logoIcon from '@/assets/Logo Icon.png';
import logoName from '@/assets/Logo Name.png';
import fullLogo from '@/assets/Logo.png';

type BrandLogoVariant = 'icon' | 'icon-text' | 'icon-name' | 'full';
type BrandLogoSize = 'sm' | 'md' | 'lg';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  text?: string;
}

const BrandLogo: FC<BrandLogoProps> = ({
  variant = 'icon-text',
  size = 'md',
  className = '',
  text = 'StoreFlow',
}) => {
  const rootClassName = `brand-logo brand-${variant} size-${size} ${className}`.trim();

  if (variant === 'full') {
    return (
      <span className={rootClassName}>
        <span className="brand-badge">
          <img className="brand-full-image" src={fullLogo} alt={`${text} logo`} />
        </span>
      </span>
    );
  }

  if (variant === 'icon-name') {
    return (
      <span className={rootClassName}>
        <span className="brand-badge">
          <img className="brand-icon-image" src={logoIcon} alt={`${text} icon`} />
        </span>
        <img className="brand-name-image" src={logoName} alt={`${text} name`} />
      </span>
    );
  }

  return (
    <span className={rootClassName}>
      <span className="brand-badge">
        <img className="brand-icon-image" src={logoIcon} alt={`${text} icon`} />
      </span>
      {variant === 'icon-text' && <span className="brand-text">{text}</span>}
    </span>
  );
};

export default BrandLogo;
