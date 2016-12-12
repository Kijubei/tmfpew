<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">

<?php


require_once 'PHPWord.php';

ini_set('default_charset', 'WINDOWS-1252');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//$savedSession=(isset($_POST['savedSession']) ? $_POST['savedSession']: "";

//var_dump($savedSession);


$val = 1;

$lname = "test";
;

$fname = "jojo";

createDocument($val, $lname, $fname);


function createDocument($val, $lname, $fname) {

	////////////////////////////

	$test = $_POST["inputSession"];

	//echo "neu ist: " . $test;

	$demo = array(
	    "bool" => false,
	    "int" => 1,
	    "float" => 3.14,
	    "string" => "hello world",
	    "array" => array(),
	    "object" => new stdClass(),
	    "resource" => tmpfile(),
	    "null" => null,
	);

	//$exportTest = $_POST[""]

	$theSession = var_export($_POST, true);

	// var_export -- nice, one-liner
	$debug_export = var_export($demo, true);

	$printr = print_r($demo, true);

	/////////////////////////////////////////////////



	// New Word Document
	$PHPWord = new PHPWord();

	$PHPWord->getCompatibility()->setOoxmlVersion(14);

	// New portrait section
	$section = $PHPWord->createSection();

	// Add header
	$header = $section->createHeader();
	//$header->addImage('uni_ol_logo.png', array('width'=>150, 'height'=>150, 'align'=>'left'));
	//$header->addText("Abteilung Medizinische Informatik\nDepartment für Versorgungsforschung\nFakultät für Medizin und Gesundheitswissenschaften\nCarl von Ossietzky Universität Oldenburg");
	$table = $header->addTable();
	$table->addRow();
	//$table->addCell(50)->addImage('uni_ol_logo.png', array('width'=>110, 'height'=>110, 'align'=>'left'));
	$table->addCell(1000)->addText("Abteilung Medizinische Informatik\nDepartment für Versorgungsforschung\nFakultät für Medizin und Gesundheitswissenschaften\nCarl von Ossietzky Universität Oldenburg");

	// Add footer
	$footer = $section->createFooter();
	$footer->addPreserveText('Seite {PAGE} von {NUMPAGES}', null, 'pStyle');

	$section->addTextBreak(2);

	$section->addText("Antwort: $val");
	$section->addText("Nachname: $lname");
	$section->addText("Vorname: $fname");

	///////////////////// DEBUG
	//$section->addText("printr: " . $printr);
	$section->addText("printr-echo: $printr");

	//$section->addText("debug_export: ".$debug_export);
	$section->addText("debug_export: $debug_export");

	$section->addText("theSession: $theSession");
	$section->addText("test: $test");

	$section->addText("demo[string]: $demo[string]");
	//$section->addText("demo[string]: $demo["string"]");
	$section->addText("demo[string]: ". $demo["string"]);
	$section->addText("demo[string]: ". $demo[string]);

	//////////////////////////////
		
	$section->addTextBreak(2);

	$text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

	// Define the TOC font style
	$fontStyle = array('spaceAfter'=>60, 'size'=>12);

	// Add title styles
	$PHPWord->addTitleStyle(1, array('size'=>20, 'color'=>'333333', 'bold'=>true));
	$PHPWord->addTitleStyle(2, array('size'=>16, 'color'=>'666666'));

	// Add text elements
	$section->addText('Table of contents:');
	$section->addTextBreak(2);

	// Add TOC
	$section->addTOC($fontStyle);

	// Add Titles
	$section->addTitle('I am Title 1', 1);

	// Add listitem elements
	$section->addListItem('List Item 1', 0);
	$section->addListItem('List Item 2', 0);
	$section->addListItem('List Item 3', 0);

	$section->addTextBreak(2);

	$section->addTitle('I am a Subtitle of Title 1', 2);
	$section->addTextBreak(2);

	// Add hyperlink elements
	$section->addLink('https://www.uni-oldenburg.de/medizininformatik/', 'Abteilung Medizinische Informatik', array('color'=>'0000FF', 'underline'=>PHPWord_Style_Font::UNDERLINE_SINGLE));
	$section->addTextBreak();
	$PHPWord->addLinkStyle('myOwnLinkStyle', array('bold'=>true, 'color'=>'808000'));
	$section->addLink('https://www.uni-oldenburg.de/medizininformatik/', null, 'myOwnLinkStyle');

	$section->addTextBreak(2);

	$section->addTitle('Another Title (Title 2)', 1);
	$section->addText($text);
	$section->addPageBreak();
	$section->addTitle('I am Title 3', 1);
	$section->addText($text, array('name'=>'Verdana', 'color'=>'006699'));
	$section->addTextBreak(2);
	$section->addTitle('I am a Subtitle of Title 3', 2);

	$PHPWord->addFontStyle('rStyle', array('bold'=>true, 'italic'=>true, 'size'=>16));
	$PHPWord->addParagraphStyle('pStyle', array('align'=>'center', 'spaceAfter'=>100));
	$section->addText($text, 'rStyle', 'pStyle');
	$section->addText($text, null, 'pStyle');

	$section->addTextBreak(2);

	// Add table
	$table = $section->addTable();

	for($r = 1; $r <= 10; $r++) { // Loop through rows
		// Add row
		$table->addRow();
	
		for($c = 1; $c <= 5; $c++) { // Loop through cells
			// Add Cell
			$table->addCell(1000)->addText("Row $r, Cell $c");
		}
	}

	$filename = "PEW-Session.docx";

	header( "Content-Type:   application/ms-word" );// evtl noch bessere / richtigere header für word suchen
	header( 'Content-Disposition: attachment; filename='.$filename );



	// Save File
	$objWriter = PHPWord_IOFactory::createWriter($PHPWord, 'Word2007');
	$objWriter->save("php://output"); // damit wird es nicht gespeichert

}


?>
