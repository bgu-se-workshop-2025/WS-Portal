export interface GeneralAuthResponse {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    authorities?: string[];
    token?: string;
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}
