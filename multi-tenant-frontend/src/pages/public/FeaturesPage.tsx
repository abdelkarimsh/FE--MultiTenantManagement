import type { FC } from 'react';
import CTASection from '../../components/public/CTASection';
import FeatureCard from '../../components/public/FeatureCard';
import SectionWrapper from '../../components/public/SectionWrapper';
import { ROUTES } from '../../router/routes';

const featureGroups = [
  {
    icon: 'P',
    title: 'Product Management',
    points: [
      'Add and edit products easily',
      'Organize categories',
      'Control product visibility',
    ],
  },
  {
    icon: 'O',
    title: 'Order Management',
    points: [
      'View all orders in one place',
      'Track order status',
      'Manage workflow easily',
    ],
  },
  {
    icon: 'T',
    title: 'Team & Access Control',
    points: ['Add team members', 'Control permissions', 'Manage roles easily'],
  },
  {
    icon: 'D',
    title: 'Dashboard & Insights',
    points: ['Monitor operations', 'Track activity', 'Get quick insights'],
  },
  {
    icon: 'S',
    title: 'Security',
    points: ['Secure login system', 'Controlled access', 'Safe data management'],
  },
];

const FeaturesPage: FC = () => {
  return (
    <>
      <section className="public-page-header">
        <div className="public-container public-narrow">
          <p className="public-eyebrow">Features</p>
          <h1>Powerful Features to Run Your Store</h1>
          <p>
            Built to help business teams stay organized, save time, and manage store operations
            with confidence.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="public-grid public-grid-3">
          {featureGroups.map((group) => (
            <FeatureCard
              key={group.title}
              icon={<span>{group.icon}</span>}
              title={group.title}
              points={group.points}
            />
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        title="Bring all your store work into one platform"
        description="Start with a simple setup and manage products, orders, and teams from day one."
        primaryLabel="Start Managing Your Store"
        primaryTo={ROUTES.login}
        secondaryLabel="Learn More"
        secondaryTo={ROUTES.about}
      />
    </>
  );
};

export default FeaturesPage;
