<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">

<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/phpoffice/phpword/src/PhpWord/PhpWord.php';

header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document'); // header für docx
header( 'Content-Disposition: attachment; filename=PEW-Session.docx');

// nimmt die übermittelte Session variable und überführt sie von JSON in ein PHP Objekt
$session = json_decode($_POST["inputSession"], true);

createDocument($session);


function createDocument($session) {

	// New Word Document
	$PHPWord = new \PhpOffice\PhpWord\PhpWord();

	//$PHPWord->getCompatibility()->setOoxmlVersion(14); // braucht neuere Version

	// New portrait section
	$section = $PHPWord->createSection();

	// Add title styles
	$PHPWord->addTitleStyle(1, array('size'=>20, 'color'=>'333333', 'bold'=>true));
	$PHPWord->addTitleStyle(2, array('size'=>16, 'color'=>'666666'));

	// geht die Session durch und schreibt alles in ein Word dokument außer der url
	foreach ($session as $key => $value) {
		if ($key == "url") {
			continue;
		} else {
			$section->addTitle("$value[2]", 2);

			$section->addText("$value[1]");
		}
	}

	$headerX = $session["list-item1"][2];
	$textX = $session["list-item1"][1];

	/*
	// Debug
	$session = var_export($session, true);


	$section->addText("theSession: $session");
	*/
	
	/*
	/////// ALTES ZEUG ZUR REFERENZ

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
		
	$section->addTextBreak(2);

	$text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

	// Define the TOC font style
	$fontStyle = array('spaceAfter'=>60, 'size'=>12);

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
	*/

	// Save File
	$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($PHPWord, 'Word2007');
	$objWriter->save("php://output"); // damit wird es nicht gespeichert

}

exit;


?>
