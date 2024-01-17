/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as fs from 'fs';
import { globSync } from 'glob';
import * as path from 'path';

const snapshotsRootPath = './tests/snapshots';
const usedScreenshotPaths = getUsedScreenshotPaths();

const unusedScreenshotPaths = globSync(`${snapshotsRootPath}/**/*.png`)
  .map(screenshotPath => path.relative(snapshotsRootPath, screenshotPath))
  .filter(screenshotPath => !usedScreenshotPaths.includes(screenshotPath));

for (const screenshotPath of unusedScreenshotPaths) {
  fs.unlinkSync(path.resolve(snapshotsRootPath, screenshotPath));
}

function getUsedScreenshotPaths() {
  const usedScreenshotPathsFilePath = './tests/snapshots/used-screenshot-paths.txt';
  const usedScreenshotPaths = fs.readFileSync(usedScreenshotPathsFilePath).toString().split('\n');

  fs.unlinkSync(usedScreenshotPathsFilePath);

  return usedScreenshotPaths;
}
