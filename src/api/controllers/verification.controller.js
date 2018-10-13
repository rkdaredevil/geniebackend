var mjml2html = require('mjml');
var credentials = require('../../config/credentials');
var registrationTemplate = require('../../templates/email/registration');
var client = require('../../config/client');
var BulkMailer = require("../services/bulkEmail");
const User = require('../models/user.model');

var bulkMailer = new BulkMailer({
  transport: credentials.email,
  verbose: true
});

var __mailerOptions = (hash, options) => {
  var companyLogo = client.logoUrl;
  var verificationUrl = `${client.baseUrl}${client.verifyEmail}/${hash}`;
  var template = registrationTemplate(companyLogo, verificationUrl);
  var html = mjml2html(template);

  var mailOptions = options;
  mailOptions['html'] = html.html;
  mailOptions['text'] = 'Hi there!';
  mailOptions['from'] = credentials.email.auth.user;
  mailOptions['subject'] = 'Please verify your email';

  return mailOptions;
}

exports.sendVerificationEmail = (hash, options) => {
  var mailerOptions = __mailerOptions(hash, options);
  bulkMailer.send(mailerOptions, true, (error, result) => { // arg1: mailinfo, agr2: parallel mails, arg3: callback
    if (error) {
      console.error(error);
    } else {
      console.info(result);
    }
  });
}

exports.verifyUserEmail = async (req, res, next) => {
  const {
    uuid
  } = req.params;

  try {
    const message = await User.verifyEmail(uuid);
    return res.status(200).send(message);
  } catch (err) {
    return next(err);
  }
}

exports.verifyMobileOtp = async (req, res, next) => {
  const {
    email,
    otp
  } = req.body;
  try {
    const message = await User.verifyMobileOtp(email, otp);
    return res.status(200).send(message);
  } catch (err) {
    return next(err);
  }
}