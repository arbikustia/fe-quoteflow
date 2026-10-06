import { MobileOrderDetailComponent } from './MobileOrderDetail.component';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderDetailComponent'
  }
];

test.assertSnapshots(MobileOrderDetailComponent, configs);
