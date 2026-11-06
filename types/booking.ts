export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface AvailabilityRange {
  startTime: string;
  endTime: string;
  startAt: string;
  endAt: string;
}

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  hostEmail: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  startAt: string;
  endAt: string;
  hours: number;
  totalPrice: number;
  securityDeposit: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingPayload {
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}
