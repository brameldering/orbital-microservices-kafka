import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

// interface FormContainerProps {
//   children: ReactNode;
// }

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
