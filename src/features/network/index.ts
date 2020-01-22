// Constants
import { DATA_PREFIX, DATA_FEATURE } from '~/lib/constants';

export const network = {
  id: 'network',
  dataAttribute: `${DATA_FEATURE}-network`,
  dataProperties: [
    {
      id: 'id',
      attribute: `${DATA_PREFIX}-network-id`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'infotype',
      attribute: `${DATA_PREFIX}-network-info-type`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'name',
      attribute: `${DATA_PREFIX}-network-name`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'provider',
      attribute: `${DATA_PREFIX}-network-provider`,
      required: false,
      validator: null,
      position: null,
    },
  ],
};
