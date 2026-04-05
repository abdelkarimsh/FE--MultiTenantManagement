import type { FC } from 'react';
import { Link } from 'react-router-dom';
import CTASection from '../../components/public/CTASection';
import FeatureCard from '../../components/public/FeatureCard';
import SectionWrapper from '../../components/public/SectionWrapper';
import { ROUTES } from '../../router/routes';

const featureCards = [
  {
    icon: 'P',
    title: 'Product Management',
    description:
      'Easily add, edit, and organize your products with a clean and simple interface.',
  },
  {
    icon: 'O',
    title: 'Order Management',
    description: 'Track all orders, update statuses, and manage your workflow with ease.',
  },
  {
    icon: 'T',
    title: 'Team Management',
    description: 'Add team members and control what they can access inside your system.',
  },
  {
    icon: 'D',
    title: 'Dashboard Overview',
    description: 'Get a clear overview of your store performance and daily operations.',
  },
];

const steps = [
  {
    title: 'Add Your Products',
    description: 'Create your product list and organize your store.',
  },
  {
    title: 'Receive and Manage Orders',
    description: 'Track incoming orders and update their status with ease.',
  },
  {
    title: 'Manage Your Team and Operations',
    description: 'Control access and keep your operations organized.',
  },
];

const HomePage: FC = () => {
  return (
    <>
      <section className="public-hero">
        <div className="public-container public-hero-grid">
          <div className="public-hero-content">
            <p className="public-eyebrow">Store Management Platform</p>
            <h1 className="public-hero-title">
              Manage Your Store, Products, and Orders in One Simple Platform
            </h1>
            <p className="public-hero-subtitle">
              A powerful system to manage your products, track orders, organize your team, and run
              your business smoothly from one place.
            </p>
            <div className="public-actions">
              <Link className="public-btn public-btn-primary" to={ROUTES.login}>
                Start Managing Your Store
              </Link>
              <Link className="public-btn public-btn-secondary" to={ROUTES.features}>
                See How It Works
              </Link>
            </div>
          </div>

          <div className="public-hero-visual" aria-hidden="true">
            <div className="public-mock-top">
              <span />
              <span />
              <span />
            </div>
            <div className="public-mock-grid">
              <div className="public-mock-card">
                <p>Products</p>
                <strong>248 Items</strong>
              </div>
              <div className="public-mock-card">
                <p>Orders</p>
                <strong>43 Today</strong>
              </div>
              <div className="public-mock-card public-mock-wide">
                <p>Team Activity</p>
                <strong>12 Updates</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionWrapper title="Everything You Need to Run Your Store">
        <div className="public-grid public-grid-4">
          {featureCards.map((item) => (
            <FeatureCard
              key={item.title}
              icon={<span>{item.icon}</span>}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper muted title="How It Works">
        <div className="public-grid public-grid-3">
          {steps.map((item, index) => (
            <FeatureCard
              key={item.title}
              className="public-step-card"
              title={item.title}
              description={item.description}
              icon={<span className="public-step-pill">Step {index + 1}</span>}
            />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Why Choose Us"
        subtitle="Built for business owners who want clearer daily operations and less manual follow-up."
      >
        <ul className="public-check-list">
          <li>Simple and easy to use</li>
          <li>Everything in one place</li>
          <li>Saves time and reduces manual work</li>
          <li>Secure and reliable</li>
          <li>Built to grow with your business</li>
        </ul>
      </SectionWrapper>

      <CTASection
        title="Start Managing Your Store Today"
        description="Take control of your products, orders, and operations with a system designed for real business needs."
        primaryLabel="Get Started Now"
        primaryTo={ROUTES.login}
        secondaryLabel="Learn More"
        secondaryTo={ROUTES.about}
      />
    </>
  );
};

export default HomePage;
