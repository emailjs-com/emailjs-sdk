#!/bin/bash

sed -i '' -e "s/process.env.npm_package_version/'$1'/g" "./$2/methods/send/send.js"
sed -i '' -e "s/process.env.npm_package_version/'$1'/g" "./$2/methods/sendForm/sendForm.js"

echo -e "\033[0;33mSDK version is $1\033[0m"
