import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

// interface FormContainerProps {
//   children: ReactNode;
// }

const FormContainer = ({ children }) => {
  return (
    <Container style={{ margin: '2rem' }}>
      <Row className='justify-content-md-center'>
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card style={{ padding: '1rem 3rem', borderColor: '#606060' }}>
            {children}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
