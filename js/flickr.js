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

  //선택된 타입과 옵션에 따라서 url 반환 메서드
  async fetchData() {
    const baseURL =
      "https://www.flickr.com/services/rest/?format=json&nojsoncallback=1";
    const method_interest = "flickr.interestingness.getList";
    const url = `${baseURL}${method_interest}&api_key=${this.opt.api_key}&per_page=${this.opt.num}`;

    const data = await fetch(url);
    const json = await data.json();
    console.log(json.photos.photo);
  }

  //url에 따라서 fetching date 반환 메서드

  //fetching data에 따라 동적 목록 생성 메서드
}
