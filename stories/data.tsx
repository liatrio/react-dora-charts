import { default as edata } from './data_elite';
import { default as mdata } from './data_medium';
import { default as hdata } from './data_high';
import { default as ldata } from './data_low';
import { default as tdata } from './data_team';
import { processData } from '../src/functions/fetchFunctions';

const props = {};

const dataSet = [
  processData(ldata, props),
  processData(mdata, props),
  processData(hdata, props),
  processData(edata, props),
  processData(tdata, props),
];

export default dataSet;
