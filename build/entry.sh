#!/bin/bash

# set -x

set -eu

UPDATE="update"
SHELL="shell"

if [ "$#" -ne 1 ]
then
  echo "Must provide exactly one argument"
  exit 1
fi

if [[ "$1" == "$UPDATE" ]]
then
  echo "Message received, updating."
  echo "Cleaning liquidfun folder"
  cd /common
  rm *.*
  echo "Pulling emscripten"
  cd /emscripten
  git pull
  echo "Pulling liquidun"
  cd /liquidfun
  git checkout feature/embind
  git pull
  cd liquidfun/Box2D/lfjs
  echo "Compiling liquidfun"
  /emscripten/emcc -I ../ -o /common/liquidfun.js --bind ./jsBindings/bindings.cpp -Oz --proxy-to-worker -s "EXTRA_EXPORTED_RUNTIME_METHODS=['getValue']" -s "ENVIRONMENT=web,worker"
elif [[ "$1" == "$SHELL" ]]
then
  echo "Ok, lets get you a terminal, shall we?"
  bash
else
  echo "Sorry... could not understand what you meant by '$1'..."
  exit 1
fi
