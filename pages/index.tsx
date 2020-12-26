import '../styles/Home.module.scss';
import { Button, Layout, Row, Space } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { DateTime } from 'luxon';
import MockSelect from '../components/MockSelect';
import AppointmentDatePicker, {
  AppointmentDatePickerProps,
} from '../components/DatePicker';
import NavBar from '../components/NavBar';
const { Content } = Layout;

interface HomeSearchBarProps {
  searchDateProps: AppointmentDatePickerProps;
}

function HomeSearchTypeSelect(): JSX.Element {
  const items = ['Doctor', 'Dentist'];
  return (
    <MockSelect mockOptions={items} bordered={false} style={{ width: 120 }} />
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
    <Row className={'search-splash-search-bar'}>
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
    <Layout className="home-page">
      <Content>
        <div className="search-splash-header">
          <NavBar inverted />
          <Space
            className="search-splash-header-content"
            direction={'vertical'}
          >
            <h1>Find a Doctor Near You.</h1>
            <h4>
              Discover the right doctor wherever you are. Powered by Dr.Chrono.
            </h4>
            <HomeSearchBar
              searchDateProps={{
                dateTimeValue: searchDate,
                onDateTimeChange: setSearchDate,
              }}
            />
            <Button
              type="primary"
              onClick={onSearchClicked}
              size={'large'}
              className={'search-splash-cta'}
            >
              Search Near You
            </Button>
          </Space>
        </div>
      </Content>
    </Layout>
  );
}
