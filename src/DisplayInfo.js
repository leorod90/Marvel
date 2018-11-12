import React, { Component } from 'react';
import './DisplayInfo.css';

class DisplayInfo extends Component {
  closeLightbox = () => {
    this.props.toggleComicInfo();
  }
  changeInfo = (e) => {
    const direction = e.target.dataset.arrow;
    this.props.changeInfoPage(direction);
  }
  keyPress = (e) => {
    //escape
    if (e.keyCode === 27) {
      this.props.toggleComicInfo();
    }
    //left
    if (e.keyCode === 37) {
      this.props.changeInfoPage('left');
    }
    //right
    if (e.keyCode === 39) {
      this.props.changeInfoPage('right');
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.keyPress, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPress, false);
  }
  render() {
    const { title, thumbnail, date, writer, artist, description } = this.props
    return (
      <section className="lightbox" onKeyPress={this.keyPressEsc}>
        <div className="lightbox-contain">
          <div className="lightbox-content">
            <img src={`${thumbnail.path}/portrait_uncanny.${thumbnail.extension}`} alt={title} />
            <div className="lightbox-info">
              <h1 className="info-title">{title}</h1>

              <div className="info-info">
                <h6>Published:</h6>
                <p>{date}</p>
              </div>
              <div className="info-info">
                <h6>Writer:</h6>
                <p>{writer}</p>
              </div>
              <div className="info-info">
                <h6>Artist:</h6>
                <p>{artist}</p>
              </div>

              <p className="info-summary">{description}</p>
            </div>
            <i className="fas fa-angle-double-left double-arrow" data-arrow="left" onClick={this.changeInfo}></i>
            <i className="fas fa-angle-double-right double-arrow" data-arrow="right" onClick={this.changeInfo}></i>
            <i className="fas fa-times" onClick={this.closeLightbox}></i>
          </div>
        </div>
      </section>
    );
  }
}

export default DisplayInfo;