export const DH = `dh`;

export const DATA_PREFIX = `data-${DH}`;

export const DATA_FEATURE = `${DATA_PREFIX}-feature`;

export const DATA_PROPERTY = `${DATA_PREFIX}-property`;

export const DATA_MODIFIER = `${DATA_PREFIX}-modifier`;

export const ELEMENT_TYPES = {
  text: 'text',
  image: 'image',
  audio: 'audio',
  video: 'video',
};

export const TAG_TYPES = {
  H1: ELEMENT_TYPES.text,
  H2: ELEMENT_TYPES.text,
  H3: ELEMENT_TYPES.text,
  H4: ELEMENT_TYPES.text,
  H5: ELEMENT_TYPES.text,
  H6: ELEMENT_TYPES.text,
  P: ELEMENT_TYPES.text,
  DIV: ELEMENT_TYPES.text,
  SPAN: ELEMENT_TYPES.text,
  IMG: ELEMENT_TYPES.image,
  AUDIO: ELEMENT_TYPES.audio,
  VIDEO: ELEMENT_TYPES.video,
  DEFAULT: ELEMENT_TYPES.text,
};
