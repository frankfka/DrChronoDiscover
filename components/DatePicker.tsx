import moment from 'moment';
import { DatePicker } from 'antd';
import { DateTime } from 'luxon';
import { DatePickerProps } from 'antd/lib/date-picker';

export interface AppointmentDatePickerProps {
  dateTimeValue: DateTime;
  onDateTimeChange: (date: DateTime) => void;
}

export default function AppointmentDatePicker({
  dateTimeValue,
  onDateTimeChange,
  ...props
}: AppointmentDatePickerProps & DatePickerProps): JSX.Element {
  const momentValue = moment(dateTimeValue.toJSDate());
  const momentOnChange = (newMomentValue: moment.Moment | null): void => {
    if (newMomentValue) {
      onDateTimeChange(DateTime.fromJSDate(newMomentValue.toDate()));
    }
  };
  const isDateDisabled = (momentDate: moment.Moment): boolean => {
    const now = moment();
    return momentDate.isBefore(now, 'day');
  };
  return (
    <DatePicker
      value={momentValue}
      onChange={momentOnChange}
      showNow
      allowClear={false}
      disabledDate={isDateDisabled}
      format={'ddd, MMM Do'}
      {...props}
    />
  );
}
