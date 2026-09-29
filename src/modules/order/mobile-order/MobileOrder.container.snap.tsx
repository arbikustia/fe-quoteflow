
import test from '../../../libs/unit-test';

import MobileOrderContainer from './MobileOrder.container';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderContainer'
  }
];

test.assertSnapshots(MobileOrderContainer, configs);
