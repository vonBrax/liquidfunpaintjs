ARG EMSCRIPTEN_VERSION=1.39.3
FROM trzeci/emscripten-slim:sdk-tag-${EMSCRIPTEN_VERSION}-64bit as emscripten_base

# ------------------------------------------------------------------------------
# The binaryen compiled in the image above seems to be broken
# and breaking emcc compilation.
# Temporarily building it here from source

FROM ubuntu:18.04 as binaryen-image

RUN echo "## Update and install dependencies" \
&& apt-get -qq -y update && apt-get -qq install --yes --no-install-recommends \
    ca-certificates \
    git-core \
    make \
    cmake \
    build-essential \
    python3 \
&& echo "## Clone binaryen" && \
    git clone --depth 1 https://github.com/WebAssembly/binaryen.git /binaryen \
&& echo "## Build binaryen" && \
    cd /binaryen && \
    mkdir -p dist && \
    cd dist && \
    echo "## Running cmake" && \
    cmake ../ && \
    echo "## Running make" && \
    make

# ------------------------------------------------------------------------------
# Entries in this section are required to move Emscripten SDK to another base image

# Any arbitrary base image of choice
FROM ubuntu:18.04

# Fallback in case Emscripten isn't activated.
# This will let use tools offered by this image inside other Docker images (sub-stages) or with custom / no entrypoint
ENV EMSDK /emsdk_portable
ENV EMSCRIPTEN=${EMSDK}/emscripten/sdk

ENV EM_DATA ${EMSDK}/.data
ENV EM_CONFIG ${EMSDK}/.emscripten
ENV EM_CACHE ${EM_DATA}/cache
ENV EM_PORTS ${EM_DATA}/ports

ENV TAG=1.39.3
ENV BINARYEN=${EMSDK}/binaryen/tag-${TAG}_64bit_binaryen

# Source /emsdk_portable contains every emscripten tool.
# It's not recommended to change destination path
COPY --from=emscripten_base ${EMSDK} ${EMSDK}
COPY --from=binaryen-image /binaryen/dist ${BINARYEN}

VOLUME /src

# Fallback in case Emscripten isn't activated
# Expose Major tools to system PATH, so that emcc, node, asm2wasm etc can be used without activation
ENV PATH="${EMSDK}:${EMSDK}/emscripten/sdk:${EMSDK}/llvm/clang/bin:${EMSDK}/node/current/bin:${EMSDK}/binaryen/bin:${PATH}"

# Use entrypoint that's coming from emscripten-slim image. It sets all required system paths and variables
# ENTRYPOINT ["/emsdk_portable/entrypoint"]

# ------------------------------------------------------------------------------
# This section contain an arbitrary code for image customization

RUN echo "Start emscripten-ubuntu compilation" \
    &&  echo "## Create a standard user: emscripten:emscripten" \
    &&  groupadd --gid 1000 emscripten \
    &&  useradd --uid 1000 --gid emscripten --shell /bin/bash --create-home emscripten \
    &&  echo "## Update and install packages" \
    &&  apt-get -qq -y update && apt-get -qq install -y --no-install-recommends \
        git-core ca-certificates python \
    && echo "## Replace emscripten" && \
        cd /emsdk_portable/emscripten && \
        rm -rf tag-${TAG} && \
        git clone --depth 1 https://github.com/vonBrax/emscripten.git tag-${TAG} && \
        rm -rf tag-${TAG}/site && \
        rm -rf tag-${TAG}/third_party/websockify/docs && \
        rm -rf tag-${TAG}/system/lib/libunwind/docs \
    &&  echo "## Clone liquidfun" && \
        git clone -b feature/embind --depth 1 https://github.com/vonBrax/liquidfun.git /tmp/lf && \
        mkdir -p /liquidfun/liquidfun/Box2D/Box2D && \
        mkdir -p /liquidfun/liquidfun/Box2D/lfjs && \
        cp -r /tmp/lf/liquidfun/Box2D/Box2D /liquidfun/liquidfun/Box2D && \
        cp -r /tmp/lf/liquidfun/Box2D/lfjs /liquidfun/liquidfun/Box2D && \
        rm -rf /tmp/lf \
    && echo "## Clean up" && \
        apt-get autoremove -y && \
        apt-get clean && \
        rm -rf ${BINARYEN}/CMake* && \
        rm -rf ${BINARYEN}/*.cmake && \
        rm -rf ${BINARYEN}/Makefile && \
        rm -rf ${BINARYEN}/src && \
        rm -rf ${BINARYEN}/third_party && \
        rm -rf /var/lib/apt/lists/* && \
        rm -rf /var/cache/debconf/*-old && \
        rm -rf /usr/share/doc/* && \
        rm -rf /usr/share/man/?? && \
        rm -rf /usr/share/man/??_* \
&&  echo "\n## Done"

# ------------------------------------------------------------------------------

WORKDIR /src

# ------------------------------------------------------------------------------
# Copy this Dockerimage into image, so that it will be possible to recreate it later
COPY Dockerfile /emsdk_portable/dockerfiles/trzeci/emscripten-ubuntu/
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# Leaving the COPY and extra RUN here so changes to the entry.sh file
# won't invalidate the RUN above (dependencies installation + binaryen compilation)
COPY ./entry.sh /
RUN chmod +x /entry.sh

ENTRYPOINT ["/entry.sh"]
