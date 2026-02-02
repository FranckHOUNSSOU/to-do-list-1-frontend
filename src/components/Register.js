import React, { useState } from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import {  FcPrevious } from 'react-icons/fc';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api, { API_URL } from '../api';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {emailValidator, nomValidator, prenomValidator, telephoneValidator, mot_de_passeValidator } from '../validations/users';

function Register() {

  const schema = yup.object().shape({
    email:emailValidator,
    nom:nomValidator,
    prenom:prenomValidator,
    telephone:telephoneValidator,
    mot_de_passe:mot_de_passeValidator
  });

  const[error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
  register, 
  handleSubmit, 
  formState:{errors}, 
  reset}= useForm({resolver:yupResolver(schema)
  });
  

  const onSubmit = async (data) => {
    if (data.mot_de_passe !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setConfirmPassword('');
      return;
    }
    try {
      await api.post('/auth/register', { 
        email: data.email,
        nom: data.nom, 
        prenom: data.prenom, 
        telephone: data.telephone, 
        mot_de_passe: data.mot_de_passe 
      });
      setSuccess('Inscription réussie');
      reset();
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-center">Inscription</h2>
          <div className="mb-3">
            <button type="button" className="btn btn-warning w-25" onClick={() => navigate('/')} style={{ border: 'none' }}> <FcPrevious/>Retour </button>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email" {...register('email')}
              />
              <p className='text-danger'>{errors.email?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom" {...register('nom')}
              />
              <p className='text-danger'>{errors.nom?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Prénom" {...register('prenom')}
              />
              <p className='text-danger'>{errors.prenom?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Téléphone" {...register('telephone')}
              />
              <p className='text-danger'>{errors.telephone?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe" {...register('mot_de_passe')}
              />
              <p className='text-danger'>{errors.mot_de_passe?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Comfirmer le mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: 10 }}>{success}</div>}
            <div className="d-grid">
              <Button variant="success" type="submit">
                S'inscrire
              </Button>
            </div>
          </Form>
          <p className="mb-4 text-center">Se connecter si vous avez déjà un compte.</p>
          <Button variant="primary" onClick={() => navigate('/')} >Se connecter</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 

