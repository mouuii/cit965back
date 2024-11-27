import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '最好的教程',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        我们提供云原生领域最好的课程，从基础到实战，从原理到源码，全面提升工程师的眼界和实力！
      </>
    ),
  },
  {
    title: '最温暖的社区',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        社区由一群热爱云原生的小伙伴组成，大家互相交流工作经验，分享生活趣闻
      </>
    ),
  },
  {
    title: '拒绝996',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        对996说 NO，坚决抵制公司一切形式的加班与领导的PUA话术，活出自我，过得精彩！
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
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

export default function HomepageFeatures() {
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
