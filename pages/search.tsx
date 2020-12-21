import { useState } from 'react';
import { useQuery } from 'react-query';
import ProviderLocation from '../models/providerLocation';
import { DateTime } from 'luxon';
import { dateTimeToISO } from '../utils/dateUtils';
import {
  getCurrentLocation,
  getNearbyProviderLocations,
  getProviderLocationAvailableTimes,
} from '../components/SearchPage/searchPageQueries';
import SearchPage from '../components/SearchPage/SearchPage';

export default function Search(): JSX.Element {
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >();
  const [locationIdForBookingModal, setLocationIdForBookingModal] = useState<
    string | undefined
  >();
  const [searchDate, setSearchDate] = useState<DateTime>(DateTime.local());

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
      dateTimeToISO(searchDate, 'date'),
    ],
    getProviderLocationAvailableTimes,
    {
      enabled: nearbyQueryData,
    }
  );

  // State computed vars
  const isLoading =
    loadingCurrentLocation || loadingNearbyQuery || loadingAvailableTimesQuery;
  const isError = !!(
    currentLocationError ||
    nearbyQueryError ||
    availableTimesQueryError
  );

  // Event handlers
  const onResultLocationClicked = (location: ProviderLocation): void => {
    setSelectedLocationId(location.id);
  };
  const onResultLocationBookClicked = (location: ProviderLocation): void => {
    setLocationIdForBookingModal(location.id);
  };
  const onBookingModalClose = (): void => {
    setLocationIdForBookingModal(undefined);
  };

  return SearchPage({
    availableTimesQueryData,
    currentLocation,
    isError,
    isLoading,
    locationIdForBookingModal,
    nearbyQueryData,
    onResultLocationBookClicked,
    onResultLocationClicked,
    searchDate,
    selectedLocationId,
    onBookingModalClose,
    setSearchDate,
  });
}
