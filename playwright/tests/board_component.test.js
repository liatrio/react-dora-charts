import { test, expect } from '@playwright/test';
import * as utils from '../helpers/utils';
import * as constants from '../helpers/constants';

const PAGE_URL = '/?path=/story/board--example';
const CHECKBOX_LABELS = [
  'NO_CHECKBOX',
  'Always Show Details',
  'Hide Colors',
  'Include Weekends',
  'Loading',
  'Show Trends',
];

test.describe.configure({ mode: 'parallel' });

test.describe('Board Component: ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    page.context.storyBookRoot = await utils.waitForStorybookRootToLoad(page);
  });

  // Test all data sets
  constants.DATA_SET_VALUES.forEach(dataset => {
    CHECKBOX_LABELS.forEach(checkboxLabel => {
      test(`Data Set: ${dataset} | Checkbox: ${checkboxLabel}`, async ({
        page,
      }) => {
        await utils.selectDataSet(page.context.storyBookRoot, dataset);

        if (checkboxLabel === 'NO_CHECKBOX') {
          await expect(page).toHaveScreenshot();
          return;
        }

        await utils.setCheckBox(
          page.context.storyBookRoot,
          checkboxLabel,
          true,
        );
        await expect(page).toHaveScreenshot();
        await utils.setCheckBox(
          page.context.storyBookRoot,
          checkboxLabel,
          false,
        );
      });
    });
  });
});
