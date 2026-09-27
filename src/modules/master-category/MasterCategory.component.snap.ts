import test from '@/libs/unit-test';
import { MasterCategoryComponent } from './MasterCategory.component';

const configs = [
  {
    props: {},
    desc: 'Should Render MasterCategoryComponent with default props',
    useHook: true,
  },
];

it('MasterCategoryComponent matches snapshot', () => {
  test.assertSnapshots(MasterCategoryComponent, configs);
});
