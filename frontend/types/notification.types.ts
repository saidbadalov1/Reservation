export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "system";
  appointmentId?: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
