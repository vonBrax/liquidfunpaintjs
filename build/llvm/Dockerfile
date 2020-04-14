FROM ubuntu:18.04 as llvm-base

RUN echo "\n## Update and install dependencies" \
&& apt-get -qq update && apt-get -qq install --yes --no-install-recommends \
  wget \
  gnupg1 \
  ca-certificates \
  software-properties-common \
  gpg-agent \
  python \
  python-pip \
  build-essential \
  musl \
  musl-tools \
&& echo "\n## Install llvm toolchain" \
&& wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add - \
&& add-apt-repository "deb http://apt.llvm.org/bionic/   llvm-toolchain-bionic  main" \
&& apt-get -qq update \
&& apt-get -qq install -y clang-11 lld-11 \
&& echo "\n## Install exodus" \
&& pip install exodus-bundler \
# Export only the bare minimum number of necessary files
# to run emscripten
&& echo "\n## Prepare llvm binaries to export" \
&& "\n## Packing clang-11" \
&& exodus --tarball --output /tmp/clang-11.tgz  clang-11 \
&& tar --strip 1 -C /root -zxf /tmp/clang-11.tgz \
&& echo "\n## Packing lld-11" \
&& exodus --detect --tarball --output /tmp/lld-11.tgz lld-11 \
&& tar --strip 1 -C /root -zxf /tmp/lld-11.tgz \
&& echo "\n## Packing llc-11" \
&& exodus --tarball --output /tmp/llc-11.tgz llc-11 \
&& tar --strip 1 -C /root -zxf /tmp/llc-11.tgz \
&& echo "\n## Packing llvm-ar-11" \
&& exodus --tarball --output /tmp/llvm-ar-11.tgz llvm-ar-11\
&& tar --strip 1 -C /root -zxf /tmp/llvm-ar-11.tgz \
&& echo "\n## Packing llvm-as-11" \
&& exodus --tarball --output /tmp/llvm-as-11.tgz llvm-as-11 \
&& tar --strip 1 -C /root -zxf /tmp/llvm-as-11.tgz \
&& echo "\n## Packing llvm-nm-11" \
&& exodus --tarball --output /tmp/llvm-nm-11.tgz llvm-nm-11 \
&& tar --strip 1 -C /root -zxf /tmp/llvm-nm-11.tgz \
&& echo "\n## Clean up" \
&& pip uninstall -y exodus-bundler \
&& apt-get -qq purge -y \
  wget  \
  gnupg1 \
  ca-certificates \
  software-properties-common \
  gpg-agent \
  python \
  python-pip \
  clang-11 \
  lld-11 \
  build-essential \
  musl \
  musl-tools \
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

COPY --from=llvm-base /root /llvm

# CMD [ "/bin/bash" ]
