//const mongoose = require('mongoose');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    mobile: { type: String},
    description: { type: String }, 
    type: {type: String,default: 'seller'}
    
}, {timestamps:true});

SellerSchema.pre('save', async function(next){
    const seller = this;
  
    if(!seller.isModified('password')) return next();
  
    try{
      const saltRounds= 10;
      seller.password = await bcrypt.hash(seller.password, saltRounds);
      next();
    }catch(error){
      next(error);
    }
  });

  SellerSchema.pre('findOneAndUpdate', async function(next) {
    const updatethis = this.getUpdate();
    
    if (updatethis.password) {
      try {
        const saltRounds = 10;
        updatethis.password = await bcrypt.hash(updatethis.password, saltRounds);
      } catch (error) {
        return next(error);
      }
    }
    next();
  });
  


const Seller = mongoose.model('Seller', SellerSchema);
export default Seller;