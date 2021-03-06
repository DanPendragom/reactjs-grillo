// Dependecies
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// Styles
import {
    Container,
    Content,
    Player,
    Info,
    Controls,
    Item,
    Title,
    Playlist
} from './style'

// Components
import Menu from '../../components/Menu'
import MainHeader from '../../components/MainHeader'

// Images
import CreateIcon from '../../assets/images/iconCreateMusic.svg'

import { api } from '../../api/APIUtils'
export default class Musics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            musics: [],
        }
    }

    handlePlayMusic = async (itemMap) => {
        let Title = document.getElementById('musicTitle')
        let Banner = document.getElementById('musicBanner')
        let Player = document.getElementById('musicPlayer')
        let Image = `https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/files/${itemMap.image}`
        
        Title.textContent = itemMap.musicName
        Banner.style.backgroundImage = "url(" + Image + ")"
        Player.src = `https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/musics/${itemMap.audio}`
    }

    async componentDidMount() {
        let Title = document.getElementById('musicTitle')
        let Banner = document.getElementById('musicBanner')
        let Player = document.getElementById('musicPlayer')        

        const user = JSON.parse(localStorage.getItem('@CacheGrillo:User'))
        
        const response = await api.get(`/music?userId=${user._id}`)
        this.setState({ musics: response.data })

        const {musics} = this.state
        
        if(musics[0] === undefined){
            console.log("Sem músicas cadastradas")
        }
        else{
            let Image = `https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/files/${musics[0].image}`
            Title.textContent = musics[0].musicName
            Player.src = `https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/musics/${musics[0].audio}`
            Banner.style.backgroundImage = "url(" + Image + ")"
        }
    }

    render() {
        return (
            <Container>
                <Menu />
                <Content>
                    <MainHeader subTitle="MÚSICAS" />
                    <Player>
                        <div id="musicBanner">
                        </div>
                        <Info>
                            <h3 id="musicTitle"></h3>
                            <p>VOCÊ</p>
                            <Controls>
                                <audio src controls id="musicPlayer"></audio>
                            </Controls>
                        </Info>
                    </Player>
                    <Title>
                        <div>
                            <h3>Playlist</h3>
                            <Link className="Link" to="/createmusic">
                                <button>ADICIONAR MÚSICA</button>
                            </Link>
                        </div>
                    </Title>
                    <Playlist>
                        {this.state.musics.map(itemMap => (
                            <Item key={itemMap._id} onClick={() => this.handlePlayMusic(itemMap)}>
                                <p>{itemMap.musicName}</p>
                                <audio src={`https://3333-a6ed127b-4d1f-4137-ae95-f5bd4566c8b0.ws-us02.gitpod.io/musics/${itemMap.audio}`}/>
                            </Item>
                        ))}
                    </Playlist>
                </Content>
            </Container>
        )
    }
}
