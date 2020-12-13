import styles from '../styles/Search.module.scss';
import { Col, Layout, Row, Select } from 'antd';
import ResultMap from '../components/ResultMap';
import { useState } from 'react';
import Geolocation, { createGeolocation } from '../models/geolocation';
import { useQuery } from 'react-query';
import {
  NearbyApiQueryParams,
  NearbyApiResponse,
} from '../models/api/nearbyApiModels';
import axios from 'axios';
import ProviderLocation from '../models/providerLocation';
const { Header, Footer, Content } = Layout;
const { Option } = Select;

async function getCurrentLocation(): Promise<Geolocation> {
  const currentPosition = await new Promise<GeolocationPosition>(
    (resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
  );
  return createGeolocation(
    currentPosition.coords.latitude,
    currentPosition.coords.longitude
  );
}

async function getNearbyProviderLocations(
  key: string,
  location: Geolocation,
  maxDistance = 30000 // 30km default
): Promise<NearbyApiResponse> {
  const queryParams: NearbyApiQueryParams = {
    ...location,
    maxDistance: maxDistance,
  };
  const response = await axios.get('/api/nearby', {
    params: queryParams,
  });
  if (response.status !== 200) {
    throw Error(`Incorrect status code ${response.status}`);
  }
  return response.data as NearbyApiResponse;
}

export default function Search(): JSX.Element {
  const [selectionIndex, setSelectionIndex] = useState<number | undefined>();

  // Get current location
  const {
    data: currentLocation,
    error: currentLocationError,
    isLoading: loadingCurrentLocation,
  } = useQuery('currentLocation', getCurrentLocation, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Get nearby
  const {
    data: nearbyQueryData,
    error: nearbyQueryError,
    isLoading: loadingNearbyQuery,
  } = useQuery(['nearby', currentLocation], getNearbyProviderLocations, {
    enabled: currentLocation,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // State computed vars
  const isLoading = loadingNearbyQuery || loadingCurrentLocation;
  const isError = nearbyQueryError || currentLocationError;

  // On Click
  const onResultLocationClicked = (location: ProviderLocation): void => {
    // TODO: Match by ID later
    setSelectionIndex(
      nearbyQueryData?.locations.findIndex((elem) => elem == location)
    );
  };

  // Render
  if (isLoading) {
    return (
      <Layout className={styles.searchPage}>
        <Content>Loading</Content>
      </Layout>
    );
  }

  if (isError || !currentLocation || !nearbyQueryData) {
    return (
      <Layout className={styles.searchPage}>
        <Content>Error</Content>
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
              searchLocation={currentLocation}
              resultLocations={nearbyQueryData.locations}
              selectedIndex={selectionIndex}
              onResultLocationClicked={onResultLocationClicked}
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
              {nearbyQueryData.locations.map((_, index) => {
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
