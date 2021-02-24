const { GraphQLUpload } = require('graphql-upload');
const AWS = require('aws-sdk');
const { format } = require('date-fns');
const { UserInputError } = require('apollo-server');
const { imageTypeValidator } = require('../../util/validators');
require('dotenv').config();

const credentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  credentials,
});

const formatFileName = (fileName) => {
  const date = format(new Date(), 'MM-dd-yyyy');
  const randomString = Math.random().toString(36).substring(2, 7);
  const cleanFileName = fileName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newFileName = `${date}-${randomString}-${cleanFileName}`;
  return newFileName.substring(0, 60);
};

module.exports = {
  Upload: GraphQLUpload,
  Mutation: {
    s3Upload: async (_, args) => {
      const file = await args.file;
      const { createReadStream, filename, mimeType } = file;
      const fileParts = filename.split('.');
      const { errors, valid } = imageTypeValidator(`.${fileParts[1]}`);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      const cleanFileName = formatFileName(fileParts[0]);
      const fileStream = createReadStream();
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${cleanFileName}.${fileParts[1]}`,
        Body: fileStream,
      };
      const result = await s3.upload(uploadParams).promise();
      const fileData = {
        key: result.key,
        location: result.Location,
        bucket: process.env.AWS_BUCKET,
      };
      return fileData;
    },
  },
};
