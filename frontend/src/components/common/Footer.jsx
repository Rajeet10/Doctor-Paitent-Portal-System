import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <Container>
        <div className="text-center">
          <p className="mb-0">&copy; 2024 Healthcare Portal. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;