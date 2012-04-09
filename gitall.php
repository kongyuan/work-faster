#! /usr/bin/php5
<?php
 
array_shift($argv) ;
foreach($argv as &$v)
{
	if( preg_match("/[\\s'\"]/s",$v) )
	{
		$v = '"' . addslashes($v) . '"' ;
	}
} 
$sCommand = 'git ' . implode(' ',$argv) ;

$sCwd = getcwd() ;

foreach(explode("\n",`find \$HEREPATH -name .git -follow`) as $sResp)
{
	if(!$sResp=trim($sResp))
	{
		continue ;
	}
	$sResp = dirname($sResp) ;	
	echo "\033[32;40m {$sResp} >> {$sCommand} \033[0m\r\n" ;
	
	chdir( $sCwd.'/'.$sResp ) ;
	echo `$sCommand` ;
}

chdir($sCwd) ;