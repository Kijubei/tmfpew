$(document).ready(function () {

	// um errors auszugeben
	window.onerror = function(msg, url, linenumber) {
	    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
	    return true;
	}

	// bekommt die Url aus dem Storage von dem new button (siehe unten). Wichtig wenn es unterschiedliche Übersichtsseiten gibt.
	var wikiUrl = sessionStorage.wikiUrl;
	// für development:
	wikiUrl = "http://localhost/tmfpew/wikiseiten/%C3%9Cbersicht%20%E2%80%93%20pew%20TMF.htm";
	
	// Speichert die aktuelle itemID
	var currentItemId;

	// Speichert welche Seiten favorisiert sind und was in dem Textfeldern steht
	var saveSession = {};

	// legt fest ob es sich um eine neue Session handelt oder nicht.
	var neu = true; 

	initializeSession();
	
	buildMenu(wikiUrl);

	////// BUTTONS

	// favorite-button
	$("#favorite").click(function() {
		favorItem(currentItemId);
		return false; //damit keine normale link funktionalität unternommen wird
	});

	// save-button: erzeugt eine JSON Datei mit texten im textfeld und welche items faviorisiert wurden
	$("#save").click(function() {
		saveText(); // erstmal jetztigen text speichern
		//speichert saveSession in JSON form und hängt noch ein prefix dran die für den download wichtig sind
		var saved = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveSession));
		$("#save").attr("href", "data:" + saved); // ändert die href des save buttons in den tatsächlichen inhalt den wir laden wollen (funzt echt)
		$("#save").attr("download", "session.json"); // legt fest wie die datei heißen soll
	});

	// Der neu button schreibt einfach die übersichtsURL in die Storage Datei
	// Würde man eine andere Übersicht für die Items nutzen wollen, muss nur der link geändert werden 
	$("#neu").click(function() {
		sessionStorage.wikiUrl = "https://vf-mi.virt.uni-oldenburg.de/mediawiki/%C3%9Cbersicht";
	});

	// Export von Word Datei von Allen Textfeldern
	$('#word-export').click(function() {
		$.ajax({
		   url: 'export.php',
		   type: "post",
		   data: saveSession,
		   success: function (file) {//response is value returned from php (for your example it's "bye bye"
				//alert(file);
				$("#word-export").attr("href", "data:text/plain, test123"); // ändert die href des save buttons in den tatsächlichen inhalt den wir laden wollen (funzt echt)
				
		   }
		});
		$("#word-export").attr("download", "Beispiel.docx"); // legt fest wie die datei heißen soll
	});

	//// FUNKTIONEN

	// Es wird zum einen saveSession gefüllt und zum anderen die wikiUrl angepasst
	function initializeSession() {
		if (typeof loadedSession !== 'undefined') { // wenn loadedSession in view.php definiert wurde
			try{ 
				loadedSession = JSON.parse(loadedSession); // datei nach JSON überführen (bzw es versuchen)
				restoreSession(loadedSession);
				neu = false; // keine neue Session
				wikiURL = loadedSession["url"]; // die url auf die geladene ändern
			} catch (e) { //error
				alert("Leider ist etwas mit ihrer Datei nicht in ordnung. Es wird stattdessen eine neue Session gestartet. Fehlerbeschreibung: " + e.message);
				console.log(e.message);
			}
		}
	}

	// baut das Menu abhängig von der mitgegebenen wiki übersichtsseiten url
	// WICHTIG: Weil viele klassen und ID's erst nach der Menuerstellung existieren, müssen viele funktionen hier rein,
	// um sicherzustellen, dass diese nach dem load passieren
	function buildMenu(url) {

		//Übersichtsliste in seite laden (erst danach alles ausführen)
		$("#hidden-source").load(url+ " #mw-content-text", function() {
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

			// baue die Variable um die Session zu speichern (nur wenn neu)
			if (neu) {
				// Speichern welches Menu genutzt wird
				saveSession["url"] = url;

				$(".navigation-list-item").each(function(index, value) {
					saveSession[$(value).attr("id")] = [false, ""]; // erstelle object mit allen ID's das jeweils speichern kann ob fav / text
				});
			} else { //sonst: alle favoriten einfügen (gehört eigentlich zu restoreSession)
				Object.keys(saveSession).forEach(function(key,index) {
						setFavorItem(key, saveSession[key][0]);
				});

			}

			//textfeld leeren weil es bei F5 sonst noch gefüllt ist
			$("#textfeld textarea").val("");
			
			//Sachen von der jeweiligen Wiki Seite in  div laden
			$(".navigation-link").click(function() {
				var itemUrl = $(this).attr("href"); // hole url von dem geklickten Item
				
				saveText(); // textfeld speichern
				
				$("#wikicontainer").load(itemUrl + " #content"); //wiki reinladen
				currentItemId = $(this).parent().attr("id"); //momentane itemID merken
				$("#textfeld textarea").val(saveSession[currentItemId][1]); // textfeld laden
				return false; //damit keine normale link funktionalität unternommen wird
			});

			// erstes Item Laden
			$("#wikicontainer").load($(".navigation-link").attr("href") + " #content");

		});

	}

	// funktion bekommt eine item ID, sucht danach und gibt deren kind (also den link, bzw den button) einen orangen rand / oder macht ihn weg
	function favorItem(itemId) {
			if (saveSession[itemId][0] == false) { // nicht fav
				$("#"+itemId).children().css("border-color", "orange"); // mach rand orange
				saveSession[itemId][0] = true;
			} else {
				$("#"+itemId).children().css("border-color", "grey"); // mach wieder grau orange
				saveSession[itemId][0] = false;
			}
	        
	}

	// funktion bekommt eine item ID und ein bool und setzt es dann je nach bool auf fav (true) oder nicht fav (false)
	function setFavorItem(itemId, bool) {
			if (bool) { // fav
				$("#"+itemId).children().css("border-color", "orange"); // mach rand orange
				saveSession[itemId][0] = true;
			} else {
				$("#"+itemId).children().css("border-color", "grey"); // mach wieder grau orange
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

	// Mit der funktion wird eine Session wiederhergestellt. Dies geschieht durch das füllen der saveSession Variable.
	function restoreSession(loadedSession) {

		// krasse neue weise um objecte zu iterieren
		Object.keys(loadedSession).forEach(function(key,index) {
		    // key: the name of the object key
		    // index: the ordinal position of the key within the object 
		    //console.log("saveSession: " + saveSession[key] + " | key: " + key + " | index: " + index + " | loadedSession[key]: " + loadedSession[key]);

		    // saveSession füllen
		    if (key == "url") {
		    	saveSession["url"] = loadedSession["url"];
		    } else {
		    	saveSession[key] = loadedSession[key];
		    	/*if (loadedSession[key][0] == true ) { // passiert jetzt an anderer stelle (weil zu dem Zeitpunkt das menu noch nicht da ist)
		    		favorItem(key);
		    	}*/ 
		    }
		    console.log("saveSession[0]: " + saveSession[key][0] + " | saveSession[1]: " + saveSession[key][1] + " | loadedSession[key]: " + loadedSession[key]);

		});

	}

});