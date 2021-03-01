import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

const Register = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fileLocation, setFileLocation] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const imageOnChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const onImgSubmit = (e) => {
    e.preventDefault();
    if (uploadedFile === null) {
      setErrors({
        image: 'Please select an image before attempting to upload.',
      });
    }
    s3Upload();
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  const [s3Upload] = useMutation(S3_UPLOADER, {
    onCompleted(res) {
      return setFileLocation(res.s3Upload.location);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      return err;
    },
    variables: {
      file: uploadedFile,
    },
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      imgUrl: fileLocation,
    },
  });

  return (
    <div className='form-container'>
      <Form
        onSubmit={onSubmit}
        encType='multipart/form-data'
        noValidate
        className={loading ? 'loading' : ''}
      >
        <h1>Register</h1>
        <Form.Input
          label='Username'
          placeholder='Username'
          name='username'
          type='text'
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label='Email'
          placeholder='youremail@email.com'
          autoComplete='email'
          name='email'
          type='email'
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label='Password'
          placeholder='Password'
          autoComplete='new-password'
          name='password'
          type='password'
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label='Confirm Password'
          placeholder='Confirm Password'
          autoComplete='new-password'
          name='confirmPassword'
          type='password'
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label='Upload a profile picture (or not 🤷)'
          name='document'
          type='file'
          onChange={imageOnChange}
          error={errors.image ? true : false}
        ></Form.Input>
        <Button
          type='button'
          color={uploadedFile ? 'purple' : 'grey'}
          disabled={uploadedFile ? false : true}
          onClick={onImgSubmit}
        >
          Upload Selected File
        </Button>
        <Button type='submit' primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $imgUrl: String
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        imgUrl: $imgUrl
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

const S3_UPLOADER = gql`
  mutation s3Upload($file: Upload!) {
    s3Upload(file: $file) {
      key
      location
      bucket
    }
  }
`;

export default Register;
