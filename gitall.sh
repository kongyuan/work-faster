#!/bin/bash
#git批量操作,一次性pull或者push一个目录下所有git仓库,目前智能操作master分支

VERSION=1.0

#帮助处理
if [ "-h" == "$1" ] || [ "$#" == 0 ]
 then
echo "usage: gitall [-v] [-help]
	      <command> [<path>]";

echo "The most commonly used commands are:
        status     check all sub dir status
	pull       pull all sub dir
	push       push all sub dir
        commit     add all and commit all";
exit 1;
fi
#版本处理
if [ "-v" == "$1" ]
 then
    echo gitall $VERSION;
exit 1
fi

#路径处理
HEREPATH='.'

if [ -n "$2" ] # && [ '.' != "$2" ]
 then
HEREPATH=$2
fi

OLDPATH=$(pwd)

for path in `find $HEREPATH -name .git -follow`
 do
    cd ${path:0:-4}

    if [ "$1" == 'pull' ]
    then
	echo -e "\033[32;40m >> git pull ${path:0:-4}\033[0m"
	git pull
    elif [ "$1" == 'push' ]
    then
	echo -e "\033[32;40m >> git push ${path:0:-4}\033[0m"
	git push
    elif [ "$1" == "status" ]
    then
	echo -e "\033[32;40m >> git status ${path:0:-4}\033[0m"
	git status
    elif [ "$1" == "commit" ]
    then
	echo -e "\033[32;40m >> git commit -a ${path:0:-4}\033[0m"
	git commit -a
    fi
    
    cd $OLDPATH
done
