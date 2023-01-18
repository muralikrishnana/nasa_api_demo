export interface NASA_API_Response {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  // for videos
  thumbnail_url?: string;
}

export interface APOD_Request_Data {
  startDate: string;
  endDate: string;
}

export interface Success_Based_Response<T> {
  success: boolean;
  data?: T;
}
