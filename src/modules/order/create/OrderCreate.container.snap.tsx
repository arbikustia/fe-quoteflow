import React from 'react';

jest.mock('./OrderCreate.hook', () => ({
  useOrderCreateLogic: () => ({}),
}));
jest.mock('./OrderCreate.component', () => ({
  OrderCreateComponent: (): React.ReactElement => React.createElement('div', null, 'Order create form'),
}));

import OrderCreateContainer from './OrderCreate.container';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render OrderCreateContainer'
  }
];

test.assertSnapshots(OrderCreateContainer, configs);
