import { test, expect } from '@playwright/test';
import * as utils from '../helpers/utils';
import * as constants from '../helpers/constants';

test.describe.configure({ mode: 'parallel' });

constants.DATA_SET_VALUES.forEach(dataSetValue => {
  test.describe('Board Component: ', () => {
    test(`Data Set: ${dataSetValue}`, async ({ page }, testInfo) => {
      await page.goto('/?path=/story/board--example');
      const storyBookRoot = await utils.waitForStorybookRootToLoad(page);

      // set the Data set
      await storyBookRoot
        .locator(
          '//label[contains(text(), "Data Set")]/following-sibling::select',
        )
        .selectOption({ label: dataSetValue });

      // Set Always Show Details to true
      await storyBookRoot
        .locator(
          '//label[contains(text(), "Always Show Details")]/following-sibling::input',
        )
        .check();

      await expect(page).toHaveScreenshot();
    });
  });
});
