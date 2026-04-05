import type { FC, ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description?: string;
  points?: string[];
  icon?: ReactNode;
  className?: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, points, icon, className = '' }) => {
  return (
    <article className={`public-card ${className}`.trim()}>
      {icon && <div className="public-card-icon">{icon}</div>}
      <h3 className="public-card-title">{title}</h3>
      {description && <p>{description}</p>}
      {points && (
        <ul className="public-card-list">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default FeatureCard;
