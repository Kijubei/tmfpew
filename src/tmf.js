$(document).ready(function () {

	// um errors auszugeben
	window.onerror = function(msg, url, linenumber) {
	    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
	    return true;
	}

	// für development:
	//var wikiUrl = "http://localhost/tmfpew/wikiseiten/%C3%9Cbersicht%20%E2%80%93%20pew%20TMF.htm";
	//für live:
	var wikiUrl = "https://vf-mi.virt.uni-oldenburg.de/mediawiki/%C3%9Cbersicht";

	// Speichert die aktuelle itemID
	var currentItemId;

	// Speichert welche Seiten favorisiert sind und was in dem Textfeldern steht
	var saveSession = {};

	buildMenu(wikiUrl);

	// baut das Menu abhängig von der mitgegebenen wiki übersichtsseiten url
	// WICHTIG: Weil viele klassen und ID's erst nach der Menuerstellung existieren, müssen viele funktionen hier rein,
	// um sicherzustellen, dass diese nach dem load passieren
	function buildMenu(url) {

		//Übersichtsliste in seite laden (erst danach alles ausführen)
		$("#hidden-source").load(url+ " #mw-content-text", function() {
			// Speichern welches Menu genutzt wird
			saveSession["url"] = url;
			// das menu wird gebaut
			// Hänge für jedes Item ausser dem ersten ein li an die navi liste
			var count = 0;
			$("#mw-content-text").children().each(function(i, ele){
				// unterscheidung
				if (this.tagName == "H3") {
					
					// ein neues ul an die navi hängen, das die klasse sublist hat und den inhalt (in einem div) von der quelle nimmt (nur mw-headline)
					$(".navigation-list").append( //hänge an die navi an ...
						$("<ul></ul>").addClass('navigation-sublist').append( // eine ul mit der klasse sublist
							$("<div></div>").addClass("floatingbutton").append( // hänge daran ein div der klasse floatingbutton
								$(".mw-headline",$(this)).html()) // mit dem inhalt aus der quelle mw-headline
						)
					);
					
				} else if (this.tagName == "P") {
					// ein neues li an die neuste sublist der navi hängen, das die klasse item hat und den inhalt von der quelle nimmt
					$(".navigation-sublist:last").append( // an die letzte sublist
						$("<li></li>").addClass('navigation-list-item').attr("id", "list-item"+count).append( // ein li anhängen mit der klasse list-item und einer ID
							$(this).html())  // mit dem inhalt aus der quelle
					);
					count++;
				}
			});

			//$(".navigation-sublist").addClass("floatingbutton"); // css an das neue li
			$(".navigation-list-item a").addClass("navigation-link floatingbutton"); // css an das neue li
			
			// Die Überschriften Klappen weitere Items auf
			$('.navigation-sublist').click(function() {
				//$('.navigation-list-item').slideToggle("slow");
				$(this).children(".navigation-list-item").slideToggle("slow");
			});

			// baue die Variable um die Session zu speichern
			$(".navigation-list-item").each(function(index, value) {
				saveSession[$(value).attr("id")] = [false, ""]; // erstelle object mit allen ID's das jeweils speichern kann ob fav / text
			});


			//textfeld leeren weil es bei F5 sonst noch gefüllt ist
			$("#textfeld textarea").val("");
			
			//Sachen von der jeweiligen Wiki Seite in  div laden
			$(".navigation-link").click(function() {
				var itemUrl = $(this).attr("href"); // hole url von dem geklickten Item
				
				saveText(); // textfeld speichern
				
				$("#wikicontainer").load(itemUrl + " #content"); //wiki reinladen
				currentItemId = $(this).parent().attr("id"); //momentane itemID merken
				$("#textfeld textarea").val(saveSession[currentItemId][1]); // textfeld laden
				return false;
			});

		});

	}

	// favorite-button
	$("#favorite").click(function() {
		favorItem(currentItemId);
	});

	// save-button: erzeugt eine JSON Datei mit texten im textfeld und welche items faviorisiert wurden
	$("#save").click(function() {
		saveText(); // erstmal jetztigen text speichern
		//speichert saveSession in JSON form und hängt noch ein prefix dran die für den download wichtig sind
		var saved = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveSession));
		$("#save").attr("href", "data:" + saved); // ändert die href des save buttons in den tatsächlichen inhalt den wir laden wollen (funzt echt)
		$("#save").attr("download", "session.json"); // legt fest wie die datei heißen soll
	});

	// funktion bekommt eine item ID, sucht danach und gibt deren kind (also den link, bzw den button) einen orangen rand / oder macht ihn weg
	function favorItem(itemId) {
			if (saveSession[itemId][0] == false) { // nicht fav
				$("#"+itemId).children().css("border-color", "orange"); // mach rand orange
				saveSession[itemId][0] = true;
			} else {
				$("#"+itemId).children().css("border-color", "grey"); // mach rand orange
				saveSession[itemId][0] = false;
			}
	        
	}

	function saveText() {
		//wenn keine itemID gemerkt ignore
		if (currentItemId != null) {
			//aktuelles textfeld speichern
			saveSession[currentItemId][1] = $("#textfeld textarea").val();
		} 
	}


});