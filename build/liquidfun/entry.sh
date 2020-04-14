#!/bin/bash

# set -x

set -eu

UPDATE="update"
SHELL="shell"
REPOSITORY="https://github.com/vonbrax/emscripten"
REVISION="e32445dc0d7fd62d8fe6564c4db8f30541257691"

if [ "$#" -lt 1 ]
then
  echo "Error: Must provide at least one argument"
  exit 1
fi

if [[ "$1" == "update" ]]
then
  echo "## Clean shared volume directory"
  rm -rf /src/*

  if [[ "$#" -lt 2 || "$2" == "emscripten" ]]
  then
    echo "## Replace emscripten with forked version"
    cd /emscripten
    find . -name ".data" -prune -o -not -name ".emscripten*" -exec rm -fr {} \; || true
    git init
    git remote add origin $REPOSITORY
    git fetch --depth 1 origin $REVISION
    git reset --hard $REVISION
  fi

  if [[ "$#" -lt 2 || "$2" == "liquidfun" ]]
  then
    echo "## Check liquidfun repo for changes"
    cd /liquidfun
    git checkout feature/embind 1> /dev/null
    git pull 1> /dev/null
    cd liquidfun/Box2D/lfjs
    echo "## Compiling liquidfun to web assembly"
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
