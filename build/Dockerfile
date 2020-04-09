FROM  ubuntu:18.04

RUN apt-get update && apt-get install -y \
  software-properties-common \
  build-essential \
  wget \
  gnupg1\
  make \
  cmake \
  git \
  python3 \
  python3-distutils && \
  wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add - && \
  apt-add-repository "deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic main"

RUN apt-get update && \
  apt-get install -y \
  clang-11 \
  lldb-11 \
  lld-11
  # build-essential \
  # gcc \
  # g++ \
  # binutils \
  # make \
  # cmake \
  # extra-cmake-modules \
  # git \
  # python3 \
  # python3-distutils \
  # binaryen \
  # llvm-11 \
  # clangd-11 \
  # nodejs \
  # bash \
  # bash-completion

# Build LLVM
# RUN git clone --depth=1 https://github.com/llvm/llvm-project.git && \
#   cd llvm-project/llvm && \
#   mkdir build && \
#   cd build && \
#   cmake ../ -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_PROJECTS='lld;clang' -DLLVM_TARGETS_TO_BUILD="host;WebAssembly" -DLLVM_INCLUDE_EXAMPLES=OFF -DLLVM_INCLUDE_TESTS=OFF && \
#   cmake --build .
#  # cmake --build . --target install

# Build binaryen
RUN git clone --depth=1 https://github.com/WebAssembly/binaryen.git && \
  cd binaryen && \
  cmake . && \
  make

# Get emscripten && liquidfun
RUN git clone https://github.com/vonBrax/emscripten.git && \
  git clone https://github.com/vonBrax/liquidfun.git && \
  cd liquidfun && \
  git checkout feature/embind && \
  git pull && \
  cd .. && \
  mkdir common

ENV EMSCRIPTEN=/emscripten
ENV LLVM=/usr/lib/llvm-11/bin
ENV BINARYEN=/binaryen

RUN /emscripten/emcc --version

COPY entry.sh /

# RUN cat /root/.emscripten

# RUN cd liquidfun/liquidfun/Box2D/lfjs && \
#   /emscripten/emcc \
#     -I ../ \
#     -o /common/liquidfun.js \
#     --bind ./jsBindings/bindings.cpp \
#     -Oz \
#     --proxy-to-worker \
#     -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue']" \
#     -s "ENVIRONMENT=web,worker"

ENTRYPOINT [ "/entry.sh" ]
# CMD [ "sh" ]
