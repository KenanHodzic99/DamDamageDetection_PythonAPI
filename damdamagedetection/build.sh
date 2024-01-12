#!/bin/sh

set -u
set -e

cd frontend || exit
npm install
rm -rf build
REACT_APP_BACKEND="/" npm run build
cd .. || exit

./gradlew clean bootJar
