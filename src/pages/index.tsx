import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageInfo from '@site/src/components/HomepageInfo';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Test your prompts</h1>
        <p className="hero__subtitle">Ensure high-quality LLM outputs with automatic evals.</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="promptfoo | LLM prompt testing"
      description="Library for evaluating LLM prompt quality and testing.">
      <HomepageHeader />
      <main>
        <HomepageInfo />
        <HomepageFeatures />

        <div style={{textAlign: 'center', padding: '2rem 0 8rem 0'}}>
          <Link to="/docs/intro">
            <img style={{maxWidth: 960}} src="https://user-images.githubusercontent.com/310310/244891219-2b79e8f8-9b79-49e7-bffb-24cba18352f2.png" />
          </Link>
        </div>
      </main>
    </Layout>
  );
}
