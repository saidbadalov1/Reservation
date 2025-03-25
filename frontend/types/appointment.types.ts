export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AppointmentDate {
  date: string;
  slots: TimeSlot[];
}

export interface GetAvailableDatesResponse {
  availableDates: AppointmentDate[];
} 