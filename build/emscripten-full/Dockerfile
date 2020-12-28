FROM vonbrax/binaryen:version_98 AS binaryen

# ------------------------------------------------------------------------------

# FROM vonbrax/llvm:12.0.0 AS llvm

# ------------------------------------------------------------------------------

FROM ubuntu:18.04

ARG VERSION=2.0.11
ARG LLVM_MAJOR=12

ENV EMSCRIPTEN=/emscripten
ENV EM_DATA ${EMSCRIPTEN}/.data
# ENV EM_CONFIG ${EMSCRIPTEN}/.emscripten
ENV EM_CACHE ${EM_DATA}/cache
ENV EM_PORTS ${EM_DATA}/ports

ENV BINARYEN=/binaryen
ENV LLVM=/usr/lib/llvm-$LLVM_MAJOR/bin
ENV PATH=/emscripten:/binaryen:$LLVM:${PATH}

COPY --from=binaryen /binaryen /binaryen

# COPY --from=llvm /llvm /llvm
COPY llvm.sh .

RUN echo "\n## Update dependencies" \
&& apt-get -qq -y update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  wget \
  gnupg1 \
  gpg-agent \
  lsb-release \
  software-properties-common \
  build-essential \
  musl \
  musl-tools \
&& echo "\n## Install llvm-${LLVM_MAJOR}" \
# && wget https://apt.llvm.org/llvm.sh \
&& chmod +x llvm.sh \
&& ./llvm.sh $LLVM_MAJOR \
&& echo "\n## Cleanup LLVM installation" \
&& rm llvm.sh \
&& apt-get -qq purge -y \
  gpg-agent \
  lsb-release \
  software-properties-common \
  build-essential \
  musl \
  musl-tools \
&& echo "\n## Test LLVM binaries" \
&& ls -la /usr/bin \
&& ls -la $LLVM \
&& wasm-ld --version \
&& clang --version \
&& llvm-ar --version \
&& echo "\n## Install additional packages" \
# && apt-get -qq -y update \
&& apt-get -qq install -y --no-install-recommends \
  # ca-certificates \
  # wget \
  # gnupg1 \
  binutils \
  python3 \
  python3-distutils \
  nodejs \
# && echo "\n## Link LLVM binaries" \
# && wasm-ld --version \
# && clang --version \
# && llvm-ar --version \
# && cd / \
&& echo "\n## Get emscripten ${VERSION}" \
&& wget -q -O emscripten-release https://github.com/emscripten-core/emscripten/archive/${VERSION}.tar.gz \
&& tar zxf emscripten-release \
&& mv /emscripten-${VERSION} ${EMSCRIPTEN} \
&& mkdir -p ${EM_CACHE} \
&& mkdir -p ${EM_PORTS}

# ENV EMCC_DEBUG=1
# COPY .emscripten /emscripten

RUN echo "\n## Create the .emscripten file" \
&& emcc -v \
&& emcc -v \
&& echo "\n## Test emcc and pre-populate cache" \
&& mkdir /test-emcc \
&& cd /test-emcc \
&& printf '#include <iostream>\nint main(){std::cout << "HELLO FROM DOCKER C++"<<std::endl;return 0;}' > test.cpp \
&& emcc test.cpp && node a.out.js \
# # Embind
&& echo "\n## Test embind" \
&& printf "#include <string>\n#include <emscripten/bind.h>\nint main() {\n    std::string str = \"Hello, world\";\n    auto temp = emscripten::val(str);\n}\n" > test.cpp \
&& emcc test.cpp -o test.js -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=1 -s PROXY_TO_PTHREAD=1 --bind -std=c++11 \
&& emcc test.cpp -o test.js --bind -std=c++11 \
# && rm test.cpp *.js *.wasm \
&& cd \
&& rm -rf test-emcc \
# sleep will make sure that created cache will be stored correctly
&& sleep 2

RUN echo "\n## Clean up" \
&& rm /emscripten-release \
&& strip -s `which node` \
&& apt-get -qq -y purge \
  ca-certificates \
  wget \
  gnupg1 \
  binutils \
&& apt-get -y clean \
&& apt-get -y autoclean \
&& apt-get -y autoremove \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /var/cache/debconf/*-old \
&& rm -rf /usr/share/doc/* \
&& rm -rf /usr/share/man/?? \
&& rm -rf /usr/share/man/??_* \
# emscripten-version.txt is crucial to make emcc work
&& _file=`echo /emscripten/docs/emcc.txt` \
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
&& echo "## Done"

CMD [ "/bin/bash" ]
