import React, { useState } from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {emailValidator, mot_de_passeValidator } from '../validations/users';



function Login(){
  
  const schema = yup.object().shape({
      email:emailValidator,
      mot_de_passe:mot_de_passeValidator
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register, 
    handleSubmit, 
    formState:{errors}, 
    reset}= useForm({resolver:yupResolver(schema)
    });

  const onSubmit = async (data) => {
    console.log('connexion avec:', data);
    try {
      const res = await axios.post('/api/auth/login', { email: data.email, mot_de_passe: data.mot_de_passe });
      sessionStorage.setItem('token', res.data.token);
      reset();
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur lors de la connexion');
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div></div>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-center">Connexion</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email" {...register('email')}
              />
              <p className='text-danger'>{errors.email?.message}</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe" {...register('mot_de_passe')}
              />
              <p className='text-danger'>{errors.mot_de_passe?.message}</p>
            </Form.Group>
            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Se connecter
              </Button>
            </div>
          </Form>
          <p className="mb-4 text-center">S'inscrire si vous n'avez pas de compte.</p>
          <Button variant="success" onClick={() => navigate('/register')} >S'inscrire</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 