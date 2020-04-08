FROM  node:12.16.1-alpine3.11

# TODO: REMOVE IF NOT NEEDED
RUN apk add bash bash-completion

RUN apk update

RUN apk add --no-cache --virtual build-dependencies build-base gcc g++ binutils make cmake extra-cmake-modules git python3 binaryen

# RUN apk search llvm

# RUN apk search clang

# RUN apk update && apk upgrade

# clang lld llvm

# Build LLVM
RUN git clone --depth=1 https://github.com/llvm/llvm-project.git && \
  cd llvm-project/llvm && \
  mkdir build && \
  cd build && \
  cmake ../ -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_PROJECTS='lld;clang' -DLLVM_TARGETS_TO_BUILD="host;WebAssembly" -DLLVM_INCLUDE_EXAMPLES=OFF -DLLVM_INCLUDE_TESTS=OFF && \
  cmake --build .
 # cmake --build . --target install

# Build binaryen
# RUN git clone --depth=1 https://github.com/WebAssembly/binaryen.git && \
#   cd binaryen && \
#   cmake . && \
#   make

# Get emscripten

RUN git clone https://github.com/vonBrax/emscripten.git && \
  git clone https://github.com/vonBrax/liquidfun.git && \
  cd liquidfun && \
  git checkout feature/embind && \
  git pull && \
  cd .. && \
  mkdir common

ENV BINARYEN=/usr/share/binaryen

RUN cd liquidfun/liquidfun/Box2D/lfjs && \
  /emscripten/emcc \
    -I ../ \
    -o /common/liquidfun.js \
    --bind ./jsBindings/bindings.cpp \
    -Oz \
    --proxy-to-worker \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue']" \
    -s "ENVIRONMENT=web,worker"

RUN cd liquidfun/liquidfun/Box2D/lfjs && \
  /emscripten/emcc \
    -I ../ \
    # -o ../../../../liquidfunpaint/static/liquidfun/liquidfun.js \
    -o /common/liquidfun.js \
    --bind ./jsBindings/bindings.cpp \
    -Oz \
    --proxy-to-worker \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue']" \
    -s "ENVIRONMENT=web,worker"

CMD [ "sh" ]
