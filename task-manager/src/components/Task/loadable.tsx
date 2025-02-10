/**
 *
 * Asynchronously loads the component for Tasks
 *
 */

import { lazyLoad } from '../../utils/loadable';

export const TaskComponent = lazyLoad(
  () => import('./index'),
  module => module.default,
);
