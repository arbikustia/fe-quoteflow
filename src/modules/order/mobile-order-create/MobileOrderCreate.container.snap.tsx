
import test from '../../../libs/unit-test';

import MobileOrderCreateContainer from './MobileOrderCreate.container';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderCreateContainer'
  }
];

test.assertSnapshots(MobileOrderCreateContainer, configs);
