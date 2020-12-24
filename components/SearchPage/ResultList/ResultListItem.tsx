import React, { MouseEventHandler } from 'react';
import { Button, List, Space, Tag } from 'antd';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import { CheckCircleOutlined, StarFilled } from '@ant-design/icons';
import { isoToFormattedString } from '../../../utils/dateUtils';
import seedrandom from 'seedrandom';

interface ResultListItemProps {
  locationIdentifier: string;
  location: ProviderLocationWithAvailability;
  isSelected: boolean;
  onClick?: MouseEventHandler;
  onBookClick?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
}

interface RatingProps {
  rating: number;
  numRatings: number;
}

function Rating({ rating, numRatings }: RatingProps): JSX.Element {
  const rateString = rating.toFixed(0);
  const numRatingsString = numRatings.toFixed(0);
  return (
    <>
      <small>
        <StarFilled style={{ color: '#fadb14' }} /> {rateString}/5{' '}
        <span>({numRatingsString})</span>
      </small>
    </>
  );
}

interface LocationTagsProps {
  hasTelehealth: boolean;
  hasBloodTesting: boolean;
}

const LocationTag: React.FC = ({ children }) => (
  <Tag icon={<CheckCircleOutlined />} color="success">
    {children}
  </Tag>
);

function LocationTags({
  hasTelehealth,
  hasBloodTesting,
}: LocationTagsProps): JSX.Element {
  return (
    <div>
      {hasTelehealth && <LocationTag>Telehealth</LocationTag>}
      {hasBloodTesting && <LocationTag>Blood Testing</LocationTag>}
    </div>
  );
}

interface ResultAvailabilityProps {
  locationWithAvailability: ProviderLocationWithAvailability;
}

function ResultAvailability({
  locationWithAvailability,
}: ResultAvailabilityProps): JSX.Element {
  const numAvailabilities = locationWithAvailability.availableSlots.length;
  let availabilityText: string;
  if (numAvailabilities > 0) {
    const earliestAppointmentTime = isoToFormattedString(
      locationWithAvailability.availableSlots[0].isoStartTime,
      'time'
    );
    availabilityText = `Available at ${earliestAppointmentTime} and ${(
      numAvailabilities - 1
    ).toFixed(0)} other times.`;
  } else {
    availabilityText = 'No availability.';
  }
  return <div>{availabilityText}</div>;
}

export default function ResultListItem({
  locationIdentifier,
  location,
  isSelected,
  onClick,
  onBookClick,
  onMouseEnter,
  onMouseLeave,
}: ResultListItemProps): JSX.Element {
  // Use Random #'s for mock data
  const randGen = seedrandom(location.id);
  // Rating
  const rating = Math.floor(randGen.quick() * 3) + 2;
  const numRatings = Math.floor(randGen.quick() * 100);
  // Tags
  const hasBloodTesting = randGen.quick() > 0.5;
  const hasTelehealth = randGen.quick() > 0.5;
  // Booking
  const bookingEnabled = location.availableSlots.length > 0;
  return (
    <List.Item
      key={location.name}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: '1em 1em 1.5em 1em',
        backgroundColor: isSelected ? 'whitesmoke' : 'transparent',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Space direction="vertical">
        <div>
          <h3 style={{ marginBottom: 0 }}>
            <small>{locationIdentifier}</small> {location.name}
          </h3>
          <Rating rating={rating} numRatings={numRatings} />
        </div>

        <LocationTags
          hasBloodTesting={hasBloodTesting}
          hasTelehealth={hasTelehealth}
        />

        <ResultAvailability locationWithAvailability={location} />

        <Button size={'small'} onClick={onBookClick} disabled={!bookingEnabled}>
          Book Now
        </Button>
      </Space>
    </List.Item>
  );
}
