import styles from '../styles/Search.module.scss';
import { Col, Layout, Row } from 'antd';
import ResultMap from '../components/ResultMap/ResultMap';
import { useState } from 'react';
import Geolocation, { createGeolocation } from '../models/geolocation';
import { useQuery } from 'react-query';
import {
  NearbyApiQueryParams,
  NearbyApiResponse,
} from '../models/api/nearbyApiModels';
import axios from 'axios';
import ProviderLocation from '../models/providerLocation';
import ResultList from '../components/ResultList/ResultList';
import BookingModal from '../components/BookingModal/BookingModal';
import AppointmentSearchBar from '../components/AppointmentSearchBar/AppointmentSearchBar';
import {
  AvailableTimesApiQueryParams,
  AvailableTimesApiResponse,
  AvailableTimeslot,
} from '../models/api/availableTimesApiModels';
import { DateTime } from 'luxon';
import { dateTimeToISO } from '../utils/dateUtils';
const { Header, Footer, Content } = Layout;

type ProviderLocationWithAvailability = ProviderLocation & {
  availableSlots: Array<AvailableTimeslot>;
};

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
    throw Error(`Incorrect status code from nearby request ${response.status}`);
  }
  return response.data as NearbyApiResponse;
}

async function getProviderLocationAvailableTimes(
  key: string,
  providerLocations: Array<ProviderLocation>,
  isoSearchDate: string,
  targetDurationMinutes = 30
): Promise<AvailableTimesApiResponse> {
  const queryParams: AvailableTimesApiQueryParams = {
    locationIds: providerLocations.map((loc) => loc.id).join(','), // Comma separated list of ID's
    targetDuration: targetDurationMinutes,
    isoDate: isoSearchDate,
  };
  const response = await axios.get('/api/availableTimes', {
    params: queryParams,
  });
  if (response.status !== 200) {
    throw Error(
      `Incorrect status code from available times request ${response.status}`
    );
  }
  return response.data as AvailableTimesApiResponse;
}

export default function Search(): JSX.Element {
  const [selectionIndex, setSelectionIndex] = useState<number | undefined>();
  const [locationForBookingModal, setLocationForBookingModal] = useState<
    ProviderLocation | undefined
  >();
  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.local());

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

  // Get available slots for each location returned from nearby query
  const {
    data: availableTimesQueryData,
    error: availableTimesQueryError,
    isLoading: loadingAvailableTimesQuery,
  } = useQuery(
    [
      'availableTimes',
      nearbyQueryData?.locations,
      dateTimeToISO(selectedDate, 'date'),
    ],
    getProviderLocationAvailableTimes,
    {
      enabled: nearbyQueryData,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  // State computed vars
  const isLoading =
    loadingCurrentLocation || loadingNearbyQuery || loadingAvailableTimesQuery;
  const isError =
    currentLocationError || nearbyQueryError || availableTimesQueryError;

  // On Click
  const onResultLocationClicked = (location: ProviderLocation): void => {
    // TODO: Match by ID later
    setSelectionIndex(
      nearbyQueryData?.locations.findIndex((elem) => elem == location)
    );
  };
  const onResultLocationBookClicked = (location: ProviderLocation): void => {
    setLocationForBookingModal(location);
  };

  // Render
  if (isLoading) {
    return (
      <Layout className={styles.searchPage}>
        <Content>Loading</Content>
      </Layout>
    );
  }

  if (
    isError ||
    !currentLocation ||
    !nearbyQueryData ||
    !availableTimesQueryData
  ) {
    return (
      <Layout className={styles.searchPage}>
        <Content>Error</Content>
      </Layout>
    );
  }

  const nearbyLocationsWithAvailabilities: Array<ProviderLocationWithAvailability> = nearbyQueryData.locations.map(
    (location) => {
      const availableSlots =
        availableTimesQueryData.availableBookingTimesByLocationId[
          location.id
        ] ?? [];
      return {
        availableSlots,
        ...location,
      };
    }
  );

  console.log(nearbyLocationsWithAvailabilities);

  return (
    <Layout className={styles.searchPage}>
      {/*Modal*/}
      {locationForBookingModal && (
        <BookingModal
          location={locationForBookingModal}
          isVisible={!!locationForBookingModal}
          closeClicked={() => {
            setLocationForBookingModal(undefined);
          }}
        />
      )}

      {/*Main Content*/}
      <Header style={{ backgroundColor: 'white' }}>
        <h1>Search</h1>
      </Header>
      <div style={{ padding: 5, backgroundColor: 'lightgray' }}>
        <AppointmentSearchBar
          searchDateProps={{
            value: selectedDate,
            onChange: setSelectedDate,
          }}
        />
      </div>
      <Content>
        <Row className={styles.searchPageContent}>
          <Col span={18} className={styles.searchPageContent}>
            <ResultMap
              searchLocation={currentLocation}
              resultLocations={nearbyQueryData.locations}
              selectedIndex={selectionIndex}
              onResultLocationClicked={onResultLocationClicked}
            />
          </Col>
          <Col span={6} className={styles.searchPageContent}>
            <ResultList
              className={styles.searchResultsList}
              searchLocation={currentLocation}
              resultLocations={nearbyQueryData.locations}
              selectedIndex={selectionIndex}
              onResultLocationClicked={onResultLocationClicked}
              onResultLocationBookClicked={onResultLocationBookClicked}
            />
          </Col>
        </Row>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
