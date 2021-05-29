import { Button } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Modal from 'react-modal';

import { NewRoom } from '../common/room';
import NewRoomForm from './NewRoomForm';

// must match the element from `index.tsx`
Modal.setAppElement('#root');

interface Props {
  onAddRoom?: (newRoom: NewRoom) => void;
}

export default function AddRoomModal({ onAddRoom }: Props) {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button
        border
        icon={<FontAwesomeIcon icon={faPlus} />}
        className="mt-3 mb-3"
        onClick={openModal}>
        Add new room
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add New Room">
        <NewRoomForm onSubmit={closeModal} onCancel={closeModal} />
      </Modal>
    </>
  );
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '40%',
    borderRadius: '10px',
  },
  overlay: {
    zIndex: 999,
  },
};
