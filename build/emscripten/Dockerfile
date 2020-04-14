FROM vonbrax/binaryen:version_91 AS binaryen

# ------------------------------------------------------------------------------

FROM vonbrax/llvm:11.0.0 AS llvm

# ------------------------------------------------------------------------------

FROM ubuntu:18.04

ARG VERSION=1.39.12

ENV EMSCRIPTEN=/emscripten
ENV EM_DATA ${EMSCRIPTEN}/.data
ENV EM_CONFIG ${EMSCRIPTEN}/.emscripten
ENV EM_CACHE ${EM_DATA}/cache
ENV EM_PORTS ${EM_DATA}/ports

ENV BINARYEN=/binaryen
ENV LLVM=/llvm/bin
ENV PATH=/emscripten:/binaryen:/llvm/bin:${PATH}

COPY --from=binaryen /binaryen /binaryen/bin

COPY --from=llvm /llvm /llvm

RUN echo "\n## Link LLVM binaries" \
&& ln -s /llvm/bin/clang /llvm/bin/clang-11 \
&& ln -s /llvm/bin/clang /llvm/bin/clang++ \
&& ln -s /llvm/bin/clang /llvm/bin/clang-cpp \
&& ln -s /llvm/bin/llvm-ar /llvm/bin/llvm-dlltool \
&& ln -s /llvm/bin/llvm-ar /llvm/bin/llvm-lib \
&& ln -s /llvm/bin/llvm-ar /llvm/bin/llvm-ranlib \
&& wasm-ld --version \
&& clang --version \
&& llvm-ar --version \
&& echo "\n## Update and install packages" \
&& apt-get -qq -y update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  wget \
  gnupg1 \
  python3 \
  python3-distutils \
  nodejs \
  binutils \
&& echo "\n## Get emscripten" \
&& wget -q -O emscripten-release https://github.com/emscripten-core/emscripten/archive/${VERSION}.tar.gz \
&& tar zxf emscripten-release \
&& mv /emscripten-${VERSION} ${EMSCRIPTEN} \
&& mkdir -p ${EM_CACHE} \
&& mkdir -p ${EM_PORTS} \
&& emcc -v \
&& echo "\n## Clean up" \
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
&& echo "\n## Test and pre-populate cache" \
&& printf '#include <iostream>\nint main(){std::cout << "HELLO FROM DOCKER C++"<<std::endl;return 0;}' > test.cpp \
&& emcc test.cpp && node a.out.js \
&& rm test.cpp *.js *.wasm \
# sleep will make sure that created cache will be stored correctly
&& sleep 2 \
&& echo "## Done"

CMD [ "/bin/bash" ]
