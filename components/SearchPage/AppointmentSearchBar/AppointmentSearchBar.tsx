import { Button, Input, Row, Select, Space } from 'antd';
import AppointmentDatePicker, {
  AppointmentDatePickerProps,
} from '../AppointmentDatePicker/AppointmentDatePicker';
import React, { PropsWithChildren, ReactNode } from 'react';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { BiCurrentLocation } from 'react-icons/bi';

function LocationTypeSelect(): JSX.Element {
  const items = ['Doctor', 'Dentist', 'Physiotherapist', 'Massage Therapist'];
  return (
    <Select style={{ width: '200px', textAlign: 'left' }} value={items[0]}>
      {items.map((item) => {
        return (
          <Select.Option value={item} key={item}>
            {item}
          </Select.Option>
        );
      })}
    </Select>
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
