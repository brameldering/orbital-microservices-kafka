import React, { ReactNode } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FunctionComponent<FormContainerProps> = ({
  children,
}) => {
  return (
    <Container style={{ margin: '2rem' }}>
      <Row className='justify-content-md-center'>
        <Col xs={1} sm={1} md={2} lg={3} xl={3}></Col>
        <Col xs={10} sm={10} md={8} lg={6} xl={6}>
          <Card style={{ padding: '1rem', borderColor: '#606060' }}>
            {children}
          </Card>
        </Col>
        <Col xs={1} sm={1} md={2} lg={3} xl={3}></Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
