import { Modal } from 'antd';
import ProviderLocation from '../../models/providerLocation';
import styles from './BookingModal.module.scss';

interface BookingModalProps {
  location: ProviderLocation;
  isVisible: boolean;
  closeClicked: () => void;
}

export default function BookingModal({
  isVisible,
  closeClicked,
  location,
}: BookingModalProps): JSX.Element {
  return (
    <Modal
      className={styles.bookingModal}
      title="Basic Modal"
      centered
      visible={isVisible}
      footer={null}
      destroyOnClose={true}
      // On close function
      onCancel={closeClicked}
    >
      <p>{location.name}</p>
    </Modal>
  );
}
