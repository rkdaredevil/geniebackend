const express = require('express');
const controller = require('../../controllers/upload.controller');
const multer = require('multer');
const router = express.Router();
const storage = multer.memoryStorage({
	destination: function(req, file, callback) {
		callback(null, '');
	}
});
const multipleUpload = multer({
	storage: storage
}).array('file');
const upload = multer({
	storage: storage
}).single('file');
/**
 * @api {post} v1/upload upload to s3
 * @apiVersion 1.0.0
 * @apiPermission public
 *
 * @apiSuccess (Created 201) {String} 
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/upload')
	.post(multipleUpload, controller.uploadFiles);

module.exports = router;