#!/bin/bash

set -exo pipefail

CURRENT=$PWD
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROJECT_DIR=$(dirname $SCRIPT_DIR)
PROJECT_NAME=$(basename $PROJECT_DIR)
DIST="/tmp/$PROJECT_NAME"

check_stage() {
  if [ -z ${STAGE+x} ]; then
    echo "Please enable your environment first. See docs/deployment.md"
    exit -1
  fi
}

git_description() {
  local branch=$(git branch --show-current)
  local sha1=$(git rev-parse --short HEAD)
  local repository=$PROJECT_NAME
  local description=$(echo $repository:$branch:$sha1)
  echo $description
}

prepare() {
  if [ -d $DIST ]; then
    rm -r $DIST
  fi

  echo "Copying project code..."
  mkdir -p $DIST
  cd $DIST
  cp -r $PROJECT_DIR/build .

  echo "Copying project manifest..."
  cp $PROJECT_DIR/package.json $PROJECT_DIR/package-lock.json .

  echo "Installing production project dependencies..."
  npm ci --production --ignore-scripts
}

bundle() {
  if [ ! -d $DIST ]; then
    echo "$DIST folder is required to bundle your code, please run \`${BASH_SOURCE[0]} prepare\` first"
    exit 0
  fi
  
  local outfile=$CURRENT/$PROJECT_NAME.zip
  cd $DIST
  echo "Zipping code to $outfile..."
  zip $outfile -q -r -X .
  cd $CURRENT
}

synth_iac() {
  cd $CURRENT
  cd infra
  echo "Synthetising iac"
  npx cdk synth nestjs-api-stack-$STAGE > /dev/null
  cd $CURRENT
}

deploy_iac() {
  check_stage
  if [ "$STAGE" != "development" ] && [ "$STAGE" != "rc" ] && [ "$STAGE" != "production" ]; then
    echo "Enable development/rc/production environment with `export STAGE=development` first before running this deployment"
    exit -1
  fi


  export GIT_DESCRIPTION=$(git_description $PROJECT_NAME); 
  npx cdk deploy nestjs-api-stack-$STAGE
}

run() {
  check_stage

  cd $PROJECT_DIR
  prepare
  bundle

  cd infra
  deploy_iac

  cd $CURRENT
}

# Check fn exists (bash)
if declare -f "$1" > /dev/null
then
  # call arguments verbatim
  "$@"
else
  echo "'$1' is not a known function name" >&2
  echo "Usage: ./scripts/deploy.sh (bundle|run)"
  exit 1
fi