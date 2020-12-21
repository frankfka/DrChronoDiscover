import React from 'react';
import { Modal } from 'antd';
import styles from './BookingModal.module.scss';
import BookingForm, { BookingFormValues } from '../BookingForm/BookingForm';
import { ProviderLocationWithAvailability } from '../searchPageModels';

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
  const onSubmit = (values: BookingFormValues): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve();
      }, 400);
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
    >
      <BookingForm
        availableSlots={locationWithAvailabilities.availableSlots}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
