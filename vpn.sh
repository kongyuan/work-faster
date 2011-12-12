#!/usr/bin/expect -f

set port 7070
set user ramus
set host ssh005.5bird.com
set password 77889900
set timeout -1

spawn ssh -D $port $user@$host
expect "*assword:*"

send "$password\r"
expect eof
