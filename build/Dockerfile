FROM  ubuntu:18.04

ENV EMSCRIPTEN=/emscripten
ENV LLVM=/usr/lib/llvm-11/bin
ENV BINARYEN=/binaryen

VOLUME /common

COPY entry.sh /

RUN chmod +x ./entry.sh && \
  apt-get update && \
  # Install wget
  # apt-get install --no-install-recommends --yes \
  #   software-properties-common \
  #   wget \
  #   gnupg1 \
  #   gpg-agent && \
  # wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add - && \
  # apt-add-repository "deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic main" && \
  # apt-get update && \
  apt-get install --no-install-recommends --yes \
    # Emscripten dependencies
    # clang-11 \
    # lldb-11 \
    # lld-11 \
    # Other dependencies
    ca-certificates \
    build-essential \
    make \
    cmake \
    git \
    python3 \
    python3-distutils \
    nodejs && \
  # Build binaryen
  git clone --depth 1 https://github.com/WebAssembly/binaryen.git && \
  cd binaryen && \
  cmake . && \
  make && \
  cd .. && \
  # Get emscripten && liquidfun
  git clone --depth 1 https://github.com/vonBrax/emscripten.git && \
  git clone -b feature/embind --depth 1 https://github.com/vonBrax/liquidfun.git && \
  # Clean up
  apt-get autoremove -y && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  # Create .emscripten file on the first run
  /emscripten/emcc --version

# Build LLVM
RUN git clone --depth=1 https://github.com/llvm/llvm-project.git && \
  cd llvm-project/llvm && \
  mkdir build && \
  cd build && \
  cmake ../ -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_PROJECTS='lld;clang' -DLLVM_TARGETS_TO_BUILD="host;WebAssembly" -DLLVM_INCLUDE_EXAMPLES=OFF -DLLVM_INCLUDE_TESTS=OFF && \
  cmake --build .
#  # cmake --build . --target install 
  
ENTRYPOINT [ "/entry.sh" ]
