<!DOCTYPE HTML>
<html lang="de">
<head>
	<meta charset="utf-8"/>
	<title>Patienteneinwilligungswizard</title>
	<link rel="stylesheet" type="text/css" href="src/tmf.css">
	<script type="text/javascript" src="src/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="src/tmf.js"></script>
</head>
<body>

	<div id="main" >
		
	
		<div>.
			<img id="tmf-logo" src="src/tmf-logo_klein.png">
			<h1 id="headline">Patienteneinwilligungswiki</h1>
		</div>
	 	
	 	<script type="text/javascript">
		// hier wird die hochgeladene datei von php nach js gereicht. sonderzeichen werden so gut es geht abgefangen.
		// Der Rest sollte dann in js abgefangen werden.
	 	var loadedSession = <?php if (!empty($_FILES)) {
	 		echo json_encode(file_get_contents($_FILES["session"]['tmp_name']), JSON_HEX_QUOT|JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS);
	 	} else {
	 		echo "";
	 	}
	 	?>;
		</script>
		
		<!-- Hier wird die Navi per tmf.js reingeladen -->
		<ul class="navigation-list clearfix"></ul>

		<div id="tmfcontent" class="clearfix">
			<div id="wikicontainer">
			</div>
		</div>
	</div>
	

	<!-- Hier wird die Übersichtsseite reingeladen um daraus die Navi zu bauen -->
	<div id=wikisource class="hidden-source"></div>

	
		
	

	<div id="actionbar">
		<div id="textfeld">
			<textarea ></textarea>
		</div>
		<ul class="actionbar-list">
			<li class="actionbar-list-item ">
				<a href="#"  id="save" class="floatingbutton">save</a>
			</li>
			<li class="actionbar-list-item " >
				<form action="export.php" method="post" id="export-form" enctype="multipart/form-data">
					<a id="word-export" href="#" class="floatingbutton">export</a>
					<input id="inputSession" class="hidden-source" type="text" name="inputSession" value="">
			</li>
			<li class="actionbar-list-item " >
			
				<a href="#"  id="favorite" class="floatingbutton">fav</a>
			</li>
			<li class="actionbar-list-item " >
			
				<a href="#"  id="close-session" class="floatingbutton">close</a>
			</li>
		</ul>
	</div>

</body>
</html>