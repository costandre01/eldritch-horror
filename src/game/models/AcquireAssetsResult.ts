import type { TestResult } from "./TestResult";

export interface AcquireAssetsResult {
  test: TestResult;

  availableAssetIds: string[];
}