import { Col, Input, Row, Space } from 'antd';
import { useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import AppointmentDatePicker, {
  AppointmentDatePickerProps,
} from '../AppointmentDatePicker/AppointmentDatePicker';

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
    <>
      <Row>
        <Col>
          <Space>
            <LocationSearchInput />
            <AppointmentDatePicker {...searchDateProps} />
          </Space>
        </Col>
      </Row>
    </>
  );
}
