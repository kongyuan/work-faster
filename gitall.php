#! /usr/bin/php5
<?php

$arrActionRepoIndexies = null ;

array_shift($argv) ;
foreach($argv as $i=>&$v)
{
	if( preg_match('/^@(\\d+)$/',$v,$arrRes) )
	{
		$arrActionRepoIndexies[] = (int)$arrRes[1] ;
		unset($argv[$i]) ;
		continue ;
	}
	
	if( preg_match("/[\\s'\"]/s",$v) )
	{
		$v = '"' . addslashes($v) . '"' ;
	}
}
$sCommand = 'git ' . implode(' ',$argv) ;

$sCwd = getcwd() ;

foreach(explode("\n",`find \$HEREPATH -name .git -follow`) as $nIdx=>$sResp)
{
	if(!$sResp=trim($sResp))
	{
		continue ;
	}
	
	// 指定库
	if( $arrActionRepoIndexies and !in_array($nIdx,$arrActionRepoIndexies) )
	{
		continue ;
	}
	
	$sResp = dirname($sResp) ;	
	echo "\033[32;40m[@{$nIdx}] {$sResp} >> {$sCommand} \033[0m\r\n" ;
	
	chdir( $sCwd.'/'.$sResp ) ;
	echo `$sCommand` ;
}

chdir($sCwd) ;