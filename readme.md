# DappHero - DOM

### Commands

| Action     | Command        |
| ---------- | -------------- |
| Developing | `yarn dev`     |
| Testing    | `yarn test`    |
| Building   | `yarn build`   |
| Publishing | `yarn publish` |

### Installing

To install simple run:

```bash
> yarn add @xivis/dapphero-dom
```

Then import your dependencies:

```javascript
import { parseActiveElements, checkRequiredProperties } from '@xivis/dapphero-dom';
```

### API

| Method                  | Params         | Returns        | Description                                          |
| ----------------------- | -------------- | -------------- | ---------------------------------------------------- |
| parseActiveElements     | empty          | activeElements | Get all DappHero active elements on the DOM          |
| checkRequiredProperties | activeElements | void           | Check if all required properties has values assigned |

### How to Use for UI/NoCode Tools (WIP)

### How to Use for Developers

1. Add the attribute `data-dh-enabled` with value `true` in order to activate DappHero on that particular element.

```html
<div data-dh-enabled="true">...</div>
```

2. Add the attribute `data-dh-attribute-mode` with value `data` in order to use data-attributes instead of `id` since the syntax it's cleaner.

```html
<div data-dh-enabled="true" data-dh-tag-mode="data">...</div>
```

3. Add the tag `data-dh-feature` and the feature you want on the same element.
   The possible feature values are: `network`, `user`, `3box`, `customContract`, `nft`

```html
<div data-dh-enabled="true" data-dh-tag-mode="data" data-dh-feature="network">...</div>
```

4. Add the properties you want to set or get in the chosen feature
   To follow this step please refer to the feature particular documentation: [Network](##Network)

## Network

- Get ID:

```html
<div data-dh-enabled="true" data-dh-feature="network" data-dh-id>
  ...
</div>
```

- Get Info Type:

```html
<div data-dh-enabled="true" data-dh-feature="network" data-dh-info-type>
  ...
</div>
```

- Get Name:

```html
<div data-dh-enabled="true" data-dh-feature="network" data-dh-name>
  ...
</div>
```

- Get Provider:

```html
<div data-dh-enabled="true" data-dh-feature="network" data-dh-provider>
  ...
</div>
```

### Attributes

We need to find a way that's easy to use for the designer/developer and at the same time faster and maintanable to parse through the DOM:

#### ❌ What we can't do:

- Using [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) or [class](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attributes since accidentally we can remove or modify an existing value and therefore break CSS styling or a JavaScript interaction.

* Using custom attributes like `dh-feature` or `dh-contract-name` since they don't have a formal API to query them easily. Even though they work but the browser doesn't have any default way to handle them.

- Using [split](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split), [match](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match), or any other method that uses Strings or RegExp to parse an string into an array. Those are great but are prone to errors due to a bad defined RegExp or accessing an unexisting element in an array and then doing some parsing to it.

#### ✅ What we can do:

- Use [data](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) attributes to handle DappHero features (i.e Network, User Info, Contracts, ThreeBox, etc) and properties to handle special values (i.e units, contractName, methodName, etc).

* Use `dh-[property]` prefix to accidentally avoid writing some `data` attribute on the DOM and break CSS / JavaScript functionality.

- Get data attributes using [dataset](https://caniuse.com/#feat=dataset) and parse through a **custom configuration object** to do some custom actions like: parsing, requiring, validiting, sanitizing and sorting.

### Active Elements

The active elements are those DOM elements that has the `data-dh-enabled="true"` attribute assigned.
So the designer or developer using the NoCode tool can easily disable or enable the DappHero engine.

### Features Configuration

This object will serve to run all validations needed against active elements.

Example with only one feature "network" and only one property "id":

```typescript
export const features = {
  network: {
    dataAttribute: `${FEATURE}-network`,
    dataProperties: [
      {
        key: 'id',
        attribute: `${PREFIX}-network-id`,
        required: false,
        validator: null,
        position: null,
      },
    ],
  },
};
```

## Features Support

- [x] Network
- [ ] User
- [ ] 3Box
- [ ] Custom Contract
- [ ] NFT

## Roadmap

- [ ] Analytics for data-attributes use
- [ ] Get configuration object from API
- [ ] Webflow tests with Cypress
- [ ] Think on how to handle Placeholders and Loaders
- [ ] Investigate bundler to use to generate the final bundle
- [ ] Add deploy script for NPM, and add badges
- [ ] Add link and badge for UNPKG, NPM CDN
- [ ] Add Husky, to run Prettier and Jest on pre-commit
- [ ] Check for repeated data-attributes
- [ ] Add error logging using Sentry
- [ ] Add in documnetation support table for different UI/NoCode tools like WebFlow and Bubble

## Separation of Concerns

A improve over DappHero functionality will be to separate the Core into DOM and Core, since we will be able to handle al DOM related stuff in a more maintanable and cleaner way, and the Core will use those helpers and only handle the React and the features logic itself.

![Separation](/docs/Separation.png)

## Scaffolding

![Scaffolding](/docs/Scaffolding.png)
