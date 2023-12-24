interface DefOpt {
	api_key: string;
	num: number;
	myId: string;
	tag: string;
	interest: boolean;
	search: boolean;
}

interface FetchData {
	farm: number;
	id: string;
	isFamily: number;
	isFriend: number;
	isPublic: number;
	owner: string;
	secret: string;
	server: string;
	title: string;
}

class MyFlickr {
	#defOpt = {
		api_key: '8b64c130239af91c4db3e4d01e67033b',
		num: 20,
		myId: '199361154@N05',
		tag: 'ul>li',
		interest: true,
		search: true
	};

	selector: HTMLElement | null;
	wrap: HTMLUListElement | HTMLElement | null;
	childTag: string;
	opt: DefOpt;
	tag: string;
	myId: string;
	search: boolean;
	interest: boolean;

	constructor(selector: HTMLElement | null, option: DefOpt) {
		this.selector = selector;
		this.opt = { ...this.#defOpt, ...option };
		this.tag = this.opt.tag;
		this.myId = this.opt.myId;
		this.search = this.opt.search;
		this.interest = this.opt.interest;
		this.createInit();
		this.bindingEvent();
	}

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

		this.interest && this.selector?.append(nav);
		this.search && this.selector?.append(form);
		this.selector?.append(wrap);

		this.wrap && (this.wrap = wrap);
		this.childTag = childEl;
	}

	bindingEvent() {
		const [btnMine, btnInterest] = this.selector?.querySelectorAll('button');
		const form = this.selector?.querySelector('form');

		this.fetchData(this.getURL('user', this.myId));

		this.interest && btnMine.addEventListener('click', () => this.fetchData(this.getURL('user', this.myId)));
		this.interest && btnInterest.addEventListener('click', () => this.fetchData(this.getURL('interest')));
		this.search &&
			form?.addEventListener('submit', (e: Event) => {
				e.preventDefault();
				console.log(e);
				const eTarget = e.currentTarget as HTMLInputElement;
				const tag = eTarget.querySelectorAll('input')[0].value;
				if (tag.trim() === '') return alert('검색어를 입력하세요.');
				this.fetchData(this.getURL('search', tag));
				eTarget.querySelectorAll('input')[0].value = '';
			});
	}

	getURL(type: string, opt?: string | undefined) {
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

	async fetchData(url: string) {
		const data = await fetch(url);
		const json = await data.json();
		console.log(json.photos.photo);
		this.createList(json.photos.photo);
	}

	createList(arr: FetchData[]) {
		let tags = '';

		arr.forEach(item => {
			tags += `
        <${this.childTag} class='item'>
          <img src='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg' />
          <h2>${item.title}</h2>
        </${this.childTag}>
      `;
		});

		this.wrap && (this.wrap.innerHTML = tags);
	}
}
