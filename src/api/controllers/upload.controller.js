const AWS = require('aws-sdk')
const async = require('async')
const bucketName = "rupesh-kt"
const path = require('path')
const fs = require('fs')
let pathParams, image, imageName;

/** Load Config File */
AWS.config.loadFromPath('src/config/config.json')

/** After config file load, create object for s3*/
const s3 = new AWS.S3({region: 'us-west-2'})
const createMainBucket = (callback) => {
	// Create the parameters for calling createBucket
	const bucketParams = {
	   Bucket : bucketName
	};                    
	s3.headBucket(bucketParams, function(err, data) {
	   if (err) {
	   	console.log("ErrorHeadBucket", err)
	      	s3.createBucket(bucketParams, function(err, data) {
			   if (err) {
			   	console.log("Error", err)
			      callback(err, null)
			   } else {
			      callback(null, data)
			   }
			});
	   } else {
	      callback(null, data)
	   }
	})                             
}

const createItemObject = (callback) => {
  const params = { 
        Bucket: bucketName, 
        Key: `${imageName}`, 
        ACL: 'public-read',
        Body:image
    };
	s3.putObject(params, function (err, data) {
		if (err) {
	    	console.log("Error uploading image: ", err);
	    	callback(err, null)
	    } else {
	    	console.log("Successfully uploaded image on S3", data);
	    	callback(null, data)
	    }
	})  
}
exports.upload = (req, res, next) => {
	var tmp_path = req.files.file.path;
    // console.log("item", req.files.file)
	var tmp_path = req.files.file.path;
	image = fs.createReadStream(tmp_path);
    imageName = req.files.file.name;
    async.series([
        createMainBucket,
        createItemObject
        ], (err, result) => {
        	console.log(result);
        if(err) return res.send(err)

        else return res.json({
        	res: result,
        	message: "Successfully uploaded"}) 
    })
}