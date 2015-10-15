(function () {
	//"use strict";
	var chunk = 272144
	, file
	, output = document.querySelector('#output')
	, fileReader = new FileReader();

	var fileChosen = function(evnt) {
		file = evnt.target.files[0];
	};

	fileReader.onload = function(evnt) {
		var formData = new FormData();
		formData.append('name', file.name);
		formData.append('data', evnt.target.result);
		sendData(formData);
	};

	var startUpload = function() {
		var formData = new FormData();
		formData.append('name', file.name);
		formData.append('size', file.size);
		sendData(formData);
	};

	var sendChunk = function(offset) {
		console.log('sending chunk ', offset);

		var progressData = 1 - file.size / chunk / offset / 100;

		var place = offset * chunk; //The Next Blocks Starting Position
		var blob = new Blob([file], {"type" : file.type});
		var nFile = blob.slice(place, place + Math.min(chunk, (file.size-place)));
		fileReader.readAsBinaryString(nFile);
		console.log(progressData);
		progress(progressData);
	};

	var sendData = function(formData) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/upload', true);
		xhr.onload = function(e) {
			if (this.status == 200) {

				if(this.response.slice(0,5) === 'chunk') {
					var part = parseInt(this.response.slice(5), 10);
					sendChunk(part);
				} else {
					console.log(this.response);
				}

			}
		};
		xhr.send(formData);
	};

	// var place = data.offset * chunk; //The Next Blocks Starting Position
	// var blob = new Blob([file], {"type" : file.type});
	// var nFile = blob.slice(place, place + Math.min(chunk, (file.size-place)));
	// fileReader.readAsBinaryString(nFile);

	var progress = function(p) {
		var bar = document.querySelector('.bar');
		bar.style.width = p*100 + '%';
		bar.innerText =  p*100 + '%';
		if(p==1) {
			bar.parentElement.className = 'progress-bar progress-bar-success';
			bar.innerText = 'Done !';
		}
	};

	if(window.File && window.FileReader){
		document.querySelector('#submit').addEventListener('click', startUpload);
		document.querySelector('#file').addEventListener('change', fileChosen);
	} else {
		document.querySelector('#message').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
	}

}());
