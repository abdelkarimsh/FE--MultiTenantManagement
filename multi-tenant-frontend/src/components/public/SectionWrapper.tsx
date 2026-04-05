import type { FC, ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  muted?: boolean;
  narrow?: boolean;
  className?: string;
}

const SectionWrapper: FC<SectionWrapperProps> = ({
  children,
  title,
  subtitle,
  muted = false,
  narrow = false,
  className = '',
}) => {
  return (
    <section className={`public-section${muted ? ' public-section-muted' : ''} ${className}`.trim()}>
      <div className={`public-container${narrow ? ' public-narrow' : ''}`}>
        {(title || subtitle) && (
          <div className="public-section-head">
            {title && <h2 className="public-section-title">{title}</h2>}
            {subtitle && <p className="public-section-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
