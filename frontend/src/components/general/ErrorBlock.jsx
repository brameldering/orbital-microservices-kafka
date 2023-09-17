import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const ErrorBlock = ({ error }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={8}>
          <Card
            style={{
              padding: '1rem 1rem',
              margin: '0rem',
              background: '#fc6f6f',
              color: '#000000',
            }}>
            <p>
              <strong>An Error occured on our side</strong>
            </p>
            <p>
              <strong>Status code:</strong> {error?.status}
            </p>
            <strong>Error message:</strong>{' '}
            {error?.data?.message || error?.error}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorBlock;
