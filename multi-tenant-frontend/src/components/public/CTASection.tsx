import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface CTASectionProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel: string;
  secondaryTo: string;
}

const CTASection: FC<CTASectionProps> = ({
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}) => {
  return (
    <section className="public-section">
      <div className="public-container">
        <div className="public-cta">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="public-actions">
            <Link className="public-btn public-btn-primary" to={primaryTo}>
              {primaryLabel}
            </Link>
            <Link className="public-btn public-btn-secondary" to={secondaryTo}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
