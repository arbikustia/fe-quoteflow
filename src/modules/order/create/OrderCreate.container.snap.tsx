import React from 'react';

jest.mock('./OrderCreate.hook', () => ({
  /**
   * Return empty order-create logic for the snapshot.
   * @returns {object} Empty logic object.
   */
  useOrderCreateLogic: (): Record<string, never> => ({}),
}));
jest.mock('./OrderCreate.component', () => ({
  /**
   * Render the mocked order-create form.
   * @returns {React.ReactElement} Mocked form element.
   */
  OrderCreateComponent: (): React.ReactElement => React.createElement('div', null, 'Order create form'),
}));

import test from '../../../libs/unit-test';

import OrderCreateContainer from './OrderCreate.container';

const configs = [
  {
    props: {},
    desc: 'Should Render OrderCreateContainer'
  }
];

test.assertSnapshots(OrderCreateContainer, configs);
