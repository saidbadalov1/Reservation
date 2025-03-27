import api from "./api";

interface WorkingHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

export interface DoctorSettings {
  workingHours: WorkingHour[];
  appointmentDuration: number;
  blockedTimeSlots: string[];
}

export const doctorSettingsApi = {
  getSettings: async (doctorId: string): Promise<DoctorSettings> => {
    const response = await api.get(`/doctor-settings/${doctorId}`);
    return response.data;
  },

  // Protected endpoints - requires authentication
  updateWorkingHours: async (
    workingHours: WorkingHour[]
  ): Promise<DoctorSettings> => {
    const response = await api.put("/doctor-settings/working-hours", {
      workingHours,
    });
    return response.data;
  },

  updateAppointmentDuration: async (
    duration: number
  ): Promise<DoctorSettings> => {
    const response = await api.put("/doctor-settings/appointment-duration", {
      appointmentDuration: duration,
    });
    return response.data;
  },

  blockTimeSlot: async (date: string): Promise<DoctorSettings> => {
    const response = await api.post("/doctor-settings/block-time-slot", {
      date,
    });
    return response.data;
  },

  unblockTimeSlot: async (date: string): Promise<DoctorSettings> => {
    const response = await api.post("/doctor-settings/unblock-time-slot", {
      date,
    });
    return response.data;
  },
};
