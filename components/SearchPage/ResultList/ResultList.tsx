import Geolocation from '../../../models/geolocation';
import { List } from 'antd';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import ResultListItem from './ResultListItem';

interface ResultListProps {
  className?: string;
  searchLocation: Geolocation;
  resultLocations: Array<ProviderLocationWithAvailability>;
  selectedLocationId: string | undefined;
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
  resultLocations,
  selectedLocationId,
  className,
  onResultLocationClicked,
  onResultLocationHover,
  onResultLocationBookClicked,
}: ResultListProps): JSX.Element {
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
      renderItem={(location) => (
        <ResultListItem
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
