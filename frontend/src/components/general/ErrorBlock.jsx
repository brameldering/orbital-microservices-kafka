import { Container, Card, Row, Col } from 'react-bootstrap';

const ErrorBlock = ({ error }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={8}>
          <Card
            style={{
              padding: '1rem 1rem',
              margin: '1rem',
              background: '#fc6f6f',
              color: '#000000',
            }}
          >
            <p>
              <strong>An Error occured on our side</strong>
            </p>
            <p>Status code: {error.status}</p>
            Error message: {error.data?.message}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorBlock;
