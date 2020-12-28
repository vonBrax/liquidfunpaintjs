FROM ubuntu:18.04 as llvm-base

ARG VERSION="12.0.0"

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
&& ls -la /usr/bin \
&& echo "\n## Install exodus" \
&& pip install exodus-bundler \
# Export the minimum number of llvm tools necessary
# in order to make emscripten run
&& echo "\n## Prepare llvm binaries to export" \
&& ls /usr/lib/llvm-12/bin/ \
&& cd /usr/bin/ \
&& ls -la \
&& exodus --tarball --output /tmp/bundle.tgz \
 "clang-${MAJOR}" \
 "clang++-${MAJOR}" \
#  "clang-cl-${MAJOR}" \
 "clang-cpp-${MAJOR}" \
 "clangd-${MAJOR}" \
 "ld.lld-${MAJOR}" \
 "ld64.lld-${MAJOR}" \
 "ld64.lld.darwinnew-${MAJOR}" \
 "llc-${MAJOR}" \
 "lld-${MAJOR}" \
 "lld-link-${MAJOR}" \
 "lldb-${MAJOR}" \
 "lli-${MAJOR}" \
 "llvm-ar-${MAJOR}" \
 "llvm-as-${MAJOR}" \
 "llvm-config-${MAJOR}" \
 "llvm-dlltool-${MAJOR}" \
 "llvm-install-name-tool-${MAJOR}" \
 "llvm-lib-${MAJOR}" \
 "llvm-libtool-darwin-${MAJOR}" \
 "llvm-link-${MAJOR}" \
 "llvm-mc-${MAJOR}" \
 "llvm-mca-${MAJOR}" \
 "llvm-ml-${MAJOR}" \
 "llvm-mt-${MAJOR}" \
 "llvm-nm-${MAJOR}" \
 "llvm-objcopy-${MAJOR}" \
 "llvm-objdump-${MAJOR}" \
 "llvm-ranlib-${MAJOR}" \
 "llvm-rc-${MAJOR}" \
 "llvm-readelf-${MAJOR}" \
 "llvm-readobj-${MAJOR}" \
 "llvm-strip-${MAJOR}" \
 "wasm-ld-${MAJOR}" \
# && cd /usr/lib/llvm-${MAJOR}/bin \
# && exodus --tarball --output /tmp/bundle.tgz \
#   clang \
#   wasm-ld \
#   llc \
#   llvm-ar \
#   llvm-as \
#   llvm-nm \
&& mkdir -p /root/exodus \
&& tar --strip 1 -C /root/exodus -zxf /tmp/bundle.tgz \
# && wget --no-verbose https://github.com/llvm/llvm-project/releases/download/llvmorg-11.0.0/clang+llvm-11.0.0-x86_64-linux-gnu-ubuntu-20.04.tar.xz \
# && mv clang+llvm-11.0.0-x86_64-linux-gnu-ubuntu-20.04.tar.xz /root/exodus \
# && tar -xvf /root/exodus/clang+llvm-11.0.0-x86_64-linux-gnu-ubuntu-20.04.tar.xz \
# && rm /root/exodus/clang+llvm-11.0.0-x86_64-linux-gnu-ubuntu-20.04.tar.xz \
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

# CMD ["/bin/bash"]

# ------------------------------------------------------------------------------

FROM scratch

COPY --from=llvm-base /root/exodus /llvm
