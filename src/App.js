import React, { Component } from 'react';
import './App.css';
import pagination from './pagination';
import DisplayInfo from './DisplayInfo';
import MarvelApi from './MarvelApi';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stylePath: 'spider-man.css',
      //stylePath: 'captain-america.css',
      apiCode: 1009610,
      //apiCode: spi-1009610 cap-1009220 hulk-1009351
      results: [],
      offset: 0,
      orderDate: null,
      displayInfo: false,
      infoArray: [],
    }
  }
  async componentWillMount() {
    this.state.marvel = new MarvelApi();
    const results = await this.state.marvel.getApi(this.state.offset, this.state.apiCode, this.state.orderDate);
    this.setState({
      results
    });
  }
  mapComics() {
    let array = this.state.results
    if (array.length > 0) {
      return array.map(e => {
        let { id, thumbnail, title, dates, creators, description } = e;
        return (<div className="comic-listing" key={id}>
          <img src={`${thumbnail.path}/portrait_xlarge.${thumbnail.extension}`} alt={title} />
          <div className="font-back">
            <i className="fas fa-plus" onClick={() => this.comicInfo(id, title, thumbnail, dates, creators, description)}></i>
          </div>
        </div>)
      })
    }
  }
  comicInfo = (id, title, thumbnail, dates, creators, description) => {
    //get date
    let date = dates.filter(e => {
      return e.type === "onsaleDate";
    })
    dates = date[0].date;
    //["2018-09-19T00:00:00-0400"]
    let res = dates.split('T');
    date = res[0];
    //get writer
    let writerAr = creators.items.filter(e => {
      return e.role === "writer";
    })
    let writer = '';
    if (writerAr.length > 0) {
      writer = writerAr[0].name;
    }
    //get artist
    let artistAr = creators.items.filter(e => {
      return e.role === "penciler (cover)";
    })
    let artist = '';
    if (artistAr.length > 0) {
      artist = artistAr[0].name;
    }
    this.setState({
      displayInfo: true,
      id,
      title,
      thumbnail,
      date,
      writer,
      artist,
      description
    })
  }
  toggleComicInfo = () => {
    this.setState({
      displayInfo: false,
    })
  }
  changeInfoPage = (direction) => {
    const curId = this.state.id;
    const array = this.state.results;
    let curIndex = array.findIndex((obj) => obj.id === curId);
    if (direction === 'right') {
      if (curIndex < array.length - 1) {
        curIndex += 1;
      } else {
        curIndex = 0;
      }
    } else if (direction === 'left') {
      if (curIndex > 0) {
        curIndex -= 1;
      } else {
        curIndex = array.length - 1;
      }
    }
    const { id, title, thumbnail, dates, creators, description } = array[curIndex];
    this.comicInfo(id, title, thumbnail, dates, creators, description)
  }
  getValue = (e) => {
    const value = e.target.value;
    if (isNaN(value)) {
      let stylePath;
      let apiCode;
      //apiCode: spi-1009610 cap-1009220 hulk-1009351
      if (value === 'spider-man') {
        stylePath = `spider-man.css`;
        apiCode = 1009610;
      } else if (value === 'captain-america') {
        stylePath = `captain-america.css`;
        apiCode = 1009220;
      } else if (value === 'the-hulk') {
        stylePath = 'hulk.css';
        apiCode = 1009351;
      };
      this.setState({
        stylePath,
        apiCode,
      }, async () => {
        const results = await this.state.marvel.getApi(this.state.offset, this.state.apiCode, this.state.orderDate);
        this.setState({
          results
        });
      });
    }
  }
  organizeDate = async (e) => {
    const orderDate = e.target.value;
    if (isNaN(orderDate)) {
      this.setState({
        orderDate,
      }, async () => {
        const results = await this.state.marvel.getApi(this.state.offset, this.state.apiCode, this.state.orderDate);
        this.setState({
          results
        });
      });
    }
  }
  getPage(e) {
    let value = e.target.value;
    if (value > 0 & value <= this.state.marvel.state.totalLength) {
      value -= 1;
      const offset = value * 8;
      this.setState({
        offset
      }, async () => {
        const results = await this.state.marvel.getApi(this.state.offset, this.state.apiCode, this.state.orderDate);
        this.setState({
          results
        });
      });
    }
  }
  displayPag = () => {
    //p1 - 0, p2 - 8, p3 - 16
    const page = (this.state.offset / 8) + 1;
    //console.log(`Selected page ${page}:`, 
    const pages = pagination(page, this.state.marvel.state.totalLength)
    return pages.map((e, i) => {
      return (<li key={i} onClick={() => this.changePage(e)}>{e}</li>)
    })
  }
  changePage = (e) => {
    if (typeof e === 'number') {
      const offset = (e - 1) * 8;
      console.log(offset)
      this.setState({
        offset
      }, async () => {
        const results = await this.state.marvel.getApi(this.state.offset, this.state.apiCode, this.state.orderDate);
        this.setState({
          results
        });
      });
    }
  }
  render() {
    //book image
    let bookImg = null;
    if (this.state.stylePath === "spider-man.css") {
      bookImg = "spider-book.png";
    } else if (this.state.stylePath === "captain-america.css") {
      bookImg = "shield.png";
    } else {
      bookImg = "./fist.png";
    }
    //comic lighbox
    let comicInfo = null;
    if (this.state.displayInfo) {
      const { title, thumbnail, date, writer, artist, description } = this.state
      comicInfo = (
        <DisplayInfo title={title}
          thumbnail={thumbnail}
          date={date}
          writer={writer}
          artist={artist}
          description={description}
          toggleComicInfo={this.toggleComicInfo}
          changeInfoPage={this.changeInfoPage}
        />
      )
    };
    return (
      <div>
        <link rel="stylesheet" type="text/css" href={this.state.stylePath} />
        <div className="body">
          <div className="App">
            <section id="container">
              <div className="container-top"></div>
              <div className="container-bottom"></div>
              <div className="content-area">
                <header>
                  <div className="logo-contain">
                    <img className="logo" src="https://upload.wikimedia.org/wikipedia/commons/7/71/Marvel-Comics-Logo.svg" width="100%" height="auto" alt="marvel" />
                  </div>
                  <div className="title">
                    <p>The Amazing</p>
                    <h2>Comic Collection Search</h2>
                  </div>
                </header>

                <section id="comic-book">
                  <div className="book-contain">
                    <img src={bookImg} alt="spider-book" width="100%" height="auto" />
                  </div>
                  <div id="comic-contain">

                    {this.mapComics()}

                  </div>
                </section>

                <section id="search-area">
                  <div className="search-contain">

                    <select className="simple-select" onChange={this.getValue}>
                      <option value="0">--SUPER HERO--</option>
                      <option value="spider-man">SPIDER-MAN</option>
                      <option value="the-hulk">THE HULK</option>
                      <option value="captain-america">CAPTAIN-AMERICA</option>
                    </select>
                    <select className="simple-select" onChange={this.organizeDate}>
                      <option value="0">--RELEASE DATE--</option>
                      <option value="-onsaleDate">NEWEST</option>
                      <option value="onsaleDate">OLDEST</option>
                    </select>

                    <div className="input" >
                      <p><span>Page:</span> <input type="number" onChange={(e) => this.getPage(e)} /> of {this.state.marvel.state.totalLength}</p>
                    </div>

                  </div>
                </section>

              </div>
              <div className="side-img"></div>
            </section>

          </div>
        </div>
        {comicInfo}
      </div>
    );
  }
}

export default App;
