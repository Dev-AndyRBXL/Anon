import type { ReactNode } from 'react';

interface SectionProps {
  features: Record<string, ReactNode>;
}

export default function AboutSection({ features }: SectionProps) {
  return (
    <section className="features-section">
      <h2>What's new?</h2>
      <ul className="features-list">
        {Object.entries(features).map(([key, value]) => (
          <li key={key} id={key} className="feature-item">
            <h3>{key}</h3>
            {value}
          </li>
        ))}
      </ul>
    </section>
  );
}
