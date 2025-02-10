/**
 *
 * Asynchronously loads the component for Actions
 *
 */

import { lazyLoad } from "../../utils/loadable";

export const Action = lazyLoad(
  () => import("./index"),
  (module) => module.default
);
