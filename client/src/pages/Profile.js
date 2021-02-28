import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Form, Icon, Image } from 'semantic-ui-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { parseISO } from 'date-fns';
import PFP from '../assets/defaultPFP.jpg';

import { AuthContext } from '../context/auth';
import { GET_AUTHOR_PFP } from '../util/graphql';

const Profile = (props) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    props.history.push('/');
  }
  const [errors, setErrors] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileLocation, setFileLocation] = useState(null);
  const [edit, setEdit] = useState(false);

  const onChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (uploadedFile === null) {
      setErrors({
        image: 'Please select an image before attempting to upload.',
      });
    }
    s3Upload();
  };

  const { data } = useQuery(GET_AUTHOR_PFP, {
    variables: {
      username: user.username,
    },
  });

  useEffect(() => {}, [data]);

  const [editPFPMutation] = useMutation(EDIT_PFP, {
    onCompleted() {
      props.history.push('/');
    },
    onError(err) {
      return err;
    },
    variables: {
      location: fileLocation,
    },
  });

  const [s3Upload, { loading }] = useMutation(S3_UPLOADER, {
    onCompleted(res) {
      setFileLocation(res.s3Upload.location);
      editPFPMutation();
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      return err;
    },
    variables: {
      file: uploadedFile,
    },
  });

  const toggleEdit = () => {
    setEdit((prevEdit) => !prevEdit);
  };

  return (
    <Card>
      <Image src={data ? data.getAuthorPFP : PFP} />
      <Card.Content>
        <Card.Header>{user.username}</Card.Header>
        <Card.Meta>
          <span>Joined on {parseISO(user.createdAt).toDateString()}</span>
        </Card.Meta>
        <Card.Description></Card.Description>
      </Card.Content>
      <Card.Content extra>
        {edit ? (
          <Form
            onSubmit={onSubmit}
            encType='multipart/form-data'
            noValidate
            className={loading ? 'loading' : ''}
            style={{ marginBottom: '15px' }}
          >
            <Form.Input
              label='Upload your new profile picture'
              name='document'
              type='file'
              onChange={onChange}
              error={errors.image ? true : false}
            ></Form.Input>
            <Button type='submit'>Upload selected file</Button>
          </Form>
        ) : null}
        <Button basic icon onClick={toggleEdit}>
          <Icon name='edit' /> Edit Profile Picture
        </Button>
        {Object.keys(errors).length > 0 && (
          <div className='ui error message'>
            <ul className='list'>
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

const EDIT_PFP = gql`
  mutation editPFP($location: String!) {
    editPFP(location: $location)
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

export default Profile;
