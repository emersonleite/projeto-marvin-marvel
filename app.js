const vm = new Vue({
  el: "#app",
  data: {
    nameHero: "",
    idHero: 0,
    descriptionHero: "",
    postCharacter: {},
    charactersList: [],
    charactersData: [],
    atualCharacter: "",
    comicsList: [],
    count: null,
    filteredList: [],
    numberPages: 0,
    numberPagesComics: 0,
    numberComics: 0,
    page: 0,
    pageComics: 0,
    queryName: "name=",
    queryNameStartsWith: "nameStartsWith=",
    queryOffset: "offset=",
    req: 0,
    showInputHeader: false,
    showComics: false,
    showModal: false,
    showPaginate: false,
    showPaginateComics: false,
    searchValue: "",
    total: null,
    url: "",
    urlComics: "",
  },
  computed: {},
  methods: {
    apiRequirements() {
      let b = window.localStorage.getItem("req");
      this.req = b;
    },

    fetchCharacter(value) {
      if (value.length === 1) {
        this.url = this.returnUrl(this.queryNameStartsWith, value);
      } else {
        this.url = this.returnUrl(this.queryName, value);
      }
      this.loadData(this.url);
    },

    loadData(url) {
      this.req++;
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          if (this.url) {
            this.charactersData = response.data;
            this.charactersList = this.charactersData.results;
            this.counterDefinition(this.charactersData);
            console.log(this.charactersList);
            this.url = "";
          }
          if (this.urlComics) {
            this.comicsList = response.data.results;
            this.urlComics = "";
            console.log(this.comicsList);
          }
        });
    },

    fetchComics(id, name, numberComics) {
      console.log(id);
      this.atualCharacter = name;
      this.numberComics = numberComics;
      this.urlComics = this.returnUrlComics(id);
      this.comicsList = this.loadData(this.urlComics);
      //console.log(this.numberComics);
      this.numberPagesComics = Math.ceil(this.numberComics / 20);
      if (this.numberPagesComics > 1) {
        this.showPaginateComics = true;
      }
      console.log(this.numberPagesComics);
      this.showModal = true;
    },

    returnUrlComics(id) {
      return `https://gateway.marvel.com/v1/public/characters/${id}/comics?apikey=bced951e3947b6a5f409e71eb5f0afc3`;
    },

    returnUrl(queryParam, value) {
      return `https://gateway.marvel.com/v1/public/characters?${queryParam}${value}&${this.queryOffset}${this.page}&apikey=bced951e3947b6a5f409e71eb5f0afc3`;
    },

    counterDefinition(data) {
      const { count, total } = data;
      this.count = count;
      this.total = total;
      this.loadPaginate(total);
    },

    loadPaginate(value) {
      if (value > this.count) {
        this.showPaginate = true;
        this.numberPages = Math.ceil(this.total / this.count);
      }
    },

    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },
  },
  created() {
    this.apiRequirements();
    this.searchValue = "Wolverine";
    /* this.fetchCharacter("Wolverine"); */
  },
  watch: {
    req() {
      let a = window.localStorage.setItem("req", this.req);
    },
    page() {
      this.fetchCharacter(this.searchValue);
    },
    pageComics() {
      this.fetchComics(this.pageComics);
    },
    searchValue() {
      this.page = 0;
      this.showPaginate = false;
    },
  },
});

/* numberPagesComics - numero total de paginas
numberComics - numero total de gibis... 
pageComics - pagina atual do comics
showPaginateComics - true ou false  */
