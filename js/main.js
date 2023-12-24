var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MyFlickr_defOpt;
class MyFlickr {
    constructor(selector, option) {
        _MyFlickr_defOpt.set(this, {
            api_key: '8b64c130239af91c4db3e4d01e67033b',
            num: 20,
            myId: '199361154@N05',
            tag: 'ul>li',
            interest: true,
            search: true
        });
        this.selector = selector;
        this.opt = Object.assign(Object.assign({}, __classPrivateFieldGet(this, _MyFlickr_defOpt, "f")), option);
        this.tag = this.opt.tag;
        this.myId = this.opt.myId;
        this.search = this.opt.search;
        this.interest = this.opt.interest;
        this.createInit();
        this.bindingEvent();
    }
    createInit() {
        var _a, _b, _c;
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
        this.interest && ((_a = this.selector) === null || _a === void 0 ? void 0 : _a.append(nav));
        this.search && ((_b = this.selector) === null || _b === void 0 ? void 0 : _b.append(form));
        (_c = this.selector) === null || _c === void 0 ? void 0 : _c.append(wrap);
        this.wrap && (this.wrap = wrap);
        this.childTag = childEl;
    }
    bindingEvent() {
        var _a, _b;
        const [btnMine, btnInterest] = (_a = this.selector) === null || _a === void 0 ? void 0 : _a.querySelectorAll('button');
        const form = (_b = this.selector) === null || _b === void 0 ? void 0 : _b.querySelector('form');
        this.fetchData(this.getURL('user', this.myId));
        this.interest && btnMine.addEventListener('click', () => this.fetchData(this.getURL('user', this.myId)));
        this.interest && btnInterest.addEventListener('click', () => this.fetchData(this.getURL('interest')));
        this.search &&
            (form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log(e);
                const eTarget = e.currentTarget;
                const tag = eTarget.querySelectorAll('input')[0].value;
                if (tag.trim() === '')
                    return alert('검색어를 입력하세요.');
                this.fetchData(this.getURL('search', tag));
                eTarget.querySelectorAll('input')[0].value = '';
            }));
    }
    getURL(type, opt) {
        const baseURL = 'https://www.flickr.com/services/rest/?format=json&nojsoncallback=1&method=';
        const method_interest = 'flickr.interestingness.getList';
        const method_user = 'flickr.people.getPhotos';
        const method_search = 'flickr.photos.search';
        if (type === 'interest')
            return `${baseURL}${method_interest}&api_key=${this.opt.api_key}&per_page=${this.opt.num}`;
        if (type === 'search')
            return `${baseURL}${method_search}&api_key=${this.opt.api_key}&per_page=${this.opt.num}&tags=${opt}`;
        if (type === 'user')
            return `${baseURL}${method_user}&api_key=${this.opt.api_key}&per_page=${this.opt.num}&user_id=${opt}`;
    }
    fetchData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetch(url);
            const json = yield data.json();
            console.log(json.photos.photo);
            this.createList(json.photos.photo);
        });
    }
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
        this.wrap && (this.wrap.innerHTML = tags);
    }
}
_MyFlickr_defOpt = new WeakMap();
