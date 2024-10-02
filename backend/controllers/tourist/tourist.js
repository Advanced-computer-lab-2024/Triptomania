// #Task route solution
const tourist= require('../Models/tourist.js');
const { default: mongoose } = require('mongoose');

const createActivity = async(req,res) => {
   const {Category , Price} = req.body ;
   try{
    const newActivity = new tourist ({Category , Price});
    await newActivity.save();
    res.status (201).json(newActivity);
   } catch (error){
    res.status(500).json({message:"error"});
   }
   
}



module.exports = {createActivity};
