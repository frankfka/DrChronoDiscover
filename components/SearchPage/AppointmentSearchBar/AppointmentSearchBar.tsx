import { Button, Input, Row, Space } from 'antd';
import React, { PropsWithChildren, ReactNode } from 'react';
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
  title: string;
}

function SearchItemWrapper({
  title,
  children,
}: PropsWithChildren<ReactNode> & SearchItemWrapperProps): JSX.Element {
  return (
    <div>
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
    <Row>
      <Space align={'end'}>
        <SearchItemWrapper title={'Location'}>
          <LocationSearchInput />
        </SearchItemWrapper>
        <SearchItemWrapper title={'Date'}>
          <AppointmentDatePicker {...searchDateProps} />
        </SearchItemWrapper>
        <SearchItemWrapper title={'Type'}>
          <LocationTypeSelect />
        </SearchItemWrapper>
        <Button icon={<FilterOutlined />}>Filter</Button>
        <Button icon={<SortAscendingOutlined />}>Sort</Button>
      </Space>
    </Row>
  );
}
