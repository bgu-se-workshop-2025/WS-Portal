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
  content: string;
  createdAt: number;
  resourceId?: string;
  resourceType?: string;
  userIds: string[];
}
