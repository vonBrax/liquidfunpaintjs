#!/bin/bash

# set -x

set -eu

UPDATE="update"

if [ "$#" -ne 1 ]
then
  echo "Must provide exactly one argument"
  exit 1
fi

if [[ "$1" == "$UPDATE" ]]
then
  echo "Message received, updating."
elif [[ $1 -eq "test" ]]
then
  echo "Got it! Let's test it."
elif [[ $1 -eq "shell" ]]
then
  sh
else
  echo "Sorry... could not understand '$1'"
fi
