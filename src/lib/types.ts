export type AvailableFeatures = 'network' | 'user' | 'customContract' | 'threebox' | 'nft';

export type DataProperty = {
  key: string;
  attribute: string;
  required: boolean;
  validator?: RegExp;
  position?: number;
};

export type Feature = {
  dataAttribute: String;
  dataProperties: DataProperty[];
};

// FIXME: Keys are optional since all Features are not supported yet
export type Features = {
  [key in AvailableFeatures]?: Feature;
};

export type FeaturesEntries = [AvailableFeatures, Feature];

export type PropertyPosition = {
  [key in string]: number;
};

export type PropertiesPositions = {
  [key in AvailableFeatures]?: PropertyPosition;
};

export type Property = {
  key: string;
  value: string;
};

export type ActiveElement = {
  element: HTMLElement;
  properties: Property[];
  feature: AvailableFeatures;
};
