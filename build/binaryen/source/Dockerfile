FROM ubuntu:18.04 AS build-base

ARG VERSION=version_98

RUN echo "\n## Update and install dependencies" \
&& apt-get -qq update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  gnupg1 \
  build-essential \
  wget \
  python3 \
  ninja-build \
&& echo "\n## Download cmake 3.16.8" \
&& wget -q https://github.com/Kitware/CMake/releases/download/v3.16.8/cmake-3.16.8-Linux-x86_64.tar.gz \
&& tar -zxvf cmake-3.16.8-Linux-x86_64.tar.gz \
&& echo "\n## Download binaryen source code" \
&& wget -q https://github.com/WebAssembly/binaryen/archive/${VERSION}.tar.gz \
&& tar zxf ${VERSION}.tar.gz \
&& mv binaryen-${VERSION} binaryen \
&& echo "\n## Build binaryen" \
&& cd binaryen \
&& mkdir -p out \
&& /cmake-3.16.8-Linux-x86_64/bin/cmake -S . -B out -G Ninja -DCMAKE_BUILD_TYPE=Release \
&& /cmake-3.16.8-Linux-x86_64/bin/cmake --build out --config Release \
&& find out/bin/ -type f -perm -u=x -exec strip {} + \
&& echo "\n## Clean up" \
&& cd .. \
&& rm ${VERSION}.tar.gz \
&& rm cmake-3.16.8-Linux-x86_64.tar.gz \
&& rm -rf cmake-3.16.8-Linux-x86_64 \
&& apt-get -qq purge -y \
  ca-certificates \
  gnupg1 \
  build-essential \
  wget \
  python3 \
  ninja-build \
&& apt-get -y clean \
&& apt-get -y autoclean \
&& apt-get -y autoremove \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /var/cache/debconf/*-old \
&& rm -rf /usr/share/doc/* \
&& rm -rf /usr/share/man/?? \
&& rm -rf /usr/share/man/??_*

# CMD ["/bin/bash"]

# ------------------------------------------------------------------------------

FROM scratch

COPY --from=build-base /binaryen/out /binaryen
