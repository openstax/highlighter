#!/usr/bin/env bash
set -e; if [ -n "$DEBUG" ]; then set -x; fi

if [ -z "$(which docker)" ]; then
  echo "docker is required to build swagger" > /dev/stderr;
  exit 1;
fi

if [ -z "$(which yarn)" ]; then
  echo "yarn is required to build swagger" > /dev/stderr;
  exit 1;
fi

api_host=${API_HOST:-"openstax.org"}
swagger_path="/highlights/api/v0/swagger.json"

secure=${SECURE:-"true"}
protocol=$(test "$secure" = "true" && echo "https" || echo "http")

temp_dir=$(mktemp -d -t ci-XXXXXXXXXX)

echo "saving swagger file: $temp_dir/swagger.json" > /dev/stderr;

curl -s "$protocol://$api_host$swagger_path" > "$temp_dir/swagger.json"

echo "building swagger into: $temp_dir/src" > /dev/stderr;

docker run --rm -v "$temp_dir:/shared" openapitools/openapi-generator-cli generate \
  -i /shared/swagger.json \
  -g typescript-fetch \
  -o /shared/src

echo "compiling typescript" > /dev/stderr;
cd "$temp_dir/src"

# swagger ts breaks on more recent version
yarn add typescript@3.5
yarn tsc --module commonjs --target es6 --lib es2015,dom --outDir dist --declaration index.ts

echo "completed build into $temp_dir/dist" > /dev/stderr;
