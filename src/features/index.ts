// Types
import { Features } from '../lib/types';

// Features
import { nft } from './nft';
import { user } from './user';
import { threebox } from './3box';
import { network } from './network';
import { customContract } from './customContract';

export const FEATURES: Features = {
  nft,
  user,
  network,
  threebox,
  customContract,
};
