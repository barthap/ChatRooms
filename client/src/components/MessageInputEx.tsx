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
  (msg: { content: string } | { url: string; alt?: string; thumbnailUrl?: string }): void;
}

const toHtmlImg = (src: string) => `<img src="${src}" style="height: 80px;"/>`;

export default function MessageInputEx({ onSend }: { onSend?: OnSendRequest; as?: unknown }) {
  const [rawValue, setRawValue] = React.useState('');
  const [mode, setMode] = React.useState(Mode.TEXT);
  const [isUploading, setIsUploading] = React.useState(false);

  // reference to virtal file selection input
  const attachmentInputRef = React.useRef<HTMLInputElement>(null);
  // store actual selected file
  const attachmentFile = React.useRef<File | null>();
  // store URL to local file blob - used only for preview image
  const attachmentLocalUrl = React.useRef<string>();

  const setAttachment = (file: File) => {
    attachmentFile.current = file;
    // clear previous blob URL
    if (attachmentLocalUrl.current) {
      URL.revokeObjectURL(attachmentLocalUrl.current);
    }
    const newUrl = URL.createObjectURL(file);
    attachmentLocalUrl.current = newUrl;

    setRawValue(toHtmlImg(newUrl));
    setMode(Mode.IMAGE);
  };

  // remove attachment info and come back to text mode
  const clearAttachment = () => {
    attachmentFile.current = null;
    setRawValue('');
    setMode(Mode.TEXT);

    if (attachmentLocalUrl.current) {
      URL.revokeObjectURL(attachmentLocalUrl.current);
      attachmentLocalUrl.current = undefined;
    }
  };

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

    if (file) {
      setAttachment(file);
    } else {
      clearAttachment();
    }
  };

  // when enter is pressed or send button clicked
  const onSendInner: InputEvent = async raw => {
    if (mode === Mode.TEXT) {
      onSend?.({ content: raw });
      setRawValue('');
      return;
    }

    // this should never happen
    if (!attachmentFile.current) {
      console.warn('Invalid state, no file in image mode');
      clearAttachment();
      return;
    }

    try {
      setIsUploading(true);

      const { data } = await uploadImage(attachmentFile.current);
      onSend?.({
        url: data.image?.url ?? data.url,
        alt: data.title,
        thumbnailUrl: data.thumb?.url,
      });
      // clear atttachment after upload
      clearAttachment();
    } catch (e) {
      console.error(e);
      setRawValue(val => `${val} Error: try again`);
    } finally {
      setIsUploading(false);
    }
  };

  // Called when input field changes
  const onChange: InputEvent = raw => {
    if (mode === Mode.TEXT) {
      setRawValue(raw);
    }
    // user deleted an image (backspace)
    // go back to text mode
    else if (raw === '') {
      clearAttachment();
    }
    // don't change value otherwise in image mode
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
