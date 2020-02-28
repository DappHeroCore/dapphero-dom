// Types
import { Features } from '../lib/types';

// Features
import { user } from './user/index';
import { threebox } from './3box/index';
import { network } from './network/index';
import { customContract } from './customContract/index';

export const FEATURES: Features = {
  user,
  network,
  threebox,
  customContract,
};
