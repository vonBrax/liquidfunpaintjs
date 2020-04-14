#!/bin/bash

set -eux

SCRIPT_DIR="$(dirname "$BASH_SOURCE")"

## Binaryen
BINARYEN="version_91"
docker build -t vonbrax/binaryen:$BINARYEN --build-arg VERSION=$BINARYEN $SCRIPT_DIR/binaryen &

LLVM="11.0.0"
docker build -t vonbrax/llvm:$LLVM --build-arg VERSION=$LLVM $SCRIPT_DIR/llvm &

wait

EMSCRIPTEN="1.39.12"
docker build -t vonbrax/emscripten:$EMSCRIPTEN --build-arg VERSION=$EMSCRIPTEN $SCRIPT_DIR/emscripten

LIQUIDFUN="1.1.0"
docker build -t vonbrax/liquidfun:$LIQUIDFUN --build-arg VERSION=$LIQUIDFUN $SCRIPT_DIR/liquidfun
