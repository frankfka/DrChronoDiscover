import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';

type Status = Extract<ResultStatusType, 'success' | 'error'>;

interface BookingModalStatusProps {
  status: Status;
  appointmentId?: string;
  onDismiss: () => void;
}

export default function BookingModalStatus({
  status,
  appointmentId,
  onDismiss,
}: BookingModalStatusProps): JSX.Element {
  let bookingStatus = status;
  if (bookingStatus === 'success' && !appointmentId) {
    console.error(
      'Booking modal in success status but no appointment ID was given'
    );
    bookingStatus = 'error';
  }
  const title =
    bookingStatus === 'success'
      ? 'Appointment Booked!'
      : 'Something went wrong.';
  const subtitle =
    bookingStatus === 'success'
      ? `Your appointment ID is ${appointmentId}`
      : 'Your appointment was not booked.';
  return (
    <Result
      status={bookingStatus}
      title={title}
      subTitle={subtitle}
      extra={
        <Button type="primary" onClick={onDismiss}>
          Dismiss
        </Button>
      }
    />
  );
}
