import { test, expect } from '@playwright/test';
import * as utils from '../helpers/utils';
import * as constants from '../helpers/constants';

test.describe.configure({ mode: 'parallel' });

constants.TEST_PARAMS.forEach(testParams => {
  const COMPONENT_NAME = testParams.component_name;
  const PAGE_URL = testParams.page_url;
  const CHECKBOX_LABELS = testParams.checkbox_labels;
  const HAS_MESSAGE_FIELD = testParams.has_message_field;
  test.describe(`${COMPONENT_NAME}: `, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGE_URL);
      page.context.storyBookRoot = await utils.waitForStorybookRootToLoad(page);
      await page.waitForTimeout(1000);
    });

    // Test the page with no options selected
    test('No Options', async ({ page }) => {
      await expect(page).toHaveScreenshot();
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

    // Test the message functionality
    if (HAS_MESSAGE_FIELD) {
      test('Message', async ({ page }) => {
        await utils.setMessageBox(page.context.storyBookRoot, 'Test Message');
        await expect(page).toHaveScreenshot();
      });
    }
  });
});
