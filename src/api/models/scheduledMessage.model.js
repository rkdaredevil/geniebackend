const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

/**
 * Scheduled Message Schema
 * @private
 */
const scheduledMessageSchema = new mongoose.Schema({
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true
  },

  savingTime: {
    type: Date,
    default: Date.now
  },
  sendingTime: {
    type: Date,
    required: true
  },
  expires: {
    type: Boolean,
    default: false
  }
});

scheduledMessageSchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {RefreshToken}
   */
  // generate(user) {
  //   const userId = user._id;
  //   const userEmail = user.email;
  //   const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
  //   const expires = moment().add(30, 'days').toDate();
  //   const tokenObject = new RefreshToken({
  //     token,
  //     userId,
  //     userEmail,
  //     expires,
  //   });
  //   tokenObject.save();
  //   return tokenObject;
  // },

};

/**
 * @typedef RefreshToken
 */
const ScheduledMessage = mongoose.model('ScheduledMessage', scheduledMessageSchema);
module.exports = ScheduledMessage;