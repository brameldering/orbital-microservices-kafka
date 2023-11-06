import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

const Footer: React.FunctionComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>Orbitelco Shop &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
