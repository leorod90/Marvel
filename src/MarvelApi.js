import { Component } from 'react';
import axios from 'axios';

export default class MarvelApi extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async  getApi(offset, charId, order = null) {
        //public key
        const publicKey = '2f8696811573eb425fd686935d712233';
        //private key
        // const privateKey = '3337dff652e38ab03940af04a1664c826bb1e582';
        //proxy
        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        //md5 = 13337dff652e38ab03940af04a1664c826bb1e5822f8696811573eb425fd686935d712233
        const hash = '4efbc6a9c9478f7cd8b9c85213de72e8';
        //character id
        // const charId = '1009610';
        //time stamp
        const ts = '1';
        //per page
        const limit = '8';

        let get = `https://gateway.marvel.com/v1/public/characters/${charId}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`
        if (order) {
            get = `${get}&orderBy=${order}`;
            console.log(get)
        }
        const data = await axios.get(get);
        const results = data.data.data.results;
        this.state.totalLength = Math.ceil(data.data.data.total / limit);
        return results
    }
}
