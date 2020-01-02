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
    x: 525,
    y: 75,
    modelTitle: '用户模块',
    type: 'Task',
    linksTo: [
      {
        target: 'role',
        edited: false,
        label: '1...n',
        points: [
          {
            x: 525,
            y: 137.5
          },
          {
            x: 412.5,
            y: 137.5
          },
          {
            x: 412.5,
            y: 112.5
          },
          {
            x: 300,
            y: 112.5
          }
        ],
        custom: {
          underLabel: 'roles'
        }
      },
      {
        target: 'userRole',
        edited: false,
        points: [
          {
            x: 675,
            y: 137.5
          },
          {
            x: 900,
            y: 137.5
          },
          {
            x: 900,
            y: 275
          }
        ]
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
    x: 150,
    y: 50,
    modelTitle: '角色模块',
    type: 'Task'
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
    x: 900,
    y: 275,
    modelTitle: '用户角色关系模块',
    type: 'Task'
  }
]

export default model;
