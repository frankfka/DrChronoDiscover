import styles from '../styles/Home.module.scss';
import {Button, Col, Layout, Row} from 'antd';
import {useRouter} from 'next/router';


export default function Home() {
  const router = useRouter();
  const {Footer, Content} = Layout;

  const onSearchClicked = () => {
    router.push('/search')
  }

  return (
    <Layout className={styles.homePage}>
      <Content>
        <div className={styles.searchSplashHeader}>
          <div>
            <h1>
              Dr.Chrono Discover
            </h1>
            <h4>
              Find an available doctor near you.
            </h4>
            <Button
              type="primary"
              onClick={onSearchClicked}
            >
              Search Now
            </Button>
          </div>
        </div>

      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
