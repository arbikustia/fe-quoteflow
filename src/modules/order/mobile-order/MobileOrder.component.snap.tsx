import test from '../../../libs/unit-test';

import { MobileOrderComponent } from './MobileOrder.component';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderComponent'
  }
];

test.assertSnapshots(MobileOrderComponent, configs);
