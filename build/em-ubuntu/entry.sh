#!/bin/bash

# set -x

set -eu

TAG=1.39.3
UPDATE="update"
SHELL="shell"

# /emsdk_portable/entrypoint

if [ "$#" -ne 1 ]
then
  echo "Must provide exactly one argument"
  exit 1
fi

if [[ "$1" == "$UPDATE" ]]
then
  echo "Message received, updating."
  echo "Cleaning liquidfun folder"
  cd /src
  rm -f *
  echo "Pulling emscripten"
  cd /emsdk_portable/emscripten/tag-$TAG
  git pull
  echo "Pulling liquidun"
  git clone -b feature/embind --depth 1 https://github.com/vonBrax/liquidfun.git /tmp/lf && \
  mkdir -p /liquidfun/liquidfun/Box2D/Box2D && \
  mkdir -p /liquidfun/liquidfun/Box2D/lfjs && \
  cp -r /tmp/lf/liquidfun/Box2D/Box2D /liquidfun/liquidfun/Box2D && \
  cp -r /tmp/lf/liquidfun/Box2D/lfjs /liquidfun/liquidfun/Box2D && \
  rm -rf /tmp/lf \
  # cd /liquidfun
  #git checkout feature/embind
  #git pull
  cd /liquidfun/liquidfun/Box2D/lfjs
  echo "Compiling liquidfun"
  emcc -I ../ -o /src/liquidfun.js --bind ./jsBindings/bindings.cpp -Oz --proxy-to-worker -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue']" -s "ENVIRONMENT=web,worker"
elif [[ "$1" == "$SHELL" ]]
then
  echo "Ok, lets get you a terminal, shall we?"
  bash
else
  echo "Sorry... could not understand what you meant by '$1'..."
  exit 1
fi
