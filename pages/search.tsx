import styles from '../styles/Search.module.scss';
import { Col, Layout, Row, Select } from 'antd';
import ResultMap from '../components/ResultMap';
import { useEffect, useState } from 'react';
import Geolocation from '../models/geolocation';
const { Header, Footer, Content } = Layout;
const { Option } = Select;

const mockLocations: Array<Geolocation> = [
  {
    lat: 49.157212,
    lng: -123.136551,
  },
  {
    lat: 49.12764,
    lng: -123.135864,
  },
  {
    lat: 49.21634,
    lng: -122.975876,
  },
];

export default function Search() {
  const [selectionIndex, setSelectionIndex] = useState<number | undefined>();

  const [isLoading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Geolocation | null>(
    null
  );
  // Fetch current location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Ignore errors for now
        console.error(error);
      }
    );
  }, []);

  if (isLoading) {
    return (
      <Layout className={styles.searchPage}>
        <Content>Loading</Content>
      </Layout>
    );
  }

  // TODO
  if (!currentLocation) {
    return (
      <Layout className={styles.searchPage}>
        <Content>No Current Location</Content>
      </Layout>
    );
  }

  return (
    <Layout className={styles.searchPage}>
      <Header>Header</Header>
      <Content>
        <Row className={styles.searchPageContent}>
          <Col span={18}>
            <ResultMap
              currentLocation={currentLocation}
              resultLocations={mockLocations}
              selectedIndex={selectionIndex}
            />
          </Col>
          <Col span={6}>
            <Select
              onChange={(val: number | string) => {
                if (typeof val === 'number') {
                  setSelectionIndex(val);
                } else {
                  setSelectionIndex(undefined);
                }
              }}
            >
              <Option value="None">None</Option>
              {mockLocations.map((_, index) => {
                return (
                  <Option value={index} key={index}>
                    {index}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
