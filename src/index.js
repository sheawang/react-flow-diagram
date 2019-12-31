// @flow

import Diagram, { store } from './diagram/component';
import { setEntities, setCustom, setModel , getEntity } from './entity/reducer';
import { setConfig } from './config/reducer';
import diagramOn from './diagramOn/';
import 'antd/dist/antd.css';

export { Diagram, diagramOn, store, setEntities, setConfig, setCustom, getEntity ,setModel };
