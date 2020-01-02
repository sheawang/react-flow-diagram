// @flow

import Task from './task/component';
import taskIcon from './task/icon';
import Event from './event/component';
import eventIcon from './event/icon';

import type { ConfigState, CustomEntities } from 'react-flow-diagram';

const config: ConfigState = {
  entityTypes: {
    Task: {
      width: 70,
      height: 40,
    }
  },
  gridSize: 25,
};

const customEntities: CustomEntities = {
  Task: {
    component: Task,
    icon: taskIcon,
  }
};

export { config, customEntities };
