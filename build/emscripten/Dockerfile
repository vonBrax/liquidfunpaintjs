FROM vonbrax/binaryen:version_97 AS binaryen

# ------------------------------------------------------------------------------

FROM vonbrax/llvm:12.0.0 AS llvm

# ------------------------------------------------------------------------------

FROM ubuntu:18.04

ARG VERSION=2.0.10
ARG LLVM_MAJOR=12

ENV EMSCRIPTEN=/emscripten
ENV EM_DATA ${EMSCRIPTEN}/.data
# ENV EM_CONFIG ${EMSCRIPTEN}/.emscripten
ENV EM_CACHE ${EM_DATA}/cache
ENV EM_PORTS ${EM_DATA}/ports

ENV BINARYEN=/binaryen
ENV LLVM=/llvm/bin
ENV PATH=/emscripten:/binaryen:/llvm/bin:${PATH}

COPY --from=binaryen /binaryen /binaryen

COPY --from=llvm /llvm /llvm

RUN echo "\n## Link LLVM binaries" \
&& ln -s /llvm/bin/clang-$LLVM_MAJOR /llvm/bin/clang \
&& ln -s /llvm/bin/clang++-$LLVM_MAJOR /llvm/bin/clang++ \
# && ln -s /llvm/bin/clang-cl-$LLVM_MAJOR /llvm/bin/clang-cl \
&& ln -s /llvm/bin/clang-cpp-$LLVM_MAJOR /llvm/bin/clang-cpp \
&& ln -s /llvm/bin/clangd-$LLVM_MAJOR /llvm/bin/clangd \
&& ln -s /llvm/bin/ld.lld-$LLVM_MAJOR /llvm/bin/ld.lld \
&& ln -s /llvm/bin/ld64.lld-$LLVM_MAJOR /llvm/bin/ld64.lld \
&& ln -s /llvm/bin/ld64.lld.darwinnew-$LLVM_MAJOR /llvm/bin/ld64.lld.darwinnew \
&& ln -s /llvm/bin/llc-$LLVM_MAJOR /llvm/bin/llc \
&& ln -s /llvm/bin/lld-$LLVM_MAJOR /llvm/bin/lld \
&& ln -s /llvm/bin/lld-link-$LLVM_MAJOR /llvm/bin/lld-link \
&& ln -s /llvm/bin/lldb-$LLVM_MAJOR /llvm/bin/lldb \
&& ln -s /llvm/bin/lli-$LLVM_MAJOR /llvm/bin/lli \
&& ln -s /llvm/bin/llvm-ar-$LLVM_MAJOR /llvm/bin/llvm-ar \
&& ln -s /llvm/bin/llvm-as-$LLVM_MAJOR /llvm/bin/llvm-as \
&& ln -s /llvm/bin/llvm-config-$LLVM_MAJOR /llvm/bin/llvm-config \
&& ln -s /llvm/bin/llvm-dlltool-$LLVM_MAJOR /llvm/bin/llvm-dlltool \
&& ln -s /llvm/bin/llvm-install-name-tool-$LLVM_MAJOR /llvm/bin/llvm-install-name-tool \
&& ln -s /llvm/bin/llvm-lib-$LLVM_MAJOR /llvm/bin/llvm-lib \
&& ln -s /llvm/bin/llvm-libtool-darwin-$LLVM_MAJOR /llvm/bin/llvm-libtool-darwin \
&& ln -s /llvm/bin/llvm-link-$LLVM_MAJOR /llvm/bin/llvm-link \
&& ln -s /llvm/bin/llvm-mc-$LLVM_MAJOR /llvm/bin/llvm-mc \
&& ln -s /llvm/bin/llvm-mca-$LLVM_MAJOR /llvm/bin/llvm-mca \
&& ln -s /llvm/bin/llvm-ml-$LLVM_MAJOR /llvm/bin/llvm-ml \
&& ln -s /llvm/bin/llvm-mt-$LLVM_MAJOR /llvm/bin/llvm-mt \
&& ln -s /llvm/bin/llvm-nm-$LLVM_MAJOR /llvm/bin/llvm-nm \
&& ln -s /llvm/bin/llvm-objcopy-$LLVM_MAJOR /llvm/bin/llvm-objcopy \
&& ln -s /llvm/bin/llvm-objdump-$LLVM_MAJOR /llvm/bin/llvm-objdump \
&& ln -s /llvm/bin/llvm-ranlib-$LLVM_MAJOR /llvm/bin/llvm-ranlib \
&& ln -s /llvm/bin/llvm-rc-$LLVM_MAJOR /llvm/bin/llvm-rc \
&& ln -s /llvm/bin/llvm-readelf-$LLVM_MAJOR /llvm/bin/llvm-readelf \
&& ln -s /llvm/bin/llvm-readobj-$LLVM_MAJOR /llvm/bin/llvm-readobj \
&& ln -s /llvm/bin/llvm-strip-$LLVM_MAJOR /llvm/bin/llvm-strip \
&& ln -s /llvm/bin/wasm-ld-$LLVM_MAJOR /llvm/bin/wasm-ld \
&& ls -la /llvm/bin \
# && ln -s /llvm/bin/clang-cpp-$LLVM_MAJOR /llvm/bin/clang-cpp \
# && ln -s /llvm/bin/lldb-$LLVM_MAJOR /llvm/bin/lldb \
# && ln -s /llvm/bin/wasm-ld-$LLVM_MAJOR /llvm/bin/wasm-ld \
&& wasm-ld --version \
&& clang --version \
&& llvm-ar --version \
&& echo "\n## Update and install packages" \
&& apt-get -qq -y update \
&& apt-get -qq install -y --no-install-recommends \
  ca-certificates \
  wget \
  gnupg1 \
  binutils \
  python3 \
  python3-distutils \
  nodejs \
&& echo "\n## Link LLVM binaries" \
&& wasm-ld --version \
&& clang --version \
&& llvm-ar --version \
&& cd / \
&& echo "\n## Get emscripten" \
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
# && mkdir /test-emcc \
# && cd /test-emcc \
&& printf '#include <iostream>\nint main(){std::cout << "HELLO FROM DOCKER C++"<<std::endl;return 0;}' > test.cpp \
# && emcc test.cpp && node a.out.js \
# # Embind
# && echo "\n## Test embind" \
# && printf "#include <string>\n#include <emscripten/bind.h>\nint main() {\n    std::string str = \"Hello, world\";\n    auto temp = emscripten::val(str);\n}\n" > test.cpp \
# && emcc test.cpp -o test.js -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=1 -s PROXY_TO_PTHREAD=1 --bind -std=c++11 \
# && emcc test.cpp -o test.js --bind -std=c++11 \
# && rm test.cpp *.js *.wasm \
# && cd \
# && rm -rf test-emcc \
# sleep will make sure that created cache will be stored correctly
&& sleep 2

# RUN echo "\n## Clean up" \
# && rm /emscripten-release \
# && strip -s `which node` \
# && apt-get -qq -y purge \
#   ca-certificates \
#   wget \
#   gnupg1 \
#   binutils \
# && apt-get -y clean \
# && apt-get -y autoclean \
# && apt-get -y autoremove \
# && rm -rf /var/lib/apt/lists/* \
# && rm -rf /var/cache/debconf/*-old \
# && rm -rf /usr/share/doc/* \
# && rm -rf /usr/share/man/?? \
# && rm -rf /usr/share/man/??_* \
# # emscripten-version.txt is crucial to make emcc work
# && _file=`echo /emscripten/docs/emcc.txt` \
# && _content=`cat ${_file}` \
# && rm -rf /emscripten/docs /emscripten/media /emscripten/site \
# && mkdir -p `dirname ${_file}` \
# && echo ${_content} >> ${_file} \
# && find . -name "*.pyc" -exec rm {} \; \
# && find . -name "CMakeFiles" -type d -prune -exec rm -fr {} \; \
# && find . -name "CMakeCache.txt" -exec rm {} \; \
# && find . -name "*.o" -exec rm {} \; \
# && find . -name "*.a" -exec rm {} \; \
# && find . -name "*.gen.tmp" -exec rm {} \; \
# && rm -fr **/*_32bit \
# && rm -rf **/.git \
# && rm -rf **/.github \
# && rm -rf **/tests \
# && rm -rf **/*.md \
# && rm -rf **/*.bat \
# && echo "## Done"

CMD [ "/bin/bash" ]
