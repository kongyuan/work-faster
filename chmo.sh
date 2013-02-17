#!/bin/bash
#清除opencomb编译后生成的文件

#路径处理
HEREPATH='.'

if [ -n "$1" ]
 then
HEREPATH=$1
fi


sudo chmod 777 -R ${HEREPATH}
sudo chown www-data:www-data -R ${HEREPATH}
