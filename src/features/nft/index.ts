// Constants
import { DATA_FEATURE, DATA_PROPERTY } from '../../lib/constants';

export const nft = {
  id: 'nft',
  dataAttribute: `${DATA_FEATURE}-nft`,
  dataProperties: [
    {
      id: 'tagId',
      attribute: `${DATA_PROPERTY}-tag-id`,
      required: true,
      validator: null,
      position: null,
    },
    {
      id: 'paginationLimit',
      attribute: `${DATA_PROPERTY}-pagination-limit`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'paginationOffset',
      attribute: `${DATA_PROPERTY}-pagination-offset`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'assetTokenId',
      attribute: `${DATA_PROPERTY}-asset-token-id`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'assetOwnerAddress',
      attribute: `${DATA_PROPERTY}-asset-owner-address`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'assetContractAddress',
      attribute: `${DATA_PROPERTY}-asset-contract-address`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'assetItem',
      attribute: `${DATA_PROPERTY}-asset-item`,
      required: true,
      validator: null,
      position: null,
      type: 'children',
    },
    {
      id: 'assetJsonPath',
      attribute: `${DATA_PROPERTY}-asset-json-path`,
      required: true,
      validator: null,
      position: null,
      type: 'children',
    },
    {
      id: 'prevPage',
      attribute: `${DATA_PROPERTY}-pagination-prev`,
      required: false,
      validator: null,
      position: null,
      type: 'children',
    },
    {
      id: 'nextPage',
      attribute: `${DATA_PROPERTY}-pagination-next`,
      required: false,
      validator: null,
      position: null,
      type: 'children',
    },
  ],
  dataModifiers: [],
};
