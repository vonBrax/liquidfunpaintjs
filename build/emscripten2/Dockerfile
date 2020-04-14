FROM vonbrax/binaryen:1.39.1 AS binaryen

# ------------------------------------------------------------------------------

FROM vonbrax/llvm:11.0.0 AS llvm

# ------------------------------------------------------------------------------

FROM ubuntu:18.04

ENV EMSCRIPTEN=/emscripten
ENV EM_DATA ${EMSCRIPTEN}/.data
ENV EM_CONFIG ${EMSCRIPTEN}/.emscripten
ENV EM_CACHE ${EM_DATA}/cache
ENV EM_PORTS ${EM_DATA}/ports

ENV BINARYEN=/binaryen
ENV LLVM=/usr/bin
ENV PATH=/emscripten:/binaryen:${PATH}
ENV VERSION=1.39.12

COPY --from=binaryen /binaryen/asm2wasm /binaryen/wasm-opt /binaryen/wasm-emscripten-finalize /binaryen/bin/
COPY --from=llvm /llvm /usr

RUN echo "\n## Link LLVM binaries" \
&& ln -s /usr/bin/clang-11 /usr/bin/clang \
&& ln -s /usr/bin/clang-11 /usr/bin/clang++ \
&& ln -s /usr/bin/clang-11 /usr/bin/clang-cl \
&& ln -s /usr/bin/clang-11 /usr/bin/clang-cpp \
&& ln -s /usr/bin/lld-11 /usr/bin/lld \
&& ln -s /usr/bin/lld-11 /usr/bin/ld.lld \
&& ln -s /usr/bin/lld-11 /usr/bin/ld64.lld \
&& ln -s /usr/bin/lld-11 /usr/bin/lld-link \
&& ln -s /usr/bin/lld-11 /usr/bin/wasm-ld \
&& ln -s /usr/bin/llc-11 /usr/bin/llc \
&& ln -s /usr/bin/llvm-ar-11 /usr/bin/llvm-ar \
&& ln -s /usr/bin/llvm-as-11 /usr/bin/llvm-as \
&& ln -s /usr/bin/llvm-nm-11 /usr/bin/llvm-nm \
&& echo "\n## Update and install packages" \
&& apt-get -qq -y update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  wget \
  gnupg1 \
  python3 \
  python3-distutils \
  # git-core \
  nodejs \
  binutils \
&& echo "\n## Clone emscripten" \
# && git clone --depth 1 https://github.com/vonBrax/emscripten.git \
# Version 1.39.12 (todo: automate)
# && repository=https://github.com/vonbrax/emscripten \
# && revision=d6aced8adcb3c7d7c86f70cd48c8d6bedd8c0d74 \
# && mkdir -p ${EMSCRIPTEN} \
# && cd ${EMSCRIPTEN} \
# && git init \
# && git remote add origin $repository \
# && git fetch --depth=1 origin $revision \
# && git reset --hard $revision \
&& wget -O emscripten-release https://github.com/emscripten-core/emscripten/archive/${VERSION}.tar.gz \
&& tar xvf emscripten-release \
&& ls \
&& mv /emscripten-${VERSION} ${EMSCRIPTEN} \
&& mkdir -p ${EM_CACHE} \
&& mkdir -p ${EM_PORTS} \
# && export PATH=/emscripten:/binaryen:$PATH \
&& emcc -v \
&& echo "\n## Test emcc (hello world)" \
&& emcc /emscripten/tests/hello_world.cpp \
&& node /a.out.js \
&& echo "\n## Clean up" \
&& rm /a.out.js a.out.wasm \
&& rm /emscripten-release \
&& strip -s `which node` \
&& apt-get -qq -y purge binutils wget gnupg1 ca-certificates \
&& apt-get -y clean \
&& apt-get -y autoclean \
&& apt-get -y autoremove \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /var/cache/debconf/*-old \
&& rm -rf /usr/share/doc/* \
&& rm -rf /usr/share/man/?? \
&& rm -rf /usr/share/man/??_* \
# emscripten-version.txt is crucial to make emcc work
&& _file=`echo /emscripten/site/build/text/docs/tools_reference/emcc.txt` \
&& _content=`cat ${_file}` \
&& rm -rf /emscripten/docs /emscripten/media /emscripten/site \
&& mkdir -p `dirname ${_file}` \
&& echo ${_content} >> ${_file} \
&& find . -name "*.pyc" -exec rm {} \; \
&& find . -name "CMakeFiles" -type d -prune -exec rm -fr {} \; \
&& find . -name "CMakeCache.txt" -exec rm {} \; \
&& find . -name "*.o" -exec rm {} \; \
&& find . -name "*.a" -exec rm {} \; \
&& find . -name "*.gen.tmp" -exec rm {} \; \
&& rm -fr **/*_32bit \
&& rm -rf **/.git \
&& rm -rf **/.github \
&& rm -rf **/tests \
&& rm -rf **/*.md \
&& rm -rf **/*.bat \
# sleep will make sure that created cache will be stored correctly
&& sleep 2 \
&& echo "## Done"

CMD [ "/bin/bash" ]
