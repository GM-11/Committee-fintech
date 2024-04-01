const Committee = require("../models/committeeSchema");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

async function createCommittee(req, res) {
  try {
    const { name, totalAmount, duration, email } = req.body;

    const id = new mongoose.mongo.ObjectId();
    const user = await User.findOne({ email });

    const newCommittee = new Committee({
      name,
      totalAmount,
      duration,
      id,
      isActive: true,
      startDate: Date.now(),
      membersList: [user.email],
      admin: user.email,
      requests: [],
    });

    await newCommittee.save();

    res.status(200).json({
      message: "Committee created successfully",
      result: newCommittee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal error" });
  }
}

async function joinCommittee(req, res) {
  const { email, id } = req.body;

  const committee = await Committee.findOne({ id });

  if (!committee) {
    return res.status(400).json({ message: "Wrong ID" });
  }

  const user = await User.findOne({ email });

  const filter = { id: id };
  const update = { $push: { requests: user.email } };

  Committee.updateOne(filter, update).then((err, result) => {
    console.log(committee.requests);
    if (err) {
      res.status(400).json({ message: err });
    } else {
      res.status(200).json({ message: "Added request", result });
    }
  });
}
async function approveUserInCommittee(req, res) {
  const { email, id } = req.body;

  const committee = Committee.findOne({ id });

  if (!committee) {
    return res.status(400).json({ message: "Wrong ID" });
  }

  const user = User.findOne({ email });

  const filter = { id: id };
  const update = { $push: { members: user }, $pull: { requests: user } };

  Committee.updateOne(filter, update, (err, result) => {
    if (err) {
      res.status(400).json({ message: err.toString() });
    } else {
      res.status(200).json({ message: "Added request", result });
    }
  });
}

module.exports = { createCommittee, joinCommittee };
