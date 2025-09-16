import type { ReactNode } from 'react';

export function HomeSection<T extends ReactNode>({
  features,
}: {
  features: T[];
}) {
  return (
    <section className="home-section">
      <h2>{}</h2>
      <ul className="home-features">{features}</ul>
    </section>
  );
}
