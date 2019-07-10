import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }} className="ui five item menu">
      <Link route="/">
        <a className="item">Home</a>
      </Link>
      <Link route="/market">
        <a className="item">Market</a>
      </Link>
      <Link route="/buy">
        <a className="item">Buy Units</a>
      </Link>
      <Link route="/battle">
        <a className="item">Battle!</a>
      </Link>
      <Link route="/my_units">
        <a className="item">My Units</a>
      </Link>
    </Menu>
  )
}