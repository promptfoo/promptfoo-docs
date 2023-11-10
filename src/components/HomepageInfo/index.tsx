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
    <>
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.blurb}>Used by developers at</h2>
          <div className={styles.logoContainer}>
            <img src="https://1000logos.net/wp-content/uploads/2021/06/Discord-logo.jpg" />
            <img src="https://seekvectorlogo.net/wp-content/uploads/2020/03/mathworks-vector-logo.png" />
            <img style={{maxWidth: '80px'}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" />
            <img src="https://mma.prnewswire.com/media/1165548/CARVANA_Logo.jpg" />
            <img src="https://mma.prnewswire.com/media/2034763/synthego_logo.jpg" />
            {/* https://crisprmedicinenews.com/typo3temp/assets/images/csm_main-logo-white-w-background__1__a52eb66d60_2446006ab7.jpg */}
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.blurb}>How it works</h2>
        </div>
      </section>
    </>
  );
}
