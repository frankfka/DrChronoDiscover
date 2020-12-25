import '../styles/Home.module.scss';
import { Button, Layout, Row, Space } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { DateTime } from 'luxon';
import MockSelect from '../components/MockSelect';
import AppointmentDatePicker, {
  AppointmentDatePickerProps,
} from '../components/DatePicker';
const { Content } = Layout;

function HomeHeaderNav(): JSX.Element {
  return (
    <Row style={{ padding: '2em 3em' }}>
      <img src="/images/logo.png" alt="Logo" height="32" />
      <div style={{ flexGrow: 1 }} />
      <Space>
        <Button type="link">About</Button>
        <Button type="link">Contact</Button>
        <Button type="primary" style={{ marginLeft: '1em' }}>
          Provider Login
        </Button>
      </Space>
    </Row>
  );
}

interface HomeSearchBarProps {
  searchDateProps: AppointmentDatePickerProps;
}

function HomeSearchTypeSelect(): JSX.Element {
  const items = ['Doctor', 'Dentist'];
  return (
    <MockSelect mockOptions={items} bordered={false} style={{ width: 100 }} />
  );
}

function HomeDatePicker({
  dateTimeValue,
  onDateTimeChange,
}: AppointmentDatePickerProps): JSX.Element {
  return (
    <AppointmentDatePicker
      bordered={false}
      dateTimeValue={dateTimeValue}
      onDateTimeChange={onDateTimeChange}
    />
  );
}

function HomeSearchBar({ searchDateProps }: HomeSearchBarProps): JSX.Element {
  return (
    <Row>
      <Space>
        <div>Find a</div>
        <HomeSearchTypeSelect />
        <div>for</div>
        <HomeDatePicker {...searchDateProps} />
      </Space>
    </Row>
  );
}

export default function Home() {
  const router = useRouter();

  const [searchDate, setSearchDate] = useState<DateTime>(DateTime.local());

  const onSearchClicked = (): void => {
    router.push('/search');
  };

  return (
    <Layout className="homePage">
      <Content>
        <div className="searchSplashHeader">
          <HomeHeaderNav />
          <Space className="searchSplashHeaderContent" direction={'vertical'}>
            <h1>Find a Doctor Near You.</h1>
            <h4>
              Discover the right doctor for your needs. Powered by Dr.Chrono.
            </h4>
            <HomeSearchBar
              searchDateProps={{
                dateTimeValue: searchDate,
                onDateTimeChange: setSearchDate,
              }}
            />
            <Button type="primary" onClick={onSearchClicked}>
              Search Near You
            </Button>
          </Space>
        </div>
      </Content>
    </Layout>
  );
}
