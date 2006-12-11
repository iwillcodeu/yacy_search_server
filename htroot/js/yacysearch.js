function AllTextSnippets() {
    var query = document.getElementsByName("former")[0].value;
    
	var span = document.getElementsByTagName("span");
	for(var x=0;x<span.length;x++) {
		if (span[x].className == 'snippetLoading') {
				var url = document.getElementById("url" + span[x].id);
				requestTextSnippet(url,query);
		}
	}
}

function AllAudioSnippets() {
    var query = document.getElementsByName("former")[0].value;
    
	var span = document.getElementsByTagName("span");
	for(var x=0;x<span.length;x++) {
		if (span[x].className == 'snippetLoading') {
				var url = document.getElementById("url" + span[x].id);
				requestAudioSnippet(url,query);
		}
	}
}

function requestTextSnippet(url, query){
	var request=createRequestObject();
	request.open('get', '/xml/snippet.xml?url=' + escape(url) + '&remove=true&media=text&search=' + escape(query),true);
	request.onreadystatechange = function () {handleTextState(request)};
	request.send(null);
}

function requestAudioSnippet(url, query){
	var request=createRequestObject();
	request.open('get', '/xml/snippet.xml?url=' + escape(url) + '&remove=true&media=audio&search=' + escape(query),true);
	request.onreadystatechange = function () {handleAudioState(request)};
	request.send(null);
}

function handleTextState(req) {
    if(req.readyState != 4){
		return;
	}
	
	var response = req.responseXML;
	
	var snippetText = response.getElementsByTagName("text")[0].firstChild.data;
	var urlHash = response.getElementsByTagName("urlHash")[0].firstChild.data;
	var status = response.getElementsByTagName("status")[0].firstChild.data;
	var links = response.getElementsByTagName("links")[0].firstChild.data;
	
	var span = document.getElementById(urlHash)
	removeAllChildren(span);
	//span.removeChild(span.firstChild);
	
	if (status < 11) {
		span.className = "snippetLoaded";
		//span.setAttribute("class", "snippetLoaded");
	} else {
		span.className = "snippetError";
		//span.setAttribute("class", "snippetError");
	}

	// replace "<b>" text by <strong> node
	var pos1=snippetText.indexOf("<b>");
	var pos2=snippetText.indexOf("</b>");
	while (pos1 >= 0 && pos2 > pos1) {
		leftString = document.createTextNode(snippetText.substring(0, pos1)); //other text
		if (leftString != "") span.appendChild(leftString);

		//add the bold text
		strongNode=document.createElement("strong");
		middleString=document.createTextNode(snippetText.substring(pos1 + 3, pos2));
		strongNode.appendChild(middleString);
		span.appendChild(strongNode);
		
		// cut out left and middle and go on with remaining text
		snippetText=snippetText.substring(pos2 + 4);
		pos1=snippetText.indexOf("<b>");
		pos2=snippetText.indexOf("</b>");
	}
	
	if (links > 0) {
		for (i = 0; i < links; i++) {
			var type = response.getElementsByTagName("type")[i].firstChild.data;
			var href = response.getElementsByTagName("href")[i].firstChild.data;
			var name = response.getElementsByTagName("name")[i].firstChild.data;
			var attr = response.getElementsByTagName("attr")[i].firstChild.data;
			span.appendChild(document.createElement("br"));
			var anchor = document.createElement("a");
			var hrefattr = document.createAttribute("href");
			hrefattr.nodeValue = href;
			anchor.setAttributeNode(hrefattr);
			anchor.appendChild(document.createTextNode(name));
			span.appendChild(anchor);
		}
	}
	
	// add remaining string
	if (snippetText != "") {
		span.appendChild(document.createTextNode(snippetText));
	}
}

function handleAudioState(req) {
    if(req.readyState != 4){
		return;
	}
	
	var response = req.responseXML;
	var links = response.getElementsByTagName("links")[0].firstChild.data;

	var snippetText = "";
	if (links > 0) {
		span.className = "snippetLoaded";
		for (i = 0; i < links; i++) {
			var type = response.getElementsByTagName("type")[i].firstChild.data;
			var href = response.getElementsByTagName("href")[i].firstChild.data;
			var name = response.getElementsByTagName("name")[i].firstChild.data;
			var attr = response.getElementsByTagName("attr")[i].firstChild.data;
		}
	} else {
		span.className = "snippetError";
	}
	
	span.appendChild(document.createTextNode(snippetText));
}

function addHover() {
  if (document.all&&document.getElementById) {
    var divs = document.getElementsByTagName("div");
    for (i=0; i<divs.length; i++) {
      var node = divs[i];
      if (node.className=="searchresults") {
        node.onmouseover=function() {
          this.className+=" hover";
        }
        node.onmouseout=function() {
          this.className=this.className.replace(" hover", "");
        }
      }
    }
  }
}