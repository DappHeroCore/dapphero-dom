// Constants
import { DATA_FEATURE, DATA_PROPERTY } from '~/lib/constants';

export const network = {
  id: 'network',
  dataAttribute: `${DATA_FEATURE}-network`,
  dataProperties: [
    {
      id: 'id',
      attribute: `${DATA_PROPERTY}-id`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'infoType',
      attribute: `${DATA_PROPERTY}-info-type`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'name',
      attribute: `${DATA_PROPERTY}-name`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'provider',
      attribute: `${DATA_PROPERTY}-provider`,
      required: false,
      validator: null,
      position: null,
    },
  ],
  dataModifiers: [],
};
