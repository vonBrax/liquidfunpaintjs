import ModuleFactory from './liquidfun';

interface EmscriptenModuleBase {
  customMessageQueue: EmscriptenModule['customMessageQueue'];
  onCustomMessage: EmscriptenModule['onCustomMessage'];
  printErr: EmscriptenModule['printErr'];
  print: EmscriptenModule['print'];
  locateFile: EmscriptenModule['locateFile'];
}

const Module: EmscriptenModuleBase = {
  customMessageQueue: [],
  onCustomMessage: function (event) {
    console.error('Receving custom message: ', event);
    Module.customMessageQueue.push(event);
  },
  printErr: console.error,
  print: console.info,
  locateFile(url: string, scriptDirectory: string): string {
    if (url.endsWith('.wasm')) {
      return '/liquidfun/' + url;
    }

    return scriptDirectory + url;
  },
};

const ModulePromise = ModuleFactory(Module);
export { ModulePromise };
