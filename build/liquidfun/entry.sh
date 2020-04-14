#!/bin/bash

# set -x

set -eu

UPDATE="update"
SHELL="shell"

if [ "$#" -lt 1 ]
then
  echo "Must provide at least one argument"
  exit 1
fi

if [[ "$1" == "update" ]]
then
  echo "Cleaning shared folder"
  rm -rf /src/*

  if [[ -z "$2" || "$2" == "emscripten" ]]
  then
    echo "Updating emscripten"
    echo "Pulling emscripten latest changes"
    rm -rf /emscripten
    git clone --depth 1 https://github.com/vonBrax/emscripten.git /emscripten
  fi

  if [[ -z "$2" || "$2" == "liquidfun" ]]
  then
    echo "Updating liquidfun"
    echo "Pulling liquidun latest changes"
    cd /liquidfun
    git checkout feature/embind 1> /dev/null
    git pull 1> /dev/null
    cd liquidfun/Box2D/lfjs
    echo "Compiling liquidfun wasm"
    emcc -I ../ -o /src/liquidfun.js --bind ./jsBindings/bindings.cpp -Oz --proxy-to-worker -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue']" -s "ENVIRONMENT=web,worker"
  fi
elif [[ "$1" == "$SHELL" ]]
then
  echo "Ok, lets get you a terminal, shall we?"
  /bin/bash
else
  echo "Sorry... could not understand what you meant by '$1'..."
  exit 1
fi
