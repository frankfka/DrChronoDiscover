import styles from '../styles/Home.module.scss';
import { Button, Layout } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DateTime } from 'luxon';
import AppointmentSearchBar from '../components/SearchPage/AppointmentSearchBar/AppointmentSearchBar';
const { Footer, Content } = Layout;

export default function Home() {
  const router = useRouter();

  const [searchDate, setSearchDate] = useState<DateTime>(DateTime.local());

  const onSearchClicked = (): void => {
    router.push('/search');
  };

  return (
    <Layout className={styles.homePage}>
      <Content>
        <div className={styles.searchSplashHeader}>
          <div>
            <h1>Dr.Chrono Discover</h1>
            <h4>Find an available doctor near you.</h4>
            <AppointmentSearchBar
              searchDateProps={{
                value: searchDate,
                onChange: setSearchDate,
              }}
            />
            <Button type="primary" onClick={onSearchClicked}>
              Search Now
            </Button>
          </div>
        </div>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
