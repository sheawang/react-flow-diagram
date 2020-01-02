// @flow

import type { EntityState } from '../../src/entity/reducer';

// TODO: I could potentially have a situation where the model for a link only
// has a `target` property and the entity reducer figures out the proper values
// of `points` when SETting the diagram. In this way I'd had a mix of
// declarative in the inital model and then switch to explicit after load.

const model: EntityState = [
  {
    id: 'user',
    name: 'user',
    fields: [
      {
        name: 'userId',
        type: 'String',
        length: '32',
        fieldTitle: '用户ID'
      },
      {
        name: 'details',
        type: 'String',
        length: '255',
        fieldTitle: '详情'
      }
    ],
    pk: [
      'userId'
    ],
    width: 150,
    height: 125,
    x: 350,
    y: 300,
    modelTitle: '用户模块',
    type: 'Task',
    linksTo: [
      {
        target: 'role',
        edited: false,
        label: '1...n',
        points: [
          {
            x: 500,
            y: 362.5
          },
          {
            x: 700,
            y: 362.5
          },
          {
            x: 700,
            y: 225
          }
        ],
        custom: {
          underLabel: 'roles'
        }
      }
    ]
  },
  {
    id: 'role',
    name: 'role',
    fields: [
      {
        name: 'roleId',
        type: 'String',
        length: '32',
        fieldTitle: '角色ID'
      },
      {
        name: 'details',
        type: 'String',
        length: '255',
        fieldTitle: '详情'
      }
    ],
    pk: [
      'roleId'
    ],
    width: 150,
    height: 125,
    x: 650,
    y: 100,
    modelTitle: '角色模块',
    type: 'Task',
    linksTo: [
      {
        target: 'userRole',
        edited: false,
        points: [
          {
            x: 775,
            y: 162.5
          },
          {
            x: 825,
            y: 162.5
          },
          {
            x: 825,
            y: 212.5
          },
          {
            x: 875,
            y: 212.5
          }
        ]
      }
    ]
  },
  {
    id: 'userRole',
    name: 'userRole',
    fields: [
      {
        name: 'relationId',
        type: 'String',
        length: '32',
        fieldTitle: '关系ID'
      },
      {
        name: 'userId',
        type: 'String',
        length: '32',
        fieldTitle: '用户ID'
      },
      {
        name: 'roleId',
        type: 'String',
        length: '32',
        fieldTitle: '角色ID'
      },
      {
        name: 'details',
        type: 'String',
        length: '255',
        fieldTitle: '详情'
      }
    ],
    pk: [
      'relationId'
    ],
    width: 150,
    height: 175,
    x: 875,
    y: 125,
    modelTitle: '用户角色关系模块',
    type: 'Task',
    linksTo: [
      {
        target: 'user',
        edited: false,
        points: [
          {
            x: 875,
            y: 212.5
          },
          {
            x: 425,
            y: 212.5
          },
          {
            x: 425,
            y: 300
          }
        ]
      }
    ]
  }
]

export default model;
