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
  /** The chef this is about — absent on a platform-wide notice (a global
     discount), present on `new_recipe`/`new_cookbook`. The REST list is
     already scoped server-side to chefs you follow; this rides along so a
     live socket push can be filtered the same way client-side. */
  chefId?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: AppNotification[];
  lastReadAt: string | null;
}
