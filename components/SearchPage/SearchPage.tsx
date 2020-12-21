import { Col, Layout, Row } from 'antd';
import styles from '../../styles/Search.module.scss';
import { ProviderLocationWithAvailability } from './searchPageModels';
import BookingModal from './BookingModal/BookingModal';
import AppointmentSearchBar from './AppointmentSearchBar/AppointmentSearchBar';
import ResultMap from './ResultMap/ResultMap';
import ResultList from './ResultList/ResultList';
import Geolocation from '../../models/geolocation';
import { NearbyApiResponse } from '../../models/api/nearbyApiModels';
import { AvailableTimesApiResponse } from '../../models/api/availableTimesApiModels';
import { DateTime } from 'luxon';
const { Header, Footer, Content } = Layout;

interface SearchPageProps {
  isLoading: boolean;
  isError: boolean;
  // Search Params
  currentLocation?: Geolocation;
  searchDate: DateTime;
  // Queries
  nearbyQueryData?: NearbyApiResponse;
  availableTimesQueryData?: AvailableTimesApiResponse;
  // View
  locationIdForBookingModal?: string; // Booking modal
  selectedLocationId?: string;
  // Callbacks
  setSearchDate: (newDate: DateTime) => void;
  onBookingModalClose: () => void;
  onResultLocationClicked: (
    locationWithAvailability: ProviderLocationWithAvailability
  ) => void;
  onResultLocationBookClicked: (
    locationWithAvailability: ProviderLocationWithAvailability
  ) => void;
}

export default function SearchPage({
  isLoading,
  isError,
  currentLocation,
  searchDate,
  setSearchDate,
  nearbyQueryData,
  availableTimesQueryData,
  locationIdForBookingModal,
  onBookingModalClose,
  selectedLocationId,
  onResultLocationClicked,
  onResultLocationBookClicked,
}: SearchPageProps): JSX.Element {
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
  const locationForBookingModal = nearbyLocationsWithAvailabilities.find(
    (loc) => loc.id === locationIdForBookingModal
  );

  return (
    <Layout className={styles.searchPage}>
      {/*Modal*/}
      {locationForBookingModal && (
        <BookingModal
          locationWithAvailabilities={locationForBookingModal}
          isVisible={!!locationForBookingModal}
          closeClicked={onBookingModalClose}
        />
      )}

      {/*Main Content*/}
      <Header style={{ backgroundColor: 'white' }}>
        <h1>Search</h1>
      </Header>
      <div style={{ padding: 5, backgroundColor: 'lightgray' }}>
        <AppointmentSearchBar
          searchDateProps={{
            value: searchDate,
            onChange: setSearchDate,
          }}
        />
      </div>
      <Content>
        <Row className={styles.searchPageContent}>
          <Col span={18} className={styles.searchPageContent}>
            <ResultMap
              searchLocation={currentLocation}
              resultLocations={nearbyLocationsWithAvailabilities}
              selectedLocationId={selectedLocationId}
              onResultLocationClicked={onResultLocationClicked}
            />
          </Col>
          <Col span={6} className={styles.searchPageContent}>
            <ResultList
              className={styles.searchResultsList}
              searchLocation={currentLocation}
              resultLocations={nearbyLocationsWithAvailabilities}
              selectedLocationId={selectedLocationId}
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
