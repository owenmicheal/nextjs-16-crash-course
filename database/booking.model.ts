import mongoose, { Document, Model, Schema, Types } from 'mongoose';

/**
 * TypeScript interface for Booking document
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking schema definition with validation and indexes
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster queries on eventId
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string): boolean {
          // RFC 5322 compliant email regex (simplified)
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents orphaned bookings by ensuring event reference integrity
 */
bookingSchema.pre('save', async function (next) {
  try {
    // Only validate eventId if it's new or has been modified
    if (this.isNew || this.isModified('eventId')) {
      // Dynamically import Event model to avoid circular dependency
      const Event = mongoose.models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.exists({ _id: this.eventId });
      
      if (!eventExists) {
        throw new Error(
          `Event with ID ${this.eventId} does not exist. Cannot create booking for non-existent event.`
        );
      }
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Create index on eventId for efficient lookups
 * Helps with queries like "find all bookings for a specific event"
 */
bookingSchema.index({ eventId: 1 });

/**
 * Compound index for efficient queries by event and email
 * Useful for checking if a user already booked a specific event
 */
bookingSchema.index({ eventId: 1, email: 1 });

/**
 * Booking model
 * Prevents model recompilation during Next.js hot reloads in development
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
