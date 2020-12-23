import React from 'react';
import { Modal, Spin } from 'antd';
import styles from './BookingModal.module.scss';
import BookingForm, { BookingFormValues } from './BookingForm/BookingForm';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import { MutationStatus, useMutation } from 'react-query';
import { bookAppointment } from '../searchPageMutations';
import BookingModalStatus from './Status/BookingModalStatus';
import { DateTime } from 'luxon';
import { dateTimeToFormattedString } from '../../../utils/dateUtils';

interface BookingModalProps {
  bookingDate: DateTime;
  locationWithAvailabilities: ProviderLocationWithAvailability;
  isVisible: boolean;
  closeClicked: () => void;
}

interface BookingModalContentProps extends BookingModalProps {
  status: MutationStatus;
  bookedAppointmentId?: string;
  onSubmitBooking: (values: BookingFormValues) => Promise<void>;
}

function BookingModalContent({
  locationWithAvailabilities,
  onSubmitBooking,
  closeClicked,
  status,
  bookedAppointmentId,
  bookingDate,
}: BookingModalContentProps): JSX.Element {
  if (status === 'idle' || status === 'loading') {
    return (
      <Spin tip="Booking Your Appointment..." spinning={status === 'loading'}>
        <BookingForm
          availableSlots={locationWithAvailabilities.availableSlots}
          onSubmit={onSubmitBooking}
          bookingDate={bookingDate}
        />
      </Spin>
    );
  } else {
    return (
      <BookingModalStatus
        status={status}
        onDismiss={closeClicked}
        appointmentId={bookedAppointmentId}
      />
    );
  }
}

export default function BookingModal({
  bookingDate,
  isVisible,
  closeClicked,
  locationWithAvailabilities,
}: BookingModalProps): JSX.Element {
  const modalTitle = `${
    locationWithAvailabilities.name
  } - ${dateTimeToFormattedString(bookingDate, 'date')}`;
  const mutation = useMutation(bookAppointment);
  const bookingStatus = mutation.status;
  const onSubmitBooking = async (values: BookingFormValues): Promise<void> => {
    await mutation.mutateAsync({
      bookingFormValues: values,
      locationWithAvailabilities,
    });
  };
  return (
    <Modal
      className={styles.bookingModal}
      title={modalTitle}
      centered
      visible={isVisible}
      footer={null}
      destroyOnClose={true}
      // On close function
      onCancel={closeClicked}
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles.bookingModalContent}>
        <BookingModalContent
          {...{
            isVisible,
            closeClicked,
            locationWithAvailabilities,
            status: bookingStatus,
            onSubmitBooking,
            bookedAppointmentId: mutation.data?.appointmentId,
            bookingDate,
          }}
        />
      </div>
    </Modal>
  );
}
