import { Caipps /* , Module */ } from './util/types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __caipps__: Caipps;
    Draw: typeof Draw;
  }
}

window.__caipps__.init = (canvas): Promise<void> => {
  // window.__caipps__.module = Module;

  return import(/* webpackPreload: true */ './main-activity').then(module => {
    const activity = new module.MainActivity(canvas);
    activity.onCreate();
  });
};

// console.log('Before importing...');
// import(/* webpackPreload: true */ './main-activity').then(module => {
//   console.log('MainActivity imported');
//   window.__caipps__.activity = new module.MainActivity();
//   if (window.__caipps__.runtimeInitialized) {
//     window.__caipps__.activity.OnCreate(window.Module);
//   } else {
//     throw new Error('Module not available');
//   }
// });
