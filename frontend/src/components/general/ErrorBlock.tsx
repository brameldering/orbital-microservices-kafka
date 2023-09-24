import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

interface FormContainerErrorProps {
  errorMessage: string;
}

const ErrorBlock: React.FunctionComponent<FormContainerErrorProps> = ({
  errorMessage,
}) => {
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
            {errorMessage}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorBlock;
