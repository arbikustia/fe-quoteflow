import test from '@/libs/unit-test';
import MasterItemContainer from './MasterItem.container';

const configs = [
  {
    props: {},
    desc: 'Should Render MasterItemContainer with default props',
    useHook: true,
  },
];

it('MasterItemContainer matches snapshot', () => {
  test.assertSnapshots(MasterItemContainer, configs);
});
