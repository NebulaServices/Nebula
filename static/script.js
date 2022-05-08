let advertisement = document.getElementById("ad")
let disableadbtn = document.getElementById("disable")
let menu = document.getElementById("header_section_top")

advertisement.style.display = ''

function toggleAds() {
  const ads = document.getElementById('ads');
	const option = sessionStorage.getItem('ads');
  if (option === 'on') {
    sessionStorage.setItem('ads', 'off');
    ads.style.color = ''; 
    advertisement.style.display = 'none';
  } else {
    sessionStorage.setItem('ads', 'on');
    advertisement.style.display = ''; 
    ads.style.color = '';
  }
}

if (sessionStorage.getItem('ads') == 'off') {
	advertisement.style.display = "none"
  ads.style.color = '';
} else {
	advertisement.style.display = ''
  ads.style.color = '';
}

// document.body.style.backgroundColor = "rgb(60, 9, 108)"
function galaxy() {
	window.localStorage.setItem('galaxy', 'true');
	document.body.style.backgroundColor = "rgb(60, 9, 108)"
	localStorage.setItem('ocean', 'false');
	menu.style.backgroundColor = "rgb(90, 24, 154)"
	window.localStorage.removeItem('ocean');
}

function ocean() {
	window.localStorage.setItem('ocean', 'on');
	document.body.style.backgroundColor = "rgb(72, 202, 228)"
	localStorage.setItem('galaxy', 'false');
	window.localStorage.removeItem('galaxy');
	menu.style.backgroundColor = "rgb(144, 224, 239)"
}

function classic() {
	window.localStorage.setItem('classic', 'on');
	document.body.style.backgroundColor = "rgb(113, 131, 85)"
	localStorage.setItem('galaxy', 'false');
	window.localStorage.removeItem('galaxy');
	window.localStorage.removeItem('ocean');
	menu.style.backgroundColor = "rgb(90, 24, 154)"
	menu.style.backgroundColor = "rgb(135, 152, 106)"
}

function toggleNoGG() {
  const option = localStorage.getItem('nogg');
  const nogg = document.getElementById('nogg');
  if (option === 'on') {
    nogg.style.color = '';
    localStorage.setItem('nogg', 'off');
  } else {
    nogg.style.color = 'green';
    localStorage.setItem('nogg', 'on');
  }
}

if (localStorage.getItem('nogg') === 'on') 
  nogg.style.color = 'green';

if (window.localStorage.getItem('galaxy') == "true") {
	document.body.style.backgroundColor = "rgb(60, 9, 108)"

	menu.style.backgroundColor = "rgb(90, 24, 154)"
} else if (window.localStorage.getItem('ocean') == "on") {
	document.body.style.backgroundColor = "rgb(72, 202, 228)"

	menu.style.backgroundColor = "rgb(144, 224, 239)"
} else if (window.localStorage.getItem('classic') == "on") {
	menu.style.backgroundColor = "rgb(135, 152, 106)"
	document.body.style.backgroundColor = "rgb(113, 131, 85)"
} else {
	document.body.style.backgroundColor = "rgb(60, 9, 108)"

	menu.style.backgroundColor = "rgb(90, 24, 154)"
}

particlesJS("particles-js", {
	"particles": {
		"number": {
			"value": 355,
			"density": {
				"enable": true,
				"value_area": 789.1476416322727
			}
		},
		"color": {
			"value": "#ffffff"
		},
		"shape": {
			"type": "circle",
			"stroke": {
				"width": 0,
				"color": "#000000"
			},
			"polygon": {
				"nb_sides": 5
			},
			"image": {
				"src": "img/github.svg",
				"width": 100,
				"height": 100
			}
		},
		"opacity": {
			"value": 0.48927153781200905,
			"random": false,
			"anim": {
				"enable": true,
				"speed": 0.2,
				"opacity_min": 0,
				"sync": false
			}
		},
		"size": {
			"value": 2,
			"random": true,
			"anim": {
				"enable": true,
				"speed": 2,
				"size_min": 0,
				"sync": false
			}
		},
		"line_linked": {
			"enable": false,
			"distance": 150,
			"color": "#ffffff",
			"opacity": 0.4,
			"width": 1
		},
		"move": {
			"enable": true,
			"speed": 0.2,
			"direction": "none",
			"random": true,
			"straight": false,
			"out_mode": "out",
			"bounce": false,
			"attract": {
				"enable": false,
				"rotateX": 600,
				"rotateY": 1200
			}
		}
	},
	"interactivity": {
		"detect_on": "canvas",
		"events": {
			"onhover": {
				"enable": true,
				"mode": "bubble"
			},
			"onclick": {
				"enable": true,
				"mode": "push"
			},
			"resize": true
		},
		"modes": {
			"grab": {
				"distance": 400,
				"line_linked": {
					"opacity": 1
				}
			},
			"bubble": {
				"distance": 83.91608391608392,
				"size": 1,
				"duration": 3,
				"opacity": 1,
				"speed": 3
			},
			"repulse": {
				"distance": 200,
				"duration": 0.4
			},
			"push": {
				"particles_nb": 4
			},
			"remove": {
				"particles_nb": 2
			}
		}
	},
	"retina_detect": true
});

