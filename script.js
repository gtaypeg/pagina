'use strict';

let offset = 1;
let elementCont = document.getElementById('cont');
let elementPage = document.getElementById('page');
let elementLoad = document.getElementById('loading');
// const controller = new AbortController();
// const { signal } = controller;

function fetchUrl() {
	document.getElementById('search-container').classList.add('loading');
	elementCont.style.display = 'none';
	elementLoad.classList.add('show');
	elementPage.classList.remove('show');
	let q =
		document
			.getElementById('search')
			.value.trim()
			.split(' ')
			.filter((e) => e)
			.join('+') || '404';

	let url = `/api/imagesearch/${q}?offset=${(offset -  1) * 10 + 1}`;

	fetch(url)
		.then((data) => data.json())
		.then((dataJson) => {
			let html = '';
			for (let i = 0; i < 10; i++) {
				html += `
						<div class="item" style="width: ${dataJson[i].thumbnail.width}px; height: ${dataJson[i].thumbnail.height}px">
							<a href="${dataJson[i].url}">
								<img src="${dataJson[i].thumbnail.url}">
							</a>
						</div>`;
			}
			elementLoad.classList.remove('show');
			elementCont.style.display = 'block';
			elementPage.classList.add('show');
			elementCont.innerHTML = html;
		})
		.catch(() => {
			elementLoad.classList.remove('show');
			elementCont.style.display = 'block';
			elementPage.classList.remove('show');
			elementCont.innerHTML = '<p>Error :(</p>';
		});
}

function click(e) {
	offset = Number.parseInt(e.target.textContent);

	fetchUrl();
	pageIndex(offset);
}

function pageIndex(index = 1) {
	let html = '';
	let elementsIndex = document.getElementsByClassName('index');
	if (index > 1) {
		html = `<div id="prev">&lt;Prev</div>`;
	}

	if (index <= 6) {
		for (let i = 1; i <= 10; i++) {
			html += `<a class="index" href="#">${i}</a >`;
		}
	} else {
		for (let i = index - 5; i <= index + 4; i++) {
			html += `<a  class="index" href="#">${i}</a >`;
		}
	}
	html += `<div id="next">Next&gt;</div>`;

	elementPage.innerHTML = html;
	document.getElementById('next').addEventListener('click', () => {
		fetchUrl();
		offset++;
		pageIndex(offset);
	});
	if (index > 1) {
		document.getElementById('prev').addEventListener('click', () => {
			fetchUrl();
			offset--;
			pageIndex(offset);
		});
	}

	for (let i = 0; i < 10; i++) {
		elementsIndex[i].addEventListener('click', click);
	}

	elementsIndex[offset <= 5 ? offset - 1 : 5].classList.add('select');
}

document.getElementById('submit-search').addEventListener('submit', (e) => {
	offset = 1;
	e.preventDefault();

	fetchUrl();
	pageIndex(offset);
});
pageIndex();
