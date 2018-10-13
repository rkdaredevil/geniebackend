var otpGenerator = require('otp-generator');
const User = require('../models/user.model');

exports.generateOtp = async (req, res, next) => {
	try {
		const otp = otpGenerator.generate(6, {
			digits: true,
			specialChars: false,
			alphabets: false,
			upperCase: false
		});
		const {
			email
		} = req.body;
		const message = await User.FindOneAndUpdate({
			email
		}, {
			otp
		});

		return res.status(200).send({
			otp
		});
	} catch (err) {
		return next(err);
	}
}

