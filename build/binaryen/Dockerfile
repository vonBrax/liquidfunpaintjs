FROM ubuntu:18.04 AS build-base

ARG VERSION=version_94

RUN echo "\n## Installing Bynarien $VERSION" \
&& echo "\n## Update and install dependencies" \
&& apt-get -qq update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  gnupg1 \
  wget \
&& echo "\n## Download binaryen" \
&& wget -q -O binaryen-release https://github.com/WebAssembly/binaryen/releases/download/${VERSION}/binaryen-${VERSION}-x86_64-linux.tar.gz \
&& tar zxf binaryen-release \
&& mv /binaryen-${VERSION} /binaryen \
# RUN echo "\n## Test binary" \
# && ls -la /binaryen \
# && ls -la /binaryen/bin \
# && ls -la /binaryen/include \
# && ls -la /binaryen/lib64 \
# && /binaryen/bin/asm2wasm --version \
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
