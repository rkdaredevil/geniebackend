const Joi = require('joi');

module.exports = {
  // POST /v1/auth/register
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    },
  },

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: {
      access_token: Joi.string().required(),
      fbID:Joi.string().allow(''),
    },
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    },
  },

  registerPhone: {
    body: {
      name: Joi.string().min(3).max(30).required(),
      phone: Joi.number().integer().min(100000000000).max(999999999999),
      gender: Joi.string().valid(['Male', 'Female', 'Other']).required(),
      authType: Joi.string().valid(['facebook', 'phone']).required(),
      profileImage: Joi.string().allow(''),
      display_name: Joi.string().valid(['First Name', 'Full Name', 'Initials']).required(),
      age: Joi.number().required().min(18),
      height: Joi.string().allow(''),
      education: Joi.string().allow(''),
      company_name: Joi.string().allow(''),
      job_title: Joi.string().allow(''),
      lives_in: Joi.string().allow(''),
      car_model: Joi.string().allow(''),
      userID: Joi.number().integer(),
      body_type: Joi.string().allow(''),
      about_me: Joi.string().allow(''),
      fbID: Joi.string().allow(''),
      firebase_token: Joi.string().allow(''),
      hash: Joi.string().allow(''),
      images: Joi.array().items(Joi.string().allow(''))
    },

  },

  loginPhone: {
    body: {
      phone: Joi.number().integer().min(100000000000).max(999999999999),
      authType: Joi.string().valid(['facebook', 'phone']).required(),
      fbID: Joi.string().allow(''),
      hash: Joi.string().allow('')
    },
  },
};