const mongoose = require("mongoose");
const User = require("../models/userModel");

const committeeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  membersList: { type: [String], required: true },
  totalAmount: { type: Number, required: true },
  duration: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
  startDate: { type: Date, required: true },
  admin: { type: String, required: true },
  requests: { type: [String] },
});

const Committee = mongoose.model("Committee", committeeSchema);
module.exports = Committee;
