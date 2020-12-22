import React from 'react';
import { Modal } from 'antd';
import styles from './BookingModal.module.scss';
import BookingForm, { BookingFormValues } from '../BookingForm/BookingForm';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import { useMutation } from 'react-query';
import { bookAppointment } from '../searchPageMutations';

interface BookingModalProps {
  locationWithAvailabilities: ProviderLocationWithAvailability;
  isVisible: boolean;
  closeClicked: () => void;
}

export default function BookingModal({
  isVisible,
  closeClicked,
  locationWithAvailabilities,
}: BookingModalProps): JSX.Element {
  const mutation = useMutation(bookAppointment);
  const onSubmit = async (values: BookingFormValues): Promise<void> => {
    await mutation.mutateAsync({
      bookingFormValues: values,
      locationWithAvailabilities,
    });
  };
  // TODO: Display final status
  console.log(mutation.status);
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
    >
      <BookingForm
        availableSlots={locationWithAvailabilities.availableSlots}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
