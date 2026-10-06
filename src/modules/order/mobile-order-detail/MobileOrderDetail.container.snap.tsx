
import MobileOrderDetailContainer from './MobileOrderDetail.container';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderDetailContainer'
  }
];

test.assertSnapshots(MobileOrderDetailContainer, configs);
