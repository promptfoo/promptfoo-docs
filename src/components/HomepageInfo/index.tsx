import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

export default function HomepageInfo(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.blurb}>
          How it works
        </h2>
      </div>
    </section>
  );
}
