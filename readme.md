# DappHero - Proposal by Xivis

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

### Features Configuration Map

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

## Further Ideas

- Generate one single JavaScript bundle with React, ReactDOM and DappHero core using Webpack, Parcel or Rollup

* Generate an script to deploy to [NPM](https://www.npmjs.com) and use [UNPKG](https://unpkg.com) as a CDN for NPM

- Improve error logging [Sentry](https://sentry.io)

* Support table for different UI/NoCode tools like WebFlow and Bubble

## Separation of Concerns

![Separation](/docs/Separation.png)

## Scaffolding

![Scaffolding](/docs/Scaffolding.png)
