FROM ubuntu:18.04 AS build-base

# ARG VERSION=1.39.1
ARG VERSION=version_91

RUN echo "\n## Update and install dependencies" \
&& apt-get -qq update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  gnupg1 \
  wget \
&& echo "\n## Download binaryen" \
&& wget -q -O binaryen-release https://github.com/WebAssembly/binaryen/releases/download/${VERSION}/binaryen-${VERSION}-x86_64-linux.tar.gz \
&& tar zxf binaryen-release \
&& mv /binaryen-${VERSION} /binaryen \
&& echo "\n## Test binary" \
&& /binaryen/asm2wasm --version \
&& echo "\n## Clean up" \
&& rm binaryen-release \
&& apt-get -qq purge -y \
  ca-certificates \
  gnupg1 \
  wget \
&& apt-get -y clean \
&& apt-get -y autoclean \
&& apt-get -y autoremove \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /var/cache/debconf/*-old \
&& rm -rf /usr/share/doc/* \
&& rm -rf /usr/share/man/?? \
&& rm -rf /usr/share/man/??_*

# ------------------------------------------------------------------------------

FROM scratch

COPY --from=build-base /binaryen /binaryen
