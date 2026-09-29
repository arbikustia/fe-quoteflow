import test from '../../../libs/unit-test';

import { MobileOrderCreateComponent } from './MobileOrderCreate.component';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderCreateComponent'
  }
];

test.assertSnapshots(MobileOrderCreateComponent, configs);
