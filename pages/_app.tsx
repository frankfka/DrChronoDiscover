import '../styles/globals.scss';
import 'antd/dist/antd.css';
import 'reflect-metadata';

import { Provider } from 'next-auth/client';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
