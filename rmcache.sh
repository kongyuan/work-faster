#!/bin/bash
#清除opencomb编译后生成的文件

#路径处理
HEREPATH='.'

if [ -n "$1" ]
 then
HEREPATH=$1
fi

OLDPATH=$(pwd)

cd "${HEREPATH}/data/cache";
rm -r *;
cd $OLDPATH;
cd "${HEREPATH}/data/class";
rm -r *;
cd $OLDPATH;
cd "${HEREPATH}/data/compiled";
rm -r *;
cd $OLDPATH;


