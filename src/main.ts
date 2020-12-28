import '@lfpjs/web';
// import onReady, { registerListeners } from '@lfpjs/web';
// import MyWorker from 'worker-loader!@lfpjs/worker/lib/index.js';

// onReady.then(
//   ([Module, offscreenCanvas]: [EmscriptenModule, OffscreenCanvas]): void => {
//     const worker = new MyWorker();

//     worker.onmessage = function (e: MessageEvent) {
//       const messageType = e.data.msg || e.data.type;
//       switch (messageType) {
//         case 'ready': {
//           worker.postMessage(
//             {
//               msg: 'start',
//               canvas: offscreenCanvas,
//               width: Module.canvas.width,
//               height: Module.canvas.height,
//               boundingClientRect: Module.canvas.getBoundingClientRect(),
//               devicePixelRatio: window.devicePixelRatio,
//             },
//             [offscreenCanvas],
//           );
//           registerListeners(worker);
//           break;
//         }
//         // case 'log': {
//         //   if (log) {
//         //     log.textContent = e.data.value;
//         //   }
//         // }
//       }
//     };
//   },
// );
