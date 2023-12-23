class MyFlickr {
  constructor(selector, option) {
    this.selector = selector;
    this.opt = option;

    this.createInit();
    this.fetchData();
  }

  //필수 DOM생성 메서드
  createInit() {
    const wrap = document.createElement("ul");
    this.selector.append(wrap);
    this.wrap = wrap;
  }

  //url에 따라서 fetching data반환 메서드
  async fetchData() {
    const baseURL =
      "https://www.flickr.com/services/rest/?format=json&nojsoncallback=1&method=";
    const method_interest = "flickr.interestingness.getList";
    const url = `${baseURL}${method_interest}&api_key=${this.opt.api_key}&per_page=${this.opt.num}`;

    const data = await fetch(url);
    const json = await data.json();
    console.log(json.photos.photo);

    this.createList(json.photos.photo);
  }

  //fetching데이터에 따라 동적 목록 생성 메서드
  createList(arr) {
    let tags = "";

    arr.forEach((item) => {
      tags += `
        <li class='item'>
          <img src='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg' />
          <h2>${item.title}</h2>
        </li>
      `;
    });

    this.wrap.innerHTML = tags;
  }
}
