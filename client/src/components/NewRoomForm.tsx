import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { NewRoom } from '../common/room';

interface Props {
  onSubmit?: (newRoom: NewRoom) => void;
  onCancel?: () => void;
  errorMessage?: string | null;
}

export default function NewRoomForm({ onSubmit, onCancel, errorMessage }: Props = {}) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    onSubmit && onSubmit({ name, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Room</h3>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          minLength={3}
          className="form-control"
          placeholder="Enter room name"
          id="name"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="col-form-label">
          Description:
        </label>
        <input
          type="text"
          minLength={3}
          className="form-control"
          placeholder="Enter room description"
          id="description"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      {errorMessage && (
        <div className="mb-3">
          <p className="text-danger">{errorMessage && <small>{errorMessage}</small>}</p>
        </div>
      )}
      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-3" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Add Room
        </button>
      </div>
    </form>
  );
}
