import test from '@/libs/unit-test';
import MasterCategoryContainer from './MasterCategory.container';

const configs = [
  {
    props: {},
    desc: 'Should Render MasterCategoryContainer with default props',
    useHook: true,
  },
];

it('MasterCategoryContainer matches snapshot', () => {
  test.assertSnapshots(MasterCategoryContainer, configs);
});
