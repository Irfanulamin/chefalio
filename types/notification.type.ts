export type NotificationType = 'new_recipe' | 'new_cookbook' | 'discount';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  actorName?: string;
  actorAvatar?: string;
  targetId?: string;
  thumbnail?: string;
  discount?: number;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: AppNotification[];
  lastReadAt: string | null;
}
