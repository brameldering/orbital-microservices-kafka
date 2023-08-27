import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <div className='card' style={{ padding: '2rem 4rem' }}>
            {' '}
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
