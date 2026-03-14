export const QUEUE_NAME = "rental-jobs";

export const JOB_TYPES = {
  bookingConfirmationEmail: "booking.confirmation.email",
  documentGeneration: "booking.document.generate",
  reminderScheduling: "booking.reminder.schedule"
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

export interface BookingConfirmationPayload {
  bookingId: string;
  tenantId: string;
  recipientEmail: string;
}

export interface DocumentGenerationPayload {
  bookingId: string;
  tenantId: string;
  documentType: "quote" | "invoice" | "rental_contract";
}

export interface ReminderSchedulingPayload {
  bookingId: string;
  tenantId: string;
  remindAt: string;
}
