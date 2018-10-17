const AWS = require('aws-sdk');
const User = require('../models/user.model');
const _ = require('lodash');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const {
	jwtExpirationInterval
} = require('../../config/vars');

function generateTokenResponse(user, accessToken) {
	const tokenType = 'Bearer';
	const refreshToken = RefreshToken.generate(user).token;
	const expiresIn = moment().add(jwtExpirationInterval, 'days');
	return {
		tokenType,
		accessToken,
		refreshToken,
		expiresIn,
	};
}

exports.uploadFiles = function(req, res, next) {
	let _id = req.body.id;
	let file = req.files;
	let s3bucket = new AWS.S3({
		accessKeyId: '',
		secretAccessKey: '',
		region: 'us-west-2',
		Bucket: 'genieimagebucket'
	});
	s3bucket.createBucket(function() {
		let Bucket_Path = 'genieimagebucket';

		var ResponseData = [];

		file.map((item) => {
			var params = {
				Bucket: Bucket_Path,
				Key: item.originalname,
				Body: item.buffer,
				ACL: 'public-read'
			};
			s3bucket.upload(params, function(err, data) {

				ResponseData.push(data);
				if (_id) {
					User.findById(_id, function(err, user) {
						for (var item of ResponseData) {
							user.images.push(item.Location);
							user.save(function(err, data) {
								if (err) {
									res.status(422).send({
										message: 'something went wrong'
									})
								} else {
									res.status(200).send(data);
								}
							})
						}
					})
				} else {

					var body = _.pick(req.body, ['name', 'phone', 'password', 'gender']);
					var user = new User(req.body);
					for (var item of ResponseData) {
						const token = generateTokenResponse(user, user.token());
						user.images.push(item.Location);
						user.save()
							.then(savedUser => res.status(200).json({
								token,
								user: savedUser
							}))
							.catch(e => res.status(400).send(e));

					}
				}

			});
		});
	});
};