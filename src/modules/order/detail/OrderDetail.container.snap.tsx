
import OrderDetailContainer from './OrderDetail.container';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render OrderDetailContainer'
  }
];

test.assertSnapshots(OrderDetailContainer, configs);
