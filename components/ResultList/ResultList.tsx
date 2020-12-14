import Geolocation from '../../models/geolocation';
import ProviderLocation from '../../models/providerLocation';
import { Button, List } from 'antd';
import { MouseEventHandler } from 'react';

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
  resultLocations: Array<ProviderLocation>;
  selectedIndex: number | undefined;
  onResultLocationClicked?: (location: ProviderLocation) => void;
  onResultLocationBookClicked?: (location: ProviderLocation) => void;
}

export default function ResultList({
  resultLocations,
  selectedIndex,
  className,
  onResultLocationClicked,
  onResultLocationBookClicked,
}: ResultListProps): JSX.Element {
  const onItemClick = (index: number, location: ProviderLocation): void => {
    onResultLocationClicked?.(location);
  };
  const onBookClick = (index: number, location: ProviderLocation): void => {
    onResultLocationBookClicked?.(location);
  };

  return (
    <List
      className={className}
      itemLayout={'vertical'}
      dataSource={resultLocations}
      renderItem={(item, index) => (
        <ResultListItem
          isSelected={index === selectedIndex}
          location={item}
          onClick={() => onItemClick(index, item)}
          onBookClick={() => onBookClick(index, item)}
        />
      )}
    />
  );
}
