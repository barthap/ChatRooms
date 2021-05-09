import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

interface Props {
  onSubmit?: (nickname: string) => void;
  errorMessage?: string | null;
}

export default function LoginForm({ onSubmit, errorMessage }: Props = {}) {
  const [nickname, setNickname] = React.useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    onSubmit && onSubmit(nickname);
    console.log(nickname);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign In</h3>

      <div className="form-group row mb-3">
        <label htmlFor="nickname" className="col-sm-3 col-form-label">
          Nickname:
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your nickname"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <p className="text-danger">{errorMessage && <small>{errorMessage}</small>}</p>

        <button type="submit" className="btn btn-primary">
          Enter chat
        </button>
      </div>
    </form>
  );
}
