#!/bin/bash

# set -x

set -eu

UPDATE="update"
SHELL="shell"
REPOSITORY="https://github.com/vonbrax/emscripten"
# REVISION="e32445dc0d7fd62d8fe6564c4db8f30541257691"
REVISION="fd765c9b1b6e46ba1d5e828007c561d9044bc763"

if [ "$#" -lt 1 ]
then
  echo "Error: Must provide at least one argument"
  exit 1
fi

if [[ "$1" == "update" ]]
then
  echo "## Clean shared volume directory"
  rm -rf /src/*

  # if [[ "$#" -lt 2 || "$2" == "emscripten" ]]
  # then
  #   echo "## Replace emscripten with forked version"
  #   # cd /emscripten
  #   cp -a /emsdk/upstream/emscripten/tools/ /tmp/temp_emsdk-tools
  #   cd /emsdk/upstream/emscripten
  #   find . -name ".data" -prune -o -not -name ".emscripten*" -exec rm -fr {} \; || true
  #   git init
  #   git remote add origin $REPOSITORY
  #   git fetch --depth 1 origin $REVISION
  #   git reset --hard $REVISION
  #   cp -a /tmp/temp_emsdk-tools /emsdk/upstream/emscripten/tools
  #   rm -rf /tmp/temp_emsdk-tools
  #   pwd
  #   ls -la
  # fi

  if [[ "$#" -lt 2 || "$2" == "liquidfun" ]]
  then
    echo "## Check liquidfun repo for changes"
    cd /liquidfun
    git checkout feature/embind 1> /dev/null
    git pull 1> /dev/null
    cd liquidfun/Box2D/lfjs
    echo "## Compiling liquidfun..."
    emcc \
      -I ../ \
      -o /src/liquidfun.js \
      --bind ./jsBindings/bindings.cpp \
      -O3 \
      -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue']" \
      -s ENVIRONMENT=web,worker \
      -s MODULARIZE=1 \
      -s 'EXPORT_NAME="ModulePromise"' \
      -s WASM=1 \
      -s OFFSCREEN_FRAMEBUFFER=1 \
      -s OFFSCREENCANVAS_SUPPORT=1 \
      -s TOTAL_MEMORY=33554432
      # -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue', 'GL']" \
      # -s "ALLOW_MEMORY_GROWTH=1"
      # --proxy-to-worker \
      # --clear-cache
  fi
elif [[ "$1" == "$SHELL" ]]
then
  echo "Ok, lets get you a terminal, shall we?"
  /bin/bash
else
  echo "Sorry... could not understand what you meant by '$1'..."
  exit 1
fi
