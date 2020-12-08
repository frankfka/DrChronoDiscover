import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {Button, PageHeader} from 'antd';
import {signIn, useSession} from 'next-auth/client';

async function signInPressed() {
  return await signIn()
}

export default function Home() {
  // Authentication
  const [session, loading] = useSession();

  return (
    <div className={styles.container}>
      <PageHeader
        className={styles.navHeader}
        title="Dr.Chrono Discover"
        subTitle={session ? session.user.name : "Not Signed In"}
      />
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Dr Chrono Discover
        </h1>
        <Button type={'primary'} href={'https://www.google.com/'}>
          Test
        </Button>
        <Button type={'primary'} onClick={signInPressed}>
          Sign In
        </Button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
        </a>
      </footer>
    </div>
  );
}
