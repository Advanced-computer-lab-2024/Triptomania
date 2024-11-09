import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    yearsOfExperience: { type: Number },
    previousWork: { type: String },
    type: {type: String,default: 'tourGuide'},
    deleteAccount:{
    type: Boolean,
    default: false
  }

},{timestamps:true});

UserSchema.pre('save', async function(next){
    const tourguide = this;
  
    if(!tourguide.isModified('password')) return next();
  
    try{
      const saltRounds= 10;
      tourguide.password = await bcrypt.hash(tourguide.password, saltRounds);
      next();
    }catch(error){
      next(error);
    }
  });

  UserSchema.pre('findOneAndUpdate', async function(next) {
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

const tourguide = mongoose.model('TourGuide', UserSchema);
export default tourguide;
