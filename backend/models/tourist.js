import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const touristSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  deleteAccount:{
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  job_Student: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'tourist',
  },
  underage: {
    type: Boolean,
  },
  points: {
    type: Number,
    default: 0,
  },
  badge: {
    type: String,
    default: 'BRONZE',
  },
  level: {
    type: Number,
    default: 1,
  },
  preferences: {
    type: Array,
    default: [],
  },
  hotelBookings: [
    {
      type: String,
    },
  ],
  flightBookings: [
    {
      type: String,
    },
  ],
  transportationBookings: [
    {
      type: Object
    }
  ],
  deleteAccount:{
    type: Boolean,
    default: false
  },
  resetToken: {
      type: String,
  },
  resetTokenExpiration: {
      type: Date,
  },
  cart: [
    Object
  ],
  whishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  deliveryAddresses: [
    Object
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
    }
  ],
  fcmToken: {
      type: String
  },
  itineraries: [
    Object
  ],
  activities: [
    Object
  ],
  bookmarkedActivities: [
    {
      type: mongoose.Schema.Types.ObjectId,
    }
  ],
  bookmarkedItineraries: [
    {
      type: mongoose.Schema.Types.ObjectId,
    }
  ]
}, { timestamps: true });

touristSchema.pre('save', async function (next) {
  const tourist = this;

  if (!tourist.isModified('password')) return next();

  try {
    const saltRounds = 10;
    tourist.password = await bcrypt.hash(tourist.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

touristSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  
  if (update.password) {
    try {
      const saltRounds = 10;
      update.password = await bcrypt.hash(update.password, saltRounds);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Tourist = mongoose.model('Tourist', touristSchema);

export default Tourist;
