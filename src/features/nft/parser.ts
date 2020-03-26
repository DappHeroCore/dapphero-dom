// Constants
import { TAG_TYPES } from '../../lib/constants';

// Utils
import { createAttributeSelector } from '../../lib/utils';

// Types
import { Features, Properties, NFT } from '../../lib/types';

export const nftParser = (properties: Properties, features: Features): NFT | void => {
  const nft: NFT = {
    tokens: [],
    item: { root: null, childrens: null },
    pagination: { limit: 20, offset: 0, elements: [] },
  };

  const tagIdKey = properties.find((property) => property.key === 'tagId');
  const paginationLimitKey = properties.find((property) => property.key === 'paginationLimit');
  const paginationOffsetKey = properties.find((property) => property.key === 'paginationOffset');
  const assetTokenIdKey = properties.find((property) => property.key === 'assetTokenId');
  const assetOwnerAddressKey = properties.find((property) => property.key === 'assetOwnerAddress');
  const assetContractAddressKey = properties.find((property) => property.key === 'assetContractAddress');

  const tagId = tagIdKey?.value;

  const paginationLimit = paginationLimitKey?.value;
  const paginationOffset = paginationOffsetKey?.value;

  const tokenIds = assetTokenIdKey?.value;
  const assetOwnerAddress = assetOwnerAddressKey?.value;
  const assetContractAddress = assetContractAddressKey?.value;

  // Check if tag id exists in DOM
  if (!tagId) {
    return console.error(`Tag id should be specified`);
  }

  // Check if we have asset owner address when token ids are defined
  if (tokenIds && !(assetOwnerAddress || assetContractAddress)) {
    return console.error(`Asset owner or asset contract address should be specified when a token id it's defined`);
  }

  // Parse tokenIds
  if (tokenIds) {
    nft.tokens = tokenIds.split(',');
  }

  // Check pagination values
  if (paginationLimit || paginationOffset) {
    const limit = Number(paginationLimit);
    const offset = Number(paginationOffset);

    const isPaginationLimitInteger = Number.isInteger(limit);
    const isPaginationOffsetInteger = Number.isInteger(offset);

    if (!isPaginationLimitInteger) {
      console.warn(`Pagination limit should be an integer`);
    }

    if (!isPaginationOffsetInteger) {
      console.warn(`Pagination offset should be an integer`);
    }

    Object.assign(nft.pagination, {
      limit: isPaginationLimitInteger ? limit : nft.pagination.limit,
      offset: isPaginationOffsetInteger ? offset : nft.pagination.offset,
    });
  }

  // Get NFTs children properties
  const childrenProperties = features.nft.dataProperties.filter((property) => property.type === 'children');

  // Get all elements with tag id
  const tagSelector = createAttributeSelector(`data-dh-property-tag-id`, tagId);
  const nftChildrens = Array.from(document.querySelectorAll(tagSelector)).filter(
    (element) => !element.hasAttribute(`data-dh-feature`),
  );

  const nftItemAsset = nftChildrens.find((element) => element.hasAttribute(`data-dh-property-asset-item`));
  const nftRestChildrens = nftChildrens.filter((element) => !element.hasAttribute(`data-dh-property-asset-item`));

  if (!nftItemAsset) {
    return console.error(`An NFT asset item should be defined`);
  }

  // Parse NFT item childrens to get element, type, and jsonPath
  const childrens = Array.from(nftItemAsset.children).map((childNode) => {
    if (!childNode.hasAttribute(`data-dh-property-asset-json-path`)) {
      return console.error(`An json path has to be defined in each element`);
    }

    return {
      element: childNode,
      type: TAG_TYPES[childNode.tagName] || TAG_TYPES.DEFAULT,
      jsonPath: childNode.getAttribute(`data-dh-property-asset-json-path`),
    };
  });

  // Parse NFT item to get pagination elements
  const paginationElements = nftRestChildrens.filter(
    (element) =>
      element.hasAttribute(`data-dh-property-pagination-prev`) ||
      element.hasAttribute(`data-dh-property-pagination-next`),
  );

  // Update nft object
  Object.assign(nft.item, { root: nftItemAsset, childrens });
  Object.assign(nft.pagination, { elements: paginationElements });

  return nft;
};
