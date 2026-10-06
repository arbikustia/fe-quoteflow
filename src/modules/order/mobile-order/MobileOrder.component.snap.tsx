import { MobileOrderComponent } from './MobileOrder.component';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderComponent'
  }
];

test.assertSnapshots(MobileOrderComponent, configs);
