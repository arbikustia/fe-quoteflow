
import test from '../../../libs/unit-test';

import MobileOrderDetailContainer from './MobileOrderDetail.container';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderDetailContainer'
  }
];

test.assertSnapshots(MobileOrderDetailContainer, configs);
