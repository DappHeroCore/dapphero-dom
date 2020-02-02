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
      id: 'inputName',
      attribute: `${DATA_PROPERTY}-input-name`,
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
      id: 'inputUnits',
      defaultValue: 'wei',
      attribute: `${DATA_MODIFIER}-input-units`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'displayUnits',
      defaultValue: 'ether',
      attribute: `${DATA_MODIFIER}-display-units`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'displayDecimals',
      defaultValue: 3,
      attribute: `${DATA_MODIFIER}-display-decimals`,
      validator: (value) => !Number.isNaN(value) && Number.isInteger(Number(value)),
    },
  ],
};
