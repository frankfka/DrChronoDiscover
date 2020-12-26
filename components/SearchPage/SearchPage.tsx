import '../../styles/Search.module.scss';

import { Col, Divider, Layout, Row } from 'antd';
import { ProviderLocationWithAvailability } from './searchPageModels';
import BookingModal from './BookingModal/BookingModal';
import AppointmentSearchBar from './AppointmentSearchBar/AppointmentSearchBar';
import ResultMap from './ResultMap/ResultMap';
import ResultList from './ResultList/ResultList';
import Geolocation from '../../models/geolocation';
import { NearbyApiResponse } from '../../models/api/nearbyApiModels';
import { AvailableTimesApiResponse } from '../../models/api/availableTimesApiModels';
import { DateTime } from 'luxon';
import NavBar from '../NavBar';
const { Content } = Layout;

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
  if (isError) {
    return (
      <Layout className="search-page">
        <Content>Error</Content>
      </Layout>
    );
  }

  const nearbyLocationsWithAvailabilities: Array<ProviderLocationWithAvailability> =
    nearbyQueryData?.locations.map((location) => {
      const availableSlots =
        availableTimesQueryData?.availableBookingTimesByLocationId[
          location.id
        ] ?? [];
      return {
        availableSlots,
        ...location,
      };
    }) ?? [];
  const locationForBookingModal = nearbyLocationsWithAvailabilities.find(
    (loc) => loc.id === locationIdForBookingModal
  );

  return (
    <Layout className="search-page">
      {/*Modal*/}
      {locationForBookingModal && (
        <BookingModal
          locationWithAvailabilities={locationForBookingModal}
          isVisible={!!locationForBookingModal}
          closeClicked={onBookingModalClose}
          bookingDate={searchDate}
        />
      )}

      {/*Main Content*/}
      <NavBar />
      <Divider style={{ margin: 0 }} />
      <AppointmentSearchBar
        searchDateProps={{
          dateTimeValue: searchDate,
          onDateTimeChange: setSearchDate,
        }}
      />
      <Divider style={{ margin: 0 }} />
      <Content>
        <Row style={{ height: '100%' }}>
          <Col
            span={18}
            style={{ borderRight: '0.5px solid #d9d9d9', height: '100%' }}
          >
            <ResultMap
              loading={isLoading}
              searchLocation={currentLocation}
              resultLocations={nearbyLocationsWithAvailabilities}
              selectedLocationId={selectedLocationId}
              onResultLocationClicked={onResultLocationClicked}
            />
          </Col>
          <Col span={6} style={{ height: '100%' }}>
            <ResultList
              loading={isLoading}
              className="search-results-list"
              resultLocations={nearbyLocationsWithAvailabilities}
              selectedLocationId={selectedLocationId}
              onResultLocationClicked={onResultLocationClicked}
              onResultLocationBookClicked={onResultLocationBookClicked}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
