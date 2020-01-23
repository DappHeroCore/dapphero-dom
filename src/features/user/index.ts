// Constants
import { DATA_PROPERTY, DATA_FEATURE, DATA_MODIFIER } from '~/lib/constants';

export const user = {
  id: 'user',
  dataAttribute: `${DATA_FEATURE}-user`,
  dataProperties: [
    {
      id: 'address',
      attribute: `${DATA_PROPERTY}-address`,
      required: false,
      validator: null,
      position: null,
      modifiers: [],
    },
    {
      id: 'balance',
      attribute: `${DATA_PROPERTY}-balance`,
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
      id: 'decimals',
      defaultValue: '10',
      attribute: `${DATA_MODIFIER}-units`,
      validator: (value) => !isNaN(value) && Number.isInteger(Number(value)),
    },
    {
      id: 'display',
      defaultValue: 'full',
      attribute: `${DATA_MODIFIER}-display`,
      validator: (value) => ['full', 'short'].includes(value),
    },
  ],
};
