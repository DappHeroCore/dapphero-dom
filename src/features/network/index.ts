// Constants
import { PREFIX, FEATURE } from '~/lib/constants';

export const network = {
  dataAttribute: `${FEATURE}-network`,
  dataProperties: [
    {
      key: 'id',
      attribute: `${PREFIX}-network-id`,
      required: false,
      validation: {
        enabled: false,
        validator: null,
      },
      position: {
        enabled: false,
        index: null,
      },
    },
    {
      key: 'name',
      attribute: `${PREFIX}-network-name`,
      required: false,
      validation: {
        enabled: false,
        validator: null,
      },
      position: {
        enabled: false,
        index: null,
      },
    },
    {
      key: 'provider',
      attribute: `${PREFIX}-network-provider`,
      required: false,
      validation: {
        enabled: false,
        validator: null,
      },
      position: {
        enabled: false,
        index: null,
      },
    },
  ],
};
