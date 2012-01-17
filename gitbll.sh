#!/bin/bash
# git批量操作,一次性对一个目录下的所有git仓库执行命令

APPNAME=gitbll
VERSION=1.0

#帮助处理
if [ "$#" == 0 ]
 then
	echo "usage: $APPNAME <command>";
	exit 1;
fi
#版本处理
if [ "-v" == "$1" ]
 then
	echo $APPNAME $VERSION;
exit 1
fi

OLDPATH=$(pwd)

for path in `find $HEREPATH -name .git -follow`
 do
	cd ${path:0:-4}
	strCommand="git $@"
	echo -e "\033[32;40m ${path:0:-4} >> $strCommand \033[0m"
	git $@
	cd $OLDPATH
done
