FROM ubuntu:18.04 as llvm-base

ARG VERSION="11.0.0"

RUN echo "\n## Update and install dependencies" \
&& apt-get -qq update && apt-get -qq install --yes --no-install-recommends \
  ca-certificates \
  wget \
  gnupg1 \
  gpg-agent \
  lsb-release \
  software-properties-common \
  python \
  python-pip \
  build-essential \
  musl \
  musl-tools \
&& MAJOR=$(echo ${VERSION} | cut -d "." -f1) \
&& echo "\n## Install llvm-${MAJOR} toolchain" \
&& wget https://apt.llvm.org/llvm.sh \
&& chmod +x llvm.sh \
&& ./llvm.sh $MAJOR \
&& rm llvm.sh \
&& echo "\n## Install exodus" \
&& pip install exodus-bundler \
# Export the minimum number of llvm tools necessary
# in order to make emscripten run
&& echo "\n## Prepare llvm binaries to export" \
&& cd /usr/lib/llvm-${MAJOR}/bin \
&& exodus --tarball --output /tmp/bundle.tgz \
  clang \
  wasm-ld \
  llc \
  llvm-ar \
  llvm-as \
  llvm-nm \
&& mkdir -p /root/exodus \
&& tar --strip 1 -C /root/exodus -zxf /tmp/bundle.tgz \
&& echo "\n## Clean up" \
&& pip uninstall -y exodus-bundler \
&& apt-get -qq purge -y \
  ca-certificates \
  wget \
  gnupg1 \
  gpg-agent \
  lsb-release \
  software-properties-common \
  python \
  python-pip \
  build-essential \
  musl \
  musl-tools \
  clang-$MAJOR \
  lldb-$MAJOR \
  lld-$MAJOR \
  clangd-$MAJOR \
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

COPY --from=llvm-base /root/exodus /llvm
