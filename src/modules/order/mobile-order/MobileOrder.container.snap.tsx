
import MobileOrderContainer from './MobileOrder.container';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderContainer'
  }
];

test.assertSnapshots(MobileOrderContainer, configs);
