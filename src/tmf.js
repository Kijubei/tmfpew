$(document).ready(function () {
	
	function buildMenu() {

		//Übersichtsliste in seite laden
		$("#hidden-source").load("http://localhost/HTMLtransfer/wikiseiten/%C3%9Cbersicht%20%E2%80%93%20pew%20TMF.htm #mw-content-text", function() {
			var h3Html = new Array;
			var pHtml = new Array;
			// Hänge für jedes Item ausser dem ersten ein li an die navi liste
			$("#mw-content-text").children().each(function(i, ele){
				if (i == 0) {
					
				} else {
					// unterscheidung
					if (this.tagName == "P") {
						// ein neues li an die navi hängen, das die klasse item-sub hat und den inhalt von der quelle nimmt
						$(".navigation-list").append($("<li></li>").addClass('navigation-list-item-sub').append($(this).html()) );
						pHtml[i-1] = $(this).html();
						
					} else if (this.tagName == "H3") {
						// ein neues li an die navi hängen, das die klasse item hat und den inhalt von der quelle nimmt (nur mw-headline)
						$(".navigation-list").append($("<li></li>").addClass('navigation-list-item').append($(".mw-headline",$(this)).html()) );
						h3Html[i-1] = $(this).html();
					}
				}
				i++;
			});

			//$(".navigation-list li").addClass("navigation-list-item"); // css an li

			// für jedes navi li den richtigen link hinzufügen
			/*$(".navigation-list-item").each( function(i,ele ){
				$(ele).append(pHtml[i]);
			});*/

			$(".navigation-list-item").addClass("navigation-link floatingbutton"); // css an das neue li
			$(".navigation-list-item-sub a").addClass("navigation-link floatingbutton"); // css an das neue li
		});
		
	}




	window.onerror = function(msg, url, linenumber) {
	    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
	    return true;
	}

	buildMenu();


	//Sachen von der jeweiligen Wiki Seite in  div laden
	$(".navigation-link").click(function() {
		var url = $(this).attr("href");
		//alert(url);
		$("#wikicontainer").load(url + " #content");
		//$(this).load(url + " .firstHeading");
		return false;
	});

});