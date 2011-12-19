#!/bin/bash
#清除opencomb编译后生成的文件

#路径处理
HEREPATH='.'

if [ -n "$1" ]
 then
HEREPATH=$1
fi

OLDPATH=$(pwd)

if [ -d "${HEREPATH/data}" ] && [ -d "${HEREPATH}/data/cache" ] && [ -d "${HEREPATH}/data/class" ] && [ -d "${HEREPATH}/data/compiled" ]
	then
cd "${HEREPATH}/data/cache";
rm -r *;
cd $OLDPATH;
cd "${HEREPATH}/data/class";
rm -r *;
cd $OLDPATH;
cd "${HEREPATH}/data/compiled";
rm -r *;
cd $OLDPATH;
echo "成功完成清理";
else
echo "缓存目录不存在,请检查拼写和权限";
fi
