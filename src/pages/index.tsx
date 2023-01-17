import { AppHeader } from '@/src/components/AppHeader';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>NASA API DEMO</title>
        <meta name='description' content='Sample application' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
      </Head>
      <main>
        <AppHeader />
      </main>
    </>
  );
}
