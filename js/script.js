/**
 * script.js
 * 
 * Main Javascript file
 *
 * @author Johannes Braun <me@hannenz.de>
 * @package hannenz
 * @version 2014-02
 */
window.addEventListener('DOMContentLoaded', init, false);

function init() {

	console.log(navigator.userAgent);
	console.log(navigator.platform);
	console.log(navigator.appName);
	console.log(navigator.appVersion);

	var body = document.getElementsByTagName('body')[0];

	var trigger = document.getElementById('js-trigger');
	var container = document.getElementById('js-container');
	var navLinks = document.querySelectorAll('#js-navigation a');

	trigger.addEventListener('click', toggleNav, false);
	container.addEventListener('click', closeNav, false);
	for (var i = 0; i < navLinks.length; i++){
		navLinks[i].addEventListener('click', loadAjax, false);
	}

	function toggleNav(event) {
		event.stopPropagation();
		body.classList.toggle('nav-open');
		return false;
	}

	function closeNav(event){
		body.classList.remove('nav-open');
		return false;
	}

	function loadAjax(event) {

		event.preventDefault();

		var href = this.getAttribute('href');

		xhr = new XMLHttpRequest;
		xhr.responseType = 'document';
		xhr.open('GET', href, true);
		xhr.onload = function() {
			if (this.status >= 200 && this.status < 400){
				var content = document.getElementById('js-content');
				var response = this.responseXML;
				content.innerHTML = response.querySelector('#js-content').innerHTML;
				//slider();
			}
			else {
				console.log ('Error occured when trying to load the page at: ' + href);
			}
			closeNav();
		}
		xhr.send();
		return false;
	}


	if (body.classList.contains('works')){
		slider();
	}

	function slider() {
		var slider = document.getElementById('js-slider');
		var current = 0;
		var xOffset = 0;
		var n_slides = slider.children.length;

		// Wrap a viewport around the slider 
		var sliderParent = slider.parentNode;
		var position = 0;
		for (var i = 0; i < sliderParent.childNodes.length; i++){
			if (sliderParent.childNodes[i] == slider){
				position = i;
				break;
			}
		}
		var viewport = document.createElement('div');
		viewport.classList.add('viewport');
		viewport.appendChild(slider);
		sliderParent.insertBefore(viewport, sliderParent.childNodes[position]);

		// Adjust image's positioning and attach click handler
		for (var i = 0; i < slider.children.length; i++){
			var width = slider.children[i].offsetWidth;
			var height = slider.children[i].offsetHeight;
			var image = slider.children[i].querySelector('img');
			image.onload = function(){
				var w = this.naturalWidth;
				var h = this.naturalHeight;
				if (w > h){
					this.style.position = 'absolute';
					this.style.top = parseInt((height - this.offsetHeight) / 2) + 'px';
					this.style.left = 0;
				}
				else {
					this.style.height = '100%';
					this.style.width = 'auto';
					this.style.marginLeft = parseInt((width - this.offsetWidth) / 2) +'px';
				}
			}
			slider.style.cursor = 'pointer';
			slider.children[i].addEventListener('click', onSliderImageClicked, false);

		}
		function onSliderImageClicked(event){
			if (this.classList.contains('current')){
				this.querySelector('img').classList.toggle('zoom');
				//window.location = this.querySelector('img').getAttribute('src');
				return;
			}
			else {
				var old = slider.querySelector('.current');
				old.classList.remove('current');

				current = 0;
				for (current = 0; current < slider.children.length; current++){
					if (slider.children[current] == this){
						break;
					}
				}
				xOffset -= (this.offsetLeft - old.offsetLeft);
				sliderApply();
				this.classList.add('current');
			}
		}
		
		slider.children[0].classList.add('current');

		document.addEventListener('keydown', onKeyUp, false);

		function onKeyUp(event) {
			switch(event.keyCode) {
				case 39:
					slideNext();
					event.preventDefault();
					return false;
					break;
				case 37:
					slidePrevious();
					event.preventDefault();
					return false;
					break;
			}
		}

		function slideNext(){
			if (current < n_slides - 1){
				slider.children[current].classList.remove('current');
				var w = slider.children[current].offsetWidth;
				xOffset -= w;
				current++;
				sliderApply();
			}
		}
		function slidePrevious(){
			if (current > 0){
				slider.children[current].classList.remove('current');
				current--;
				var w = slider.children[current].offsetWidth;
				xOffset += w;
				sliderApply();
			}
		}
		function sliderApply() {
			slider.children[current].classList.add('current');
			var transformValue = 'translate3d(' + xOffset +'px, 0, 0)';
			var transformPropertyName = Modernizr.prefixed('transform');
			slider.style[transformPropertyName] = transformValue;
			var zoomed = slider.querySelector('.zoom');
			if (zoomed){
				zoomed.classList.remove('zoom');
			}
		}

	}
}
