const express = require('express');
const controller = require('../../controllers/upload.controller');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const router = express.Router();

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
  .post(multipartMiddleware,controller.upload);

module.exports = router;