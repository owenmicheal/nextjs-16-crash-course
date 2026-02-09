import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * TypeScript interface for Event document
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event schema definition with validation and indexes
 */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Event audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Generate URL-friendly slug from title
 * Converts to lowercase, replaces spaces with hyphens, removes special characters
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Normalize date to ISO 8601 format (YYYY-MM-DD)
 * Accepts various date formats and converts them to ISO
 */
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Please provide a valid date.');
  }
  
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

/**
 * Normalize time to 24-hour format (HH:MM)
 * Accepts various time formats and standardizes them
 */
function normalizeTime(timeString: string): string {
  // If already in HH:MM format, validate and return
  const time24HourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  
  if (time24HourRegex.test(timeString.trim())) {
    return timeString.trim();
  }
  
  // Try to parse as a date object to handle various formats
  const dateTime = new Date(`1970-01-01 ${timeString}`);
  
  if (isNaN(dateTime.getTime())) {
    throw new Error('Invalid time format. Please use HH:MM format (24-hour).');
  }
  
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Pre-save hook to auto-generate slug and normalize date/time
 * Only regenerates slug if title has changed
 */
eventSchema.pre('save', function (next) {
  try {
    // Generate slug only if title is new or modified
    if (this.isNew || this.isModified('title')) {
      this.slug = generateSlug(this.title);
    }
    
    // Normalize date if it's new or modified
    if (this.isNew || this.isModified('date')) {
      this.date = normalizeDate(this.date);
    }
    
    // Normalize time if it's new or modified
    if (this.isNew || this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Create unique index on slug for faster queries and uniqueness enforcement
 */
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model
 * Prevents model recompilation during Next.js hot reloads in development
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
