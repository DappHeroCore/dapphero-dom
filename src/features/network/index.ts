// Constants
import { DATA_FEATURE, DATA_PROPERTY, DATA_MODIFIER } from '~/lib/constants';

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
      id: 'transfer',
      attribute: `${DATA_PROPERTY}-transfer`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'enable',
      attribute: `${DATA_PROPERTY}-enable`,
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
    {
      id: 'input_name',
      attribute: `${DATA_PROPERTY}-input_name`,
      required: false,
      validator: null,
      position: null,
    },
  ],
  dataModifiers: [
    {
      id: 'units',
      defaultValue: 'wei',
      attribute: `${DATA_MODIFIER}-units`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'input_units',
      defaultValue: 'wei',
      attribute: `${DATA_MODIFIER}-input_units`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'display_units',
      defaultValue: 'ether',
      attribute: `${DATA_MODIFIER}-display_units`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'display_decimals',
      defaultValue: 3,
      attribute: `${DATA_MODIFIER}-display_decimals`,
      validator: (value) => !Number.isNaN(value) && Number.isInteger(Number(value)),
    },
  ],
};
