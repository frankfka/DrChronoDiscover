import Geolocation from '../../../models/geolocation';
import ProviderLocation from '../../../models/providerLocation';
import { Button, List } from 'antd';
import { MouseEventHandler } from 'react';
import { ProviderLocationWithAvailability } from '../searchPageModels';

interface ResultListItemProps {
  location: ProviderLocation;
  isSelected: boolean;
  onClick?: MouseEventHandler;
  onBookClick?: MouseEventHandler;
}

function ResultListItem({
  location,
  isSelected,
  onClick,
  onBookClick,
}: ResultListItemProps): JSX.Element {
  // TODO: module styles, hover animation?
  return (
    <List.Item
      key={location.name}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <p>{location.name}</p>
      <p>{isSelected ? 'Selected' : 'Not Selected'}</p>
      <Button onClick={onBookClick}>Book Now</Button>
    </List.Item>
  );
}

interface ResultListProps {
  className?: string;
  searchLocation: Geolocation;
  resultLocations: Array<ProviderLocationWithAvailability>;
  selectedLocationId: string | undefined;
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
  onResultLocationBookClicked,
}: ResultListProps): JSX.Element {
  const onItemClick = (location: ProviderLocationWithAvailability): void => {
    onResultLocationClicked?.(location);
  };
  const onBookClick = (location: ProviderLocationWithAvailability): void => {
    onResultLocationBookClicked?.(location);
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
        />
      )}
    />
  );
}
