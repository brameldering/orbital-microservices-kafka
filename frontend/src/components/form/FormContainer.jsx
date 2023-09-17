import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <Card style={{ padding: '2rem 4rem' }}>{children}</Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
