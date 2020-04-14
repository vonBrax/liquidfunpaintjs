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
&& echo "\n## Install llvm ${VERSION} toolchain" \
# dash doesn't support "<<<""
&& IFS="." read -r MAJOR REST << EOF "${VERSION}" EOF\
# && REPO_NAME="deb http://apt.llvm.org/bionic/   llvm-toolchain-bionic$LLVM_VERSION_STRING  main" \
# && wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add - \
# && add-apt-repository "deb http://apt.llvm.org/bionic/   llvm-toolchain-bionic  main" \
# && add-apt-repository "${REPO_NAME}" \
# && apt-get -qq update \
# && apt-get -qq install -y clang-$LLVM_VERSION lld-$LLVM_VERSION \
&& wget https://apt.llvm.org/llvm.sh \
&& chmod +x llvm.sh \
&& ./llvm.sh $MAJOR \
&& echo "\n## Install exodus" \
&& pip install exodus-bundler \
# Export only the bare minimum number of llvm tools
# so that emscripten can compile to wasm
&& echo "\n## Prepare llvm binaries to export" \
&& cd /usr/lib/llvm-11/bin \
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
