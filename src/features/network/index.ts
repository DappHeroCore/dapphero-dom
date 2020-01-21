// Constants
import { PREFIX, FEATURE } from '~/lib/constants';

export const network = {
  dataAttribute: `${FEATURE}-network`,
  dataProperties: [
    {
      key: 'id',
      attribute: `${PREFIX}-network-id`,
      required: false,
      validator: null,
      position: null,
    },
    {
      key: 'infoType',
      attribute: `${PREFIX}-network-infoType`,
      required: false,
      validator: null,
      position: null,
    },
    {
      key: 'name',
      attribute: `${PREFIX}-network-name`,
      required: false,
      validator: null,
      position: null,
    },
    {
      key: 'provider',
      attribute: `${PREFIX}-network-provider`,
      required: false,
      validator: null,
      position: null,
    },
  ],
};
