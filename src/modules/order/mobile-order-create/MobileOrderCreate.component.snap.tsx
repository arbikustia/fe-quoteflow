import { MobileOrderCreateComponent } from './MobileOrderCreate.component';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderCreateComponent'
  }
];

test.assertSnapshots(MobileOrderCreateComponent, configs);
