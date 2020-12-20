import { Col, Input, Row, Space } from 'antd';
import { useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import AppointmentDatePicker from '../AppointmentDatePicker/AppointmentDatePicker';

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

/*
Search bar with location & date input
 */
export default function AppointmentSearchBar(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <>
      <Row>
        <Col>
          <Space>
            <LocationSearchInput />
            <AppointmentDatePicker
              onChange={setSelectedDate}
              value={selectedDate}
            />
          </Space>
        </Col>
      </Row>
    </>
  );
}
