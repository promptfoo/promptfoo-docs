import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Improve prompts systematically',
    Svg: require('@site/static/img/svgrepo_puzzle_toy.svg').default,
    description: (
      <>
        Reduce subjectivity and the impact of small sample size when tuning prompts.
      </>
    ),
  },
  {
    title: 'Evaluate quality and catch regressions',
    Svg: require('@site/static/img/svgrepo_science.svg').default,
    description: (
      <>
        Use built-in tools to evaluate the quality of your prompts, or use the
        side-by-side view to aid human evaluation.
      </>
    ),
  },
  {
    title: 'Spend less time tuning prompts',
    Svg: require('@site/static/img/svgrepo_park.svg').default,
    description: (
      <>
        Run multiple prompts and models at the same time, then compare the
        results side-by-side. Or, use the library into your existing workflow.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
