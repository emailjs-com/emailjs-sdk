#!/bin/bash

sed -i '' -e "s/process.env.npm_package_version/'$1'/g" ./es/methods/send/send.js
sed -i '' -e "s/process.env.npm_package_version/'$1'/g" ./es/methods/sendForm/sendForm.js

echo -e "\033[0;33mApplication version is $1\033[0m"
