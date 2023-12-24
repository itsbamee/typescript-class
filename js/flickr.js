class MyFlickr {
  constructor(selector, option) {
    this.selector = selector;
    this.opt = option;
    this.tag = option.tag;
    this.myId = option.myId;

    this.createInit();
    this.fetchData();
  }

  //필수 DOM생성 메서드
  createInit() {
    const [parentEl, childEl] = this.tag.split(">");
    const wrap = document.createElement(parentEl);

    this.selector.append(wrap);
    this.wrap = wrap;
    this.childTag = childEl;
  }

  getURL(type, opt) {
    const baseURL =
      "https://www.flickr.com/services/rest/?format=json&nojsoncallback=1&method=";
    const method_interest = "flickr.interestingness.getList";
    const method_user = "flickr.people.getPhotos";
    const method_search = "flickr.photos.search";
    if (type === "interest")
      return `${baseURL}${method_interest}&api_key=${this.opt.api_key}&per_page=${this.opt.num}`;
    if (type === "search")
      return `${baseURL}${method_search}&api_key=${this.opt.api_key}&per_page=${this.opt.num}&tags=${opt}`;
    if (type === "user")
      return `${baseURL}${method_user}&api_key=${this.opt.api_key}&per_page=${this.opt.num}&user_id=${opt}`;
  }

  //url에 따라서 fetching data반환 메서드
  async fetchData() {
    const data = await fetch(this.getURL("user", this.myId));
    const json = await data.json();

    this.createList(json.photos.photo);
  }

  //fetching데이터에 따라 동적 목록 생성 메서드
  createList(arr) {
    let tags = "";

    arr.forEach((item) => {
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
