/* eslint-disable camelcase */
const axios = require('axios');

exports.facebook = async (access_token) => {
  const fields = 'id, name, email, picture,birthday,gender';
  const url = 'https://graph.facebook.com/me';
  const params = {
    access_token,
    fields
  };
  const response = await axios.get(url, {
    params
  });
  const {
    id,
    name,
    email,
    picture,
    birthday,
    gender
  } = response.data;
  return {
    service: 'facebook',
    picture: picture.data.url,
    id,
    name,
    email,
    birthday,
    gender
  };
};

exports.google = async (access_token) => {
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const params = {
    access_token
  };
  const response = await axios.get(url, {
    params
  });
  const {
    sub,
    name,
    email,
    picture,
    birthday,
    address,
    education
  } = response.data;
  return {
    service: 'google',
    picture,
    id: sub,
    name,
    email,
    birthday,
    address,
    education
  };
};