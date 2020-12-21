import moment from 'moment';
import { DatePicker } from 'antd';
import { DateTime } from 'luxon';

export interface AppointmentDatePickerProps {
  value: DateTime;
  onChange: (date: DateTime) => void;
}

export default function AppointmentDatePicker({
  value,
  onChange,
}: AppointmentDatePickerProps): JSX.Element {
  const momentValue = moment(value.toJSDate());
  const momentOnChange = (newMomentValue: moment.Moment | null): void => {
    if (newMomentValue) {
      onChange(DateTime.fromJSDate(newMomentValue.toDate()));
    }
  };
  const isDateDisabled = (momentDate: moment.Moment): boolean => {
    const now = moment();
    return momentDate.isBefore(now, 'day');
  };
  return (
    <>
      <DatePicker
        value={momentValue}
        onChange={momentOnChange}
        showNow
        allowClear={false}
        disabledDate={isDateDisabled}
      />
    </>
  );
}
