'use client';
import dynamic from 'next/dynamic';
import styles from './index.module.css';

const Listener = dynamic(() => import('../components/Listener'), {
  ssr: false
});

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <Listener symbol="ADAUSDT" />
          <Listener symbol="MATICUSDT" />
        </div>
      </div>
    </div>
  );
}

export default Index;
