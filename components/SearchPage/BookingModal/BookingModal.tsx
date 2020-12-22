import React from 'react';
import { Modal, Spin } from 'antd';
import styles from './BookingModal.module.scss';
import BookingForm, { BookingFormValues } from './BookingForm/BookingForm';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import { MutationStatus, useMutation } from 'react-query';
import { bookAppointment } from '../searchPageMutations';
import BookingModalStatus from './Status/BookingModalStatus';

interface BookingModalProps {
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
}: BookingModalContentProps): JSX.Element {
  if (status === 'idle' || status === 'loading') {
    return (
      <Spin tip="Booking Your Appointment..." spinning={status === 'loading'}>
        <BookingForm
          availableSlots={locationWithAvailabilities.availableSlots}
          onSubmit={onSubmitBooking}
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
  isVisible,
  closeClicked,
  locationWithAvailabilities,
}: BookingModalProps): JSX.Element {
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
      title={locationWithAvailabilities.name}
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
          }}
        />
      </div>
    </Modal>
  );
}
