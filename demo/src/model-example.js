// @flow

import type { EntityState } from '../../src/entity/reducer';

// TODO: I could potentially have a situation where the model for a link only
// has a `target` property and the entity reducer figures out the proper values
// of `points` when SETting the diagram. In this way I'd had a mix of
// declarative in the inital model and then switch to explicit after load.

const model: EntityState = [
  {
    id: 'Gorilla',
    type: 'Task',
    width: 125,
    height: 75,
    x: 50,
    y: 75,
    name: 'Gorilla',
    linksTo: [
      {
        target: 'Toucan',
        edited: false,
        label: 'Is friends with',
        points: [
          {
            x: 112.5,
            y: 112.5,
          },
          {
            x: 475,
            y: 112.5,
          },
          {
            x: 475,
            y: 150,
          },
        ],
      },
      {
        target: 'Zebra',
        edited: false,
        label: 'Eats',
        points: [
          {
            x: 112.5,
            y: 150,
          },
          {
            x: 112.5,
            y: 234.5,
          },
          {
            x: 212.5,
            y: 234.5,
          },
          {
            x: 212.5,
            y: 325,
          },
        ],
      },
    ],
  },
  {
    id: 'Toucan',
    type: 'Event',
    width: 50,
    height: 50,
    x: 450,
    y: 150,
    name: 'Toucan',
    linksTo: [
      {
        target: 'Jiraffe',
        edited: false,
        points: [
          {
            x: 475,
            y: 175,
          },
          {
            x: 393.75,
            y: 175,
          },
          {
            x: 393.75,
            y: 212.5,
          },
          {
            x: 375,
            y: 212.5,
          },
        ],
      },
    ],
  },
  {
    id: 'Zebra',
    type: 'Task',
    width: 125,
    height: 75,
    x: 150,
    y: 325,
    name: 'Zebra',
  },
  {
    id: 'Jiraffe',
    type: 'Task',
    width: 125,
    height: 75,
    x: 250,
    y: 175,
    name: 'Jiraffe',
  },
];

export default model;
