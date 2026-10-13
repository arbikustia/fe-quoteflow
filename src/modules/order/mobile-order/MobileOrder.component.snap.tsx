import { MobileOrderComponent } from './MobileOrder.component';
import type { MobileOrderProps } from './MobileOrder.type';
import test from '../../../libs/unit-test';

const props: MobileOrderProps = {
  quotes: [],
  onNavigate: jest.fn(),
};

const configs = [{ props, desc: 'Should Render MobileOrderComponent' }];

test.assertSnapshots(MobileOrderComponent, configs);
