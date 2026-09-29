import test from '../../../libs/unit-test';

import { MobileOrderDetailComponent } from './MobileOrderDetail.component';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderDetailComponent'
  }
];

test.assertSnapshots(MobileOrderDetailComponent, configs);
