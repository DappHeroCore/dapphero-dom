// Types
import { Features } from '~/lib/types';

// Features
import { user } from '~/features/user/index';
import { network } from '~/features/network/index';

export const FEATURES: Features = {
  user,
  network,
};
