#!/bin/bash

#询问网站域名
read -p 'input domain of your new website: ' webname

if [ -n '$domain' ]; then
	domain="www.$webname.com"
	echo "your domain of new website is : $domain"
else
	echo 'error:NO domain given! @_@'
	exit 1
fi

#域名准备完毕，开始建立虚拟空间
cd /etc/apache2/sites-enabled/

#TODO 检查路径是否正确,或者使用绝对路径访问文件

if [ -f $domain ]; then 
	echo 'error:domain already exist! @_@'
	exit 1;
else
	echo "try to make new file : $domain"
	touch $webname
	echo "
		<VirtualHost *:80>
			ServerName $domain
			DocumentRoot $HOME/$webname/
		</VirtualHost>
		" >> $webname
fi

#修改hosts

echo "127.0.0.1 $domain" >> /etc/hosts

#建立网站文件夹
mkdir ~/$webname/
chmod 755 -R ~/$webname/
chown www-data:www-data ~/$webname/

echo 'done! ^_^'
exit 0
