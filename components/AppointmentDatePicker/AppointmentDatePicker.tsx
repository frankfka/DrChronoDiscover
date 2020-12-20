import moment from 'moment';
import { DatePicker } from 'antd';

interface AppointmentDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onConfirm?: (date: Date) => void;
}

export default function AppointmentDatePicker({
  value,
  onChange,
}: AppointmentDatePickerProps): JSX.Element {
  const momentValue = moment(value);
  const momentOnChange = (newMomentValue: moment.Moment | null): void => {
    if (newMomentValue) {
      onChange(newMomentValue.toDate());
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
