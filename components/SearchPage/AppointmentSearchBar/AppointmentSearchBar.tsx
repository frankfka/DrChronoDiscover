import { Button, Input, Row, Space } from 'antd';
import React, { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { BiCurrentLocation } from 'react-icons/bi';
import MockSelect from '../../MockSelect';
import AppointmentDatePicker, {
  AppointmentDatePickerProps,
} from '../../DatePicker';

function LocationTypeSelect(): JSX.Element {
  const items = ['Doctor', 'Dentist'];
  return (
    <MockSelect
      style={{ width: '200px', textAlign: 'left' }}
      mockOptions={items}
    />
  );
}

interface SearchItemWrapperProps {
  title?: string;
}

function SearchItemWrapper({
  title,
  children,
  style,
}: PropsWithChildren<ReactNode> &
  SearchItemWrapperProps &
  HTMLAttributes<ReactNode>): JSX.Element {
  return (
    <div
      style={{
        margin: '1em',
        ...style,
      }}
    >
      <div style={{ textAlign: 'left' }}>{title}</div>
      {children}
    </div>
  );
}

/*
Disabled input for current location
 */
function LocationSearchInput(): JSX.Element {
  return (
    <Input
      value="Current Location"
      prefix={<BiCurrentLocation />}
      disabled={true}
    />
  );
}

interface AppointmentSearchBarProps {
  searchDateProps: AppointmentDatePickerProps;
}

/*
Search bar with location & date input
 */
export default function AppointmentSearchBar({
  searchDateProps,
}: AppointmentSearchBarProps): JSX.Element {
  return (
    <Row
      style={{
        alignItems: 'end',
      }}
    >
      <SearchItemWrapper title={'Location'} style={{ flexGrow: 1 }}>
        <LocationSearchInput />
      </SearchItemWrapper>
      <SearchItemWrapper title={'Date'}>
        <AppointmentDatePicker {...searchDateProps} />
      </SearchItemWrapper>
      <SearchItemWrapper title={'Type'}>
        <LocationTypeSelect />
      </SearchItemWrapper>
      <SearchItemWrapper>
        <Button icon={<FilterOutlined />}>Filter</Button>
        <Button
          icon={<SortAscendingOutlined />}
          style={{ marginLeft: '0.4em' }}
        >
          Sort
        </Button>
      </SearchItemWrapper>
    </Row>
  );
}
