import { MessageInput } from '@chatscope/chat-ui-kit-react';
import React from 'react';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { uploadImage } from '../common/photoUpload';

enum Mode {
  TEXT,
  IMAGE,
}

type InputEvent = (
  innerHTML: string,
  textContent: string,
  innerText: string,
  nodeList: NodeList
) => void;

export interface OnSendRequest {
  (msg: { content: string } | { url: string }): void;
}

const toHtmlImg = (src: string) => `<img src="${src}" style="height: 80px;"/>`;

export default function MessageInputEx({ onSend }: { onSend?: OnSendRequest; as?: unknown }) {
  const [rawValue, setRawValue] = React.useState('');
  const [mode, setMode] = React.useState(Mode.TEXT);
  const attachmentInputRef = React.useRef<HTMLInputElement>(null);

  const [attachmentFile, setAttachmentFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // when attachment button clicked
  const onAttachClick = () => {
    // open file select dialog
    attachmentInputRef.current?.click();
  };

  // when file input dialog closed and file selected
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files?.[0];

    if (!file) {
      setMode(Mode.TEXT);
      setRawValue('');
      return;
    }

    console.log(file);
    setAttachmentFile(file);
    const reader = new FileReader();
    reader.onload = ev => {
      if (!ev.target?.result) return;
      setMode(Mode.IMAGE);
      setRawValue(toHtmlImg(ev.target?.result?.toString()));
    };
    reader.readAsDataURL(file);
  };

  // when enter is pressed or send button clicked
  const onSendInner: InputEvent = async (raw, ..._args) => {
    // console.log('onSend', raw, _args);
    if (mode === Mode.TEXT) {
      onSend?.({ content: raw });
      setRawValue('');
      return;
    }

    if (!attachmentFile) {
      console.warn('Invalid state, no file in image mode');
      setMode(Mode.TEXT);
      setRawValue('');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadImage(attachmentFile);
      onSend?.({ url: result.data.image?.url ?? result.data.url });
      setAttachmentFile(null);
      setRawValue('');
      setMode(Mode.TEXT);
    } catch (e) {
      console.error(e);
      setRawValue(val => `${val} Error: try again`);
    } finally {
      setIsUploading(false);
    }
  };

  // debug only
  // React.useEffect(() => console.log('mode', mode), [mode]);
  // React.useEffect(() => console.log('raw', rawValue), [rawValue]);

  // Called when input field changes
  const onChange: InputEvent = (raw, _1, _2, _nodes) => {
    // console.log('onChange', raw, _1, _2, _nodes);

    if (mode === Mode.TEXT) {
      setRawValue(raw);
      return;
    }

    // user deleted an image (backspace)
    // go back to text mode
    if (raw === '') {
      setRawValue(raw);
      setMode(Mode.TEXT);
    }
  };

  return (
    <>
      <MessageInput
        placeholder={isUploading ? 'Preparing attachment...' : 'Type message here'}
        value={rawValue}
        onSend={onSendInner}
        onChange={onChange}
        onAttachClick={onAttachClick}
        disabled={isUploading}
        sendDisabled={rawValue.length === 0}
      />
      <input
        type="file"
        id="attachment"
        accept="image/*"
        ref={attachmentInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </>
  );
}
