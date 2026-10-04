#!/bin/bash

cat > $1/package.json <<!EOF
{
    "type": "$2"
}
!EOF

echo -e "\033[0;33mSet $2 type for $1 build\033[0m"
