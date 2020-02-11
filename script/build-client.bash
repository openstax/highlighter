#!/bin/bash
set -e

if [ -d "./node_modules/@openstax/highlights-client" ]; then
  cp -r "./node_modules/@openstax/highlights-client" .
  exit 0
fi

if [ -d "./highlights-client" ]; then
  exit 0
fi

swagger_url="https://openstax.org/highlights/api/v0/swagger"

tmp_file=$(mktemp -t highlights-client.XXXXX)
download_url=$(curl -H "Content-type: application/json" -s \
    -X POST \
    -d "{\"options\": {\"npmName\": \"@openstax/highlights-client\"},\"openAPIUrl\": \"$swagger_url\"}" \
    http://api.openapi-generator.tech/api/gen/clients/typescript-fetch \
    | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8'))[\"link\"])")

curl -s -o "$tmp_file" "$download_url"

unzip "$tmp_file"

mv typescript-fetch-client highlights-client

cd highlights-client || exit 1

yarn install
yarn build
