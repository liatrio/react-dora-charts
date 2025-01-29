import * as path from 'path';
import yaml from 'js-yaml';

// Constants
export const BASE_URL = 'http://localhost:6006';
export const TEMP_DIR = path.resolve(__dirname, '..', 'temp');
export const DATA_SET_VALUES = ['Low', 'Medium', 'High', 'Elite', 'Team'];

// Test Parameters
const yamlFile = path.resolve(__dirname, '..', 'test_parameters.yaml');
const yamlContent = require('fs').readFileSync(yamlFile, 'utf8');
const testParams = yaml.load(yamlContent).testParams;
export const TEST_PARAMS = testParams;
