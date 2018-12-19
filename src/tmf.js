$(document).ready(function () {

	// um errors auszugeben
	window.onerror = function (msg, url, linenumber) {
		alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
		return true;
	}

	// bekommt die Url aus dem Storage von dem new button (siehe unten). Wichtig wenn es unterschiedliche Übersichtsseiten gibt.
	var wikiUrl = sessionStorage.wikiUrl;
	// für development (lokale pseudo wikiseiten):
	wikiUrl = "http://localhost/tmfpew/wikiseiten/%C3%9Cbersicht%20%E2%80%93%20pew%20TMF.htm";

	// Speichert die aktuelle itemID
	var currentItemId;

	// Speichert welche Seiten favorisiert sind und was in dem Textfeldern steht
	var saveSession = {};

	// legt fest ob es sich um eine neue Session handelt oder nicht.
	var neu = true;

	initializeSession();

	buildMenu(wikiUrl);

	// tour initialisieren
	var tour = initializeTour();
	
	////// BUTTONS

	// Tour-button, um die tour zu starten
	$("#tour a").click(function () {
		//alert("erreicht");
		tour.init();
		tour.restart();
		//return false; //damit keine normale link funktionalität unternommen wird
	});

	// save-button: erzeugt eine JSON Datei mit texten im textfeld und welche items faviorisiert wurden
	$("#save").click(function () {
		saveText(); // erstmal jetztigen text speichern
		//speichert saveSession in JSON form und hängt noch ein prefix dran die für den download wichtig sind
		var saved = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveSession));
		$("#save").attr("href", "data:" + saved); // ändert die href des save buttons in den tatsächlichen inhalt den wir laden wollen (funzt echt)
		$("#save").attr("download", "session.json"); // legt fest wie die datei heißen soll
	});

	// Der neu button schreibt einfach die übersichtsURL in die Storage Datei
	// Würde man eine andere Übersicht für die Items nutzen wollen, muss nur der link geändert werden 
	$("#neu").click(function () {
		sessionStorage.wikiUrl = "https://vf-mi.virt.uni-oldenburg.de/mediawiki/%C3%9Cbersicht";
	});

	// Export von Word Datei von Allen Textfeldern
	$('#word-export').click(function () {
		$("#inputSession").attr("value", JSON.stringify(saveSession)); // packen die session als string als value vom input feld
		$("#export-form").submit(); // und submitten das ganze - easy 
	});

	// Beendet Session und geht zur index zurück
	$('#close').click(function () {
		window.location.href = "index.html";
	});




	//// FUNKTIONEN

	// Es wird zum einen saveSession gefüllt und zum anderen die wikiUrl angepasst
	function initializeSession() {
		if (typeof loadedSession !== 'undefined') { // wenn loadedSession in view.php definiert wurde
			try {
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
		$("#wikisource").load(url + " #mw-content-text", function () {
			// das menu wird gebaut
			// Hänge für jedes Item ausser dem ersten ein li an die navi liste
			var count = 0;
			$("#mw-content-text").children().each(function (i, ele) {
				// unterscheidung
				if (this.tagName == "H3") {

					// ein neues ul an die navi hängen, das die klasse sublist hat und den inhalt (in einem div) von der quelle nimmt (nur mw-headline)
					$("#navigation-list").append( //hänge an die navi an ...
						$("<ul></ul>").addClass('navigation-sublist').append( // eine ul mit der klasse sublist
							$("<div></div>").addClass("floatingbutton").append( // hänge daran ein div der klasse floatingbutton
								$(".mw-headline", $(this)).html()) // mit dem inhalt aus der quelle mw-headline
						)
					);

				} else if (this.tagName == "P") {
					// ein neues li an die neuste sublist der navi hängen, das die klasse item hat und den inhalt von der quelle nimmt
					$(".navigation-sublist:last").append( // an die letzte sublist
						$("<li></li>").addClass('navigation-list-item').attr("id", "list-item" + count).append( // ein li anhängen mit der klasse list-item und einer ID
							$(this).html())  // mit dem inhalt aus der quelle
					);
					count++;
				}
			});

			//$(".navigation-sublist").addClass("floatingbutton"); // css an das neue li
			$(".navigation-list-item a").addClass("navigation-link floatingbutton"); // css an das neue li

			// Die Überschriften Klappen weitere Items auf
			$('.navigation-sublist').click(function () {
				//$('.navigation-list-item').slideToggle("slow");
				$(this).children(".navigation-list-item").slideToggle("slow");
			});

			// Falls es sich um eine neue Sitzung handelt
			if (neu) {
				// Speichern welches Menu genutzt wird
				saveSession["url"] = url;

				// baue die Variable um die Session zu speichern (nur wenn neu)
				$(".navigation-list-item").each(function (index, value) {
					saveSession[$(value).attr("id")] = [false, "", $(value).children("a").text()]; // erstelle object mit allen ID's das jeweils speichern kann ob current / text
				});

				// lege das erste item als current fest
				currentItemId = $(".navigation-list-item").attr("id");

			} else { //sonst: alle favoriten einfügen (gehört eigentlich zu restoreSession)
				Object.keys(saveSession).forEach(function (key, index) {
					setMarkCurrentItem(key, saveSession[key][0]);
					markNotedItem(key);
					if (saveSession[key][0]) {
						currentItemId = key;
					}
					// console.log("currentItemId = " + currentItemId);
				});

			}


			//Sachen von der jeweiligen Wiki Seite in den wikicontainer laden
			/*$(".navigation-link").click(function () {
				var itemUrl = $(this).attr("href"); // hole url von dem geklickten Item

				saveText(); // textfeld speichern

 				//wiki reinladen und buttons innerhalb des wikis erstellen
				$("#wikicontainer").load(itemUrl + " #content", function () {
					generateQuickNoteButtons();
				});

				setMarkCurrentItem(currentItemId,false); // altes unfavoren
				currentItemId = $(this).parent().attr("id"); //momentane itemID merken
				markCurrentItem(currentItemId); // neues favoren
				$("#textfeld textarea").val(saveSession[currentItemId][1]); // textfeld laden
				return false; //damit keine normale link funktionalität unternommen wird
			});*/
			$(".navigation-link").click(function() {
				loadItem(this);
				return false; //damit keine normale link funktionalität unternommen wird
			});



			// wenn eine neue Session, definiere das erste Item als current und favor es
			/*	if (neu) {
				currentItemId = $(".navigation-list-item").attr("id");
				markCurrentItem(currentItemId);
			}*/

			// erstes Item Laden 
			loadItem("#"+currentItemId +" .navigation-link");
			//$("#wikicontainer").load($("#" + currentItemId + " .navigation-link").attr("href") + " #content");
			// Schnellnotizknöpfe erstellen
			//generateQuickNoteButtons();
			// textfeld füllen
			//$("#textfeld textarea").val(saveSession[currentItemId][1]);


		});

	}

	// funktion bekommt eine item ID, sucht danach und gibt deren kind (also den link, bzw den button) einen orangen rand / oder macht ihn weg
	function markCurrentItem(itemId) {
		if (saveSession[itemId][0] == false) { // nicht fav
			$("#" + itemId).children().css("border-color", "orange"); // mach rand orange
			saveSession[itemId][0] = true;
		} else {
			$("#" + itemId).children().css("border-color", "grey"); // mach wieder grau orange
			saveSession[itemId][0] = false;
		}

	}

	// funktion bekommt eine item ID und ein bool und setzt es dann je nach bool auf fav (true) oder nicht fav (false)
	function setMarkCurrentItem(itemId, bool) {
		if (bool) { // fav
			$("#" + itemId).children().css("border-color", "orange"); // mach rand orange
			saveSession[itemId][0] = true;
		} else {
			$("#" + itemId).children().css("border-color", "grey"); // mach wieder grau orange
			saveSession[itemId][0] = false;
		}

	}

	function saveText() {
		//wenn keine itemID gemerkt ignore
		if (currentItemId != null) {
			//aktuelles textfeld speichern
			saveSession[currentItemId][1] = $("#textfeld textarea").val();
			//item makieren, dass etwas notiert wurde
			markNotedItem(currentItemId);
		}
		//console.log(saveSession);
	}

	// funktion um ein item zu markieren, wenn es text enthält
	// auskommentiert, weil noch nicht fertig
	function markNotedItem(itemId) {
		// Wenn text da ist, aber kein Bild
		if (saveSession[itemId][1] != "" && ($("#" + itemId).hasClass('pic') == false)) {
			$("#" + itemId).addClass('pic');
		}
		// Wenn text nicht da und Bild schon
		if (saveSession[itemId][1] == "" && ($("#" + itemId).hasClass('pic'))) {
			$("#" + itemId).removeClass('pic');
		}
	}

	function loadItem (navLink) {
		var itemUrl = $(navLink).attr("href"); // hole url von dem geklickten Item

		saveText(); // textfeld speichern

		 //wiki reinladen und buttons innerhalb des wikis erstellen
		$("#wikicontainer").load(itemUrl + " #content", function () {
			generateQuickNoteButtons();
		});

		setMarkCurrentItem(currentItemId,false); // altes unfavoren
		currentItemId = $(navLink).parent().attr("id"); //momentane itemID merken
		markCurrentItem(currentItemId); // neues favoren
		$("#textfeld textarea").val(saveSession[currentItemId][1]); // textfeld laden
	}

	// Eine Funktion mit der die "runterkopier" knöpfe in dem jeweiligen wiki dokument erstellt werden.
	function generateQuickNoteButtons() {
		// es wird an jeden paragraph der ein "big" element enthält (und damit hoffentlich eine überschrift ist) ein quicknote angehängt
		$(".mw-content-ltr p b").append(
			$('<a>', { class: "quicknote", href: "#", title: "Abschnitt runter Kopieren" }).append(
				$('<img>', { src: "src/pics/takenote-small.png" })
			)
		);
		// dem ersten wird außerdem noch eine ID gegeben für die guide tour
		$(".quicknote").first().attr('id','tourQuicknote');
		// Klickfunktion kopiert die entsprechende Textzeile in das Textfeld
		$(".quicknote").click(function () {
			//this ist auf dem link (<a>), daher holen wir uns erst das entsprechende <p> was ein sibling zu den relevanten <p>'s ist
			var topSibling = $(this).parent().parent();
			var textToAppend = "";
			while (true) {
				// wenn das nächste sibling ein p ist, ersetzte topSibling damit
				if (topSibling.next("p")) {
					topSibling = topSibling.next();
				} else { //ansonsten aufhören
					break; 
				}
				//wenn topsibling keine kinder hat, nehmen wir den text
				if (topSibling.children().length == 0) {
					textToAppend += topSibling.html();
				} else { //ansonsten aufhören
					break;
				}
			}
			$("#textfeld textarea").val($("#textfeld textarea").val() + textToAppend);
			return false;
		});
	}

	// Mit der funktion wird eine Session wiederhergestellt. Dies geschieht durch das füllen der saveSession Variable.
	function restoreSession(loadedSession) {

		// krasse neue weise um objecte zu iterieren
		Object.keys(loadedSession).forEach(function (key, index) {
			// key: the name of the object key
			// index: the ordinal position of the key within the object 
			//console.log("saveSession: " + saveSession[key] + " | key: " + key + " | index: " + index + " | loadedSession[key]: " + loadedSession[key]);

			// saveSession füllen
			if (key == "url") {
				saveSession["url"] = loadedSession["url"];
			} else {
				saveSession[key] = loadedSession[key];
		    	/*if (loadedSession[key][0] == true ) { // passiert jetzt an anderer stelle (weil zu dem Zeitpunkt das menu noch nicht da ist)
		    		markCurrentItem(key);
		    	}*/
			}
			//console.log("saveSession[0]: " + saveSession[key][0] + " | saveSession[1]: " + saveSession[key][1] + " | loadedSession[key]: " + loadedSession[key]);

		});

	}

	function initializeTour() {
		var tour = new Tour({
			name: 'wizzardtour2',
			steps: [
			{
				  element: "#navigation-list",
				  title: "Navigation",
				  content: "Dies ist Ihre Navigation, hier können Sie relevante Themen aussuchen.",
				  backdrop: true
			},
			{
				  element: "#wikicontainer",
				  title: "Informationsseite",
				  content: "Hier können Sie alles relevante zum Thema lesen.",
				  placement: "top",
				  backdrop: true
			},
			{
				element: "#textfeld textarea",
				title: "Notizblock",
				content: "Diesen Bereich können Sie als Notzblock benutzten. Er wird für jedes Thema separat gespeichert und angezeigt.",
				backdrop: true
			},
			{
				// hier werden leider alle anvisiert, außerdem sind die am anfang gar nicht da !
				element: "#tourQuicknote",
				title: "Schnellnotiz",
				content: "Wenn Sie diesen Abschnitt notieren wollen, können Sie ihn mit diesem Knopf direkt in ihren Notizblock übernehmen.",
				backdrop: true
			},
			{
				element: "#save",
				title: "Sitzung Speichern",
				content: "Wenn Sie ihren Fortschritt Speichern wollen, laden sie ihre Sitzung hier als Datei herunter. Später laden Sie die Datei bei der Startseite wieder rein.",
				placement: "top",
				backdrop: true
			},
			{
				element: "#export-form",
				title: "Sitzung Exportieren",
				content: "Exportiert Ihre aktuelle Sitzung in eine Word-Datei.",
				placement: "top",
				backdrop: true
			},
			{
				element: "#close",
				title: "Sitzung Schließen",
				content: "Schließt die Sitzung (ohne zu Speichern) und kehrt zur Startseite zurück.",
				placement: "top",
				backdrop: true
			}
		]});
		return tour;
	}

});