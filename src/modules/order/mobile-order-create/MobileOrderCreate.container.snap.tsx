
import MobileOrderCreateContainer from './MobileOrderCreate.container';
import test from '../../../libs/unit-test';

const configs = [
  {
    props: {},
    desc: 'Should Render MobileOrderCreateContainer'
  }
];

test.assertSnapshots(MobileOrderCreateContainer, configs);
