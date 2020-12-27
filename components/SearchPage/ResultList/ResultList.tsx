import { List, Skeleton } from 'antd';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import ResultListItem from './ResultListItem';
import Geolocation from '../../../models/geolocation';

function LoadingResultList(): JSX.Element {
  return (
    <List
      style={{
        padding: '2em',
      }}
      itemLayout={'vertical'}
      dataSource={new Array(5).fill('')}
      renderItem={() => <Skeleton active />}
    />
  );
}

interface ResultListProps {
  className?: string;
  searchLocation?: Geolocation;
  resultLocations: Array<ProviderLocationWithAvailability>;
  selectedLocationId: string | undefined;
  loading?: boolean;
  onResultLocationHover?: (
    location: ProviderLocationWithAvailability | undefined
  ) => void;
  onResultLocationClicked?: (
    location: ProviderLocationWithAvailability
  ) => void;
  onResultLocationBookClicked?: (
    location: ProviderLocationWithAvailability
  ) => void;
}

export default function ResultList({
  loading,
  searchLocation,
  resultLocations,
  selectedLocationId,
  className,
  onResultLocationClicked,
  onResultLocationHover,
  onResultLocationBookClicked,
}: ResultListProps): JSX.Element {
  if (loading || !searchLocation) {
    return <LoadingResultList />;
  }

  const onItemClick = (location: ProviderLocationWithAvailability): void => {
    onResultLocationClicked?.(location);
  };
  const onBookClick = (location: ProviderLocationWithAvailability): void => {
    onResultLocationBookClicked?.(location);
  };
  const onMouseEnterItem = (
    location: ProviderLocationWithAvailability
  ): void => {
    onResultLocationHover?.(location);
  };
  const onMouseLeaveItem = (): void => {
    onResultLocationHover?.(undefined);
  };

  return (
    <List
      className={className}
      itemLayout={'vertical'}
      dataSource={resultLocations}
      renderItem={(location, index) => (
        <ResultListItem
          searchLocation={searchLocation}
          locationIdentifier={(index + 1).toFixed(0)}
          isSelected={location.id === selectedLocationId}
          location={location}
          onClick={() => onItemClick(location)}
          onBookClick={() => onBookClick(location)}
          onMouseEnter={() => onMouseEnterItem(location)}
          onMouseLeave={() => onMouseLeaveItem()}
        />
      )}
    />
  );
}
