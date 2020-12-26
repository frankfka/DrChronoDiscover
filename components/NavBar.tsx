import './Navbar.scss';

import { Button, Row, Space } from 'antd';
import React from 'react';

interface NavBarProps {
  inverted?: boolean;
}

export default function NavBar({ inverted }: NavBarProps): JSX.Element {
  return (
    <Row
      style={{ padding: '1em 3em', alignItems: 'center' }}
      className={inverted ? 'navbar-inverted' : 'navbar'}
    >
      <img
        src={inverted ? '/images/logo.png' : '/images/logo_dark.png'}
        alt="Logo"
        height="32"
      />
      <div style={{ flexGrow: 1 }} />
      <Space>
        <Button type="link" size={'large'}>
          About
        </Button>
        <Button type="link" size={'large'}>
          Contact
        </Button>
        <Button type="primary" style={{ marginLeft: '1em' }} size={'large'}>
          Provider Login
        </Button>
      </Space>
    </Row>
  );
}
