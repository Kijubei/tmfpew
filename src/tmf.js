$(document).ready(function () {

	// um errors auszugeben
	window.onerror = function(msg, url, linenumber) {
	    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
	    return true;
	}

	//Übersichtsliste in seite laden (erst danach alles ausführen)
	$("#hidden-source").load("http://localhost/HTMLtransfer/wikiseiten/%C3%9Cbersicht%20%E2%80%93%20pew%20TMF.htm #mw-content-text", function() {

		// das menu wird gebaut
		buildMenu();


		//Sachen von der jeweiligen Wiki Seite in  div laden
		// BROKEN ?
		$(".navigation-link").click(function() {
			var url = $(this).attr("href");
			//alert(url);
			$("#wikicontainer").load(url + " #content");
			//$(this).load(url + " .firstHeading");
			return false;
		});


		// Die Überschriften Klappen weitere Items auf
		$('.navigation-sublist').click(function() {
			$('.navigation-item').slideDown();
		});

		function buildMenu() {

			var h3Html = new Array;
			var pHtml = new Array;
			// Hänge für jedes Item ausser dem ersten ein li an die navi liste
			$("#mw-content-text").children().each(function(i, ele){
				if (i == 0) {
					
				} else {
					// unterscheidung
					if (this.tagName == "H3") {
						
						// ein neues ul an die navi hängen, das die klasse sublist hat und den inhalt von der quelle nimmt (nur mw-headline)
						$(".navigation-list").append($("<ul></ul>").addClass('navigation-sublist').append($(".mw-headline",$(this)).html()) );
						h3Html[i-1] = $(this).html();
						
					} else if (this.tagName == "P") {
						// ein neues li an die navi hängen, das die klasse item hat und den inhalt von der quelle nimmt
						$(".navigation-sublist:last").append($("<li></li>").addClass('navigation-list-item').append($(this).html()) );
						pHtml[i-1] = $(this).html();
					}
				}
			});

			$(".navigation-sublist").addClass("navigation-link floatingbutton"); // css an das neue li
			$(".navigation-list-item-sub a").addClass("navigation-link floatingbutton"); // css an das neue li

		}

	});

});