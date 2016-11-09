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

	var currentId;

	buildMenu(wikiUrl);

	// baut das Menu abhängig von der mitgegebenen wiki übersichtsseiten url
	function buildMenu(url) {

		//Übersichtsliste in seite laden (erst danach alles ausführen)
		$("#hidden-source").load(url+ " #mw-content-text", function() {

			// das menu wird gebaut
			// Hänge für jedes Item ausser dem ersten ein li an die navi liste
			$("#mw-content-text").children().each(function(i, ele){
				if (i == 0) {
					
				} else {
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
							$("<li></li>").addClass('navigation-list-item').attr("id", "list-Item"+i).append( // ein li anhängen mit der klasse list-item und einer ID
								$(this).html())  // mit dem inhalt aus der quelle
						);
					}
				}
			});

			//$(".navigation-sublist").addClass("floatingbutton"); // css an das neue li
			$(".navigation-list-item a").addClass("navigation-link floatingbutton"); // css an das neue li

			

			// Die Überschriften Klappen weitere Items auf
			$('.navigation-sublist').click(function() {
				//$('.navigation-list-item').slideToggle("slow");
				$(this).children(".navigation-list-item").slideToggle("slow");
			});

			//Sachen von der jeweiligen Wiki Seite in  div laden
			$(".navigation-link").click(function() {
				var url = $(this).attr("href");
				$("#wikicontainer").load(url + " #content");
				currentId = $(this).parent().attr("id");
				return false;
			});

		});

	}

	// favorite-button
	$("#favorite").click(function() {
		favorItem(currentId);
	});

	// funktion bekommt eine item ID, sucht danach und gibt deren kind (also den link, bzw den button) einen orangen rand
	function favorItem(itemId) {
	        $("#"+itemId).children().css("border-color", "orange");
	}


});