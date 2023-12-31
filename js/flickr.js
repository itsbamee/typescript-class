class MyFlickr {
	#defOpt = {
		api_key: '8b64c130239af91c4db3e4d01e67033b',
		num: 20,
		myId: '199361154@N05',
		tag: 'ul>li',
		interest: true,
		search: true
	};

	constructor(selector, option) {
		this.selector = selector;
		this.opt = { ...this.#defOpt, ...option };
		this.tag = this.opt.tag;
		this.myId = this.opt.myId;
		this.search = this.opt.search;
		this.interest = this.opt.interest;
		this.createInit();
		this.bindingEvent();
	}

	//필수 DOM생성 메서드
	createInit() {
		const [parentEl, childEl] = this.tag.split('>');
		const wrap = document.createElement(parentEl);
		const nav = document.createElement('nav');
		const form = document.createElement('form');
		nav.innerHTML = `
      <button>My Gallery</button>
      <button>Interest Gallery</button>
    `;

		form.innerHTML = `
      <input type="text"/>
      <input type="submit" value="search"/>
    `;

		this.interest && this.selector.append(nav);
		this.search && this.selector.append(form);
		this.selector.append(wrap);

		this.wrap = wrap;
		this.childTag = childEl;
	}

	//이벤트 바인딩 메서드 (버튼클릭)
	bindingEvent() {
		const [btnMine, btnInterest] = this.selector.querySelectorAll('button');
		const form = this.selector.querySelector('form');

		//로딩이벤트
		this.fetchData(this.getURL('user', this.myId));

		//btn 클릭 이벤트
		this.interest && btnMine.addEventListener('click', () => this.fetchData(this.getURL('user', this.myId)));
		this.interest && btnInterest.addEventListener('click', () => this.fetchData(this.getURL('interest')));
		this.search &&
			form.addEventListener('submit', e => {
				e.preventDefault();
				console.log(e);
				const tag = e.currentTarget.querySelectorAll('input')[0].value;
				if (tag.trim() === '') return alert('검색어를 입력하세요.');
				this.fetchData(this.getURL('search', tag));
				e.currentTarget.querySelectorAll('input')[0].value = '';
			});
	}

	getURL(type, opt) {
		const baseURL = 'https://www.flickr.com/services/rest/?format=json&nojsoncallback=1&method=';
		const method_interest = 'flickr.interestingness.getList';
		const method_user = 'flickr.people.getPhotos';
		const method_search = 'flickr.photos.search';
		if (type === 'interest') return `${baseURL}${method_interest}&api_key=${this.opt.api_key}&per_page=${this.opt.num}`;
		if (type === 'search')
			return `${baseURL}${method_search}&api_key=${this.opt.api_key}&per_page=${this.opt.num}&tags=${opt}`;
		if (type === 'user')
			return `${baseURL}${method_user}&api_key=${this.opt.api_key}&per_page=${this.opt.num}&user_id=${opt}`;
	}

	//url에 따라서 fetching data반환 메서드
	async fetchData(url) {
		console.log(url);
		const data = await fetch(url);
		//const data = await fetch(this.getURL('search', 'ocean'));
		const json = await data.json();
		this.createList(json.photos.photo);
	}

	//fetching데이터에 따라 동적 목록 생성 메서드
	createList(arr) {
		let tags = '';

		arr.forEach(item => {
			tags += `
        <${this.childTag} class='item'>
          <img src='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg' />
          <h2>${item.title}</h2>
        </${this.childTag}>
      `;
		});

		this.wrap.innerHTML = tags;
	}
}
