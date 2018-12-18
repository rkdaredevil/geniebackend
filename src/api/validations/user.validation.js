const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
      phone: Joi.number().integer().required(),
      gender: Joi.string().valid(['Male', 'Female', 'Other']).required(),
      authType: Joi.string().valid(['facebook', 'phone']).required(),
      profileImage: Joi.string().allow(''),
      display_name: Joi.string().valid(['First Name', 'Full Name', 'Initials']).required(),
      age: Joi.number().required().min(18),
      height: Joi.string().allow(''),
      education: Joi.string().allow(''),
      birthday: Joi.string().allow(''),
      company_name: Joi.string().allow(''),
      job_title: Joi.string().allow(''),
      lives_in: Joi.string().allow(''),
      car_model: Joi.string().allow(''),
      body_type: Joi.string().allow(''),
      interests: Joi.string().allow(''),
      about_me: Joi.string().allow(''),
      fbID: Joi.string().allow(''),
      firebase_token: Joi.string().allow(''),
      hash: Joi.string().allow(''),
      images: Joi.array().items(Joi.string().allow(''))
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};