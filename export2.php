<?php
	// Include the PHPWord.php, all other classes were loaded by an autoloader
	require_once 'PHPWord.php';
	$PHPWord = new PHPWord();
	//Searching for values to replace
	$document = $PHPWord->loadTemplate('doc/Temp1.docx');
	$document->setValue('Name', $Name);
	$document->setValue('No', $No);
	// save as a random file in temp file
	$temp_file = tempnam(sys_get_temp_dir(), 'PHPWord');
	$document->save($temp_file);

	// Your browser will name the file "myFile.docx"
	// regardless of what it's named on the server 
	header("Content-Disposition: attachment; filename='myFile.docx'");
	echo file_get_contents($temp_file); // or echo file_get_contents($temp_file);
	unlink($temp_file);  // remove temp file
?>