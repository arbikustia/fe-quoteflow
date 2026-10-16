
import OrderCreateContainer from './OrderCreate.container';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render OrderCreateContainer'
  }
];

test.assertSnapshots(OrderCreateContainer, configs);
