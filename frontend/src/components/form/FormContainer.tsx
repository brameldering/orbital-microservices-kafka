import React, { ReactNode } from 'react';
import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FunctionComponent<FormContainerProps> = ({
  children,
}) => {
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
