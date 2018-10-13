const AWS = require('aws-sdk');
const User = require('../models/user.model');
exports.uploadFiles = function(req, res, next) {

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
				if (err) {
					res.json({
						"error": true,
						"Message": err
					});
				} else {
					ResponseData.push(data);

					User.findById({
						'_id': req.body.id
					}, function(err, user) {
						for (var item of ResponseData) {
							user.images.push(item.Location);
							user.save()
								.then(savedUser => res.status(200).json(savedUser))
								.catch(e => next(User.checkDuplicateEmail(e)));

						}

					});


				}
			});
		});
	});
}