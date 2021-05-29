const IMGBB_API_ENDPOINT_URL = 'https://api.imgbb.com/1/upload';
const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_KEY;

const DEFAULT_EXPIRATION_TIME = 60 * 60 * 24; // 24 hours
const IMAGE_EXPIRATION_TIME =
  process.env.REACT_APP_IMAGE_EXPIRE_TIME || DEFAULT_EXPIRATION_TIME.toString();

export interface PhotoUploadResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    size: number;
    time: string | number;
    expiration: string | number;
    image?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export async function uploadImage(image: File): Promise<PhotoUploadResponse> {
  if (!IMGBB_API_KEY) {
    throw new Error('Image hosting API key is not defined! Please define REACT_APP_IMGBB_KEY');
  }

  const formData = new FormData();
  formData.append('image', image);
  formData.append('key', IMGBB_API_KEY);
  formData.append('expiration', IMAGE_EXPIRATION_TIME);

  try {
    const response = await fetch(IMGBB_API_ENDPOINT_URL, {
      method: 'POST',
      body: formData,
    });

    const body = (await response.json()) as PhotoUploadResponse;
    if (body.success) {
      return body;
    }
    throw new Error('Uploading image failed: ' + JSON.stringify(body));
  } catch (e) {
    throw new Error('Error when uploading image: ' + e);
  }
}
