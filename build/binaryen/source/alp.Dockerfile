FROM alpine:latest AS build-base

ARG VERSION=version_98

RUN echo "\n## Update and install dependencies" \
&& apk update \
&& apk add \
  build-base \
  cmake \
  git \
  python3 \
  clang \
  ninja \
&& echo "\n## Download binaryen source code" \
&& wget -q https://github.com/WebAssembly/binaryen/archive/${VERSION}.tar.gz \
&& tar zxf ${VERSION}.tar.gz \
&& mv binaryen-${VERSION} binaryen \
&& echo "\n## Build binaryen" \
&& cd binaryen \
&& mkdir -p out \
# && /cmake-3.16.8-Linux-x86_64/bin/cmake -S . -B out -G Ninja -DCMAKE_BUILD_TYPE=Release \
# && /cmake-3.16.8-Linux-x86_64/bin/cmake --build out --config Release \
&& cmake . -B out -G Ninja -DCMAKE_CXX_FLAGS="-static" -DCMAKE_C_FLAGS="-static" -DCMAKE_BUILD_TYPE=Release -DBUILD_STATIC_LIB=ON -DCMAKE_INSTALL_PREFIX=install \
# && ninja \
# && ls -la ./out \
&& cd out \
&& ninja install \
&& cd /binaryen \
&& find install/bin/ -type f -perm -u=x -exec strip {} + \
&& echo "\n## Clean up" \
&& cd .. \
&& rm ${VERSION}.tar.gz \
# && rm cmake-3.16.8-Linux-x86_64.tar.gz \
# && rm -rf cmake-3.16.8-Linux-x86_64 \
&& apk del \
  build-base \
  cmake \
  git \
  python3 \
  clang \
  ninja \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /var/cache/debconf/*-old \
&& rm -rf /usr/share/doc/* \
&& rm -rf /usr/share/man/?? \
&& rm -rf /usr/share/man/??_*

# CMD ["/bin/bash"]

# ------------------------------------------------------------------------------

FROM scratch

COPY --from=build-base /binaryen/install /binaryen
