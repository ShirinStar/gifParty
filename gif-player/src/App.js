import React, { Component } from 'react';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import { Route, Link } from 'react-router-dom';
import './App.css';
import { fetchGif, userSearch } from './services/giphy';
import TextToSpeech from './components/TextToSpeech';
import SearchText from './components/SearchText';
import GifList from './components/GifList';
import Header from './components/Header';

class App extends Component {
  constructor() {
    super();
    this.state= {
      gifs: [],
      keyboards: [],
      playSounds: [],
      letters:['q','w','e','r','t','a','s','d','f','g','z','x','c','v','b']
    }
    this.searchText = this.searchText.bind(this);
    this.handleSound = this.handleSound.bind(this);
  }

//search gif by word
async searchText(newGif){
    try {
      const gifResp = await userSearch(newGif);
      const keyboards = {
        word: newGif,
        gif: gifResp
      }
        this.setState(prevState => {
          return {
          gifs: [...prevState.gifs, gifResp],
          currentGif: gifResp,
          currentWord: newGif,
          keyboards: [...prevState.keyboards, keyboards]
      };
    });
  }
        catch(error){
        console.log(error);
  }
}

  handleSound(word) {
    this.setState(prevState => {
      return {
      playSounds: [...prevState.playSounds, word],

    };
  });
}



  render() {
    const { newGif, isShown } = this.state;
    return (
      <div className="App">
          <Header />
      <div className='home'>
        <div className='header'>
          <h1>GIF to SPEECH</h1>
          <h2 className='tagline'> playing verbally again </h2>
        </div>
        <div clssName='btnDiv'>
          {this.state.keyboards.length===15 ? <p className='done'> Now just play and hit your keys! </p>:
          <div className='btnWarp'>
            <Link to="/search-text"> click to add Gifs </Link>
          <main className='search'>
            <Route path="/search-text" render={() => (
              <div>
                <SearchText searchText={this.searchText}/>
              </div>
              )}
            />
          </main>
          </div>
        }
      </div>

    </div>
        <GifList gifs={this.state.gifs} letters={this.state.letters} />
      {
        this.state.letters.map((letter, i) => (
          this.state.keyboards[i] && <KeyHandler
            keyEventName='keydown'
            keyValue={letter}
            onKeyHandle={() => {
              this.handleSound(this.state.keyboards[i].word);
            }}
          />
        ))}
        {this.state.playSounds.map(sound => (
            <TextToSpeech word={sound}/>
        ))}

    </div>
    )
  }
}

export default App;
