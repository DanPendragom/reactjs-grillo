// Dependecies
import React, { Component } from 'react';
// Styles
import {
    Container,
    Content,
    Scroll,
    Posts,
    NewPostContainer,
    Icons,
    PostForm,
    PostContainer,
    Body,
    Head,
    Post,
    PostManager
} from './style'

// Components
import Menu from '../../components/Menu'
import MainHeader from '../../components/MainHeader'

// images
import Cam from '../../assets/images/icon_photo.svg'
import IconEvent from '../../assets/images/postIconEvento.svg'
import IconVaga from '../../assets/images/postIconVaga.svg'
import Place from '../../assets/images/placeIcon.png'

// dependecies
import { api } from '../../api/APIUtils'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'

export default class Main extends Component {
    state = {
        feed: [],
        user: JSON.parse(localStorage.getItem('@CacheGrillo:User'))
    }

    async componentDidMount() {
        this.registerToSocket();
        const response = await api.get('posts');
        this.setState({ feed: response.data })
        console.log(this.state.feed)
    }

    eventPartipate(postId) {
        console.log(this.state.user._id)
        api.put('post', {
            userId: this.state.user._id,
            postId: postId
        }).then(result => {
            console.log(result.data.participants)
        }).catch(err => {
            console.log(err)
        })
    }

    registerToSocket() {
        const socket = io('https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/');

        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] });
        })
    }

    render() {
        const formatDate = date => {
            //xml nodeValue from time element
            let data = date
            let array = new Array();

            //split string and store it into array
            array = data.split('-')

            switch (array[1]) {
                case '01':
                    array[1] = 'Janeiro'
                    break;
                case '02':
                    array[1] = 'Fevereiro'
                    break;
                case '03':
                    array[1] = 'Março'
                    break;
                case '04':
                    array[1] = 'Abril'
                    break;
                case '05':
                    array[1] = 'Maio'
                    break;
                case '06':
                    array[1] = 'Junho'
                    break;
                case '07':
                    array[1] = 'Julho'
                    break;
                case '08':
                    array[1] = 'Agosto'
                    break;
                case '09':
                    array[1] = 'Setembro'
                    break;
                case '10':
                    array[1] = 'Outubro'
                    break;
                case '11':
                    array[1] = 'Novembro'
                    break;
                case '12':
                    array[1] = 'Dezembro'
                    break;
                default:
                    break;
            }

            //from array concatenate into new date string format: "DD.MM.YYYY"
            let newDate = (array[2] + " de " + array[1] + " de " + array[0])

            return newDate
        }

        return (
            <Container>
                <Menu />
                <Content>
                    <MainHeader subTitle="NO GRILLO" />
                    <Scroll>
                        <NewPost />
                        {this.state.feed.map(postMap => (
                            <Posts key={postMap._id}>
                                <PostContainer>
                                    <Head>
                                        <section>
                                            <div style={{ backgroundImage: `url(https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/files/${postMap.user.image})`}} className="circle">
                                            </div>
                                            <div>
                                                <span>{postMap.user.nome}</span>
                                                <span>{postMap.user.estado}</span>
                                            </div>
                                        </section>
                                    </Head>
                                    <Body>
                                        <h3>{postMap.postTitle}</h3>
                                        <p>{postMap.description}</p>
                                        <div>
                                            <button onClick={() => {
                                                this.eventPartipate(postMap._id)
                                            }}>
                                                COMPARECER
                                            </button>
                                        </div>
                                    </Body>
                                    <Post>
                                        <div style={{ backgroundImage: `url(https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/files/${postMap.image})`}}>
                                            <aside className="local">
                                                <img src={Place} alt="" />
                                                <p>{postMap.placeEvent}</p>
                                            </aside>
                                        </div>
                                        <div>
                                            <p>{formatDate(postMap.date)}</p>
                                        </div>
                                    </Post>
                                </PostContainer>
                            </Posts>
                        ))}
                    </Scroll>
                </Content>
            </Container>
        );
    }
}

class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            postTitle: '',
            description: '',
            placeEvent: '',
            date: '',
            image: null,
            imageProfile: null,
        }
    }

    async componentDidMount() {
        const token = await localStorage.getItem('@CacheGrillo:Token')
        const user = JSON.parse(await localStorage.getItem('@CacheGrillo:User'))

        const userImage = `https://3333-dfd00ddf-cd28-4c87-acca-6c3ec15debdb.ws-us02.gitpod.io/files/${user.image}`
        this.setState({ imageProfile: userImage })

        if (token && user) {
            console.log("Você está validado!")
        }

    }

    handleSubmit = async e => {
        e.preventDefault();

        const postData = new FormData;

        postData.append('postTitle', this.state.postTitle);
        postData.append('description', this.state.description);
        postData.append('author', this.state.author);
        postData.append('placeEvent', this.state.placeEvent);
        postData.append('date', this.state.date);
        postData.append('place', this.state.place);
        postData.append('image', this.state.image);

        // Mandando  Post para rota 'posts'
        await api.post('posts', postData);

        // Resetando estado atual
        this.setState({ postTitle: '', description: '', placeEvent: '', date: '', image: null })

        // Resetando background img
        let imageSpace = document.getElementById('postimage');
        imageSpace.style.backgroundImage = null;

        // recarregando a pagina - REFATORAR ESTA PARTE
        window.location.reload();
    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleImageChange = e => {
        let imageSpace = document.getElementById('postimage');
        let myImage = URL.createObjectURL(e.target.files[0]);
        imageSpace.style.backgroundImage = "url(" + myImage + ")";

        this.setState({ image: e.target.files[0] });
    }

    selectPostType() {
        const NewStyle = "background: #42B5BC"
        const DefaultStyle = "background: #797979"

        const EventCheck = document.getElementById("checkPostEvento");
        const VagaCheck = document.getElementById("CheckPostVaga");

        const EventOp = document.getElementById("optionEvento");
        const VagaOp = document.getElementById("optionVaga");

        if (EventCheck.checked == true) {
            EventOp.style.cssText = NewStyle;
        } else {
            EventOp.style.cssText = DefaultStyle;
        }
        if (VagaCheck.checked == true) {
            VagaOp.style.cssText = NewStyle;
        } else {
            VagaOp.style.cssText = DefaultStyle;
        }
    }

    render() {
        return (
            <PostManager onSubmit={this.handleSubmit}>
                <NewPostContainer>
                    <Icons>
                        <div>
                            <Link to="/profile" className="Link">
                                <div style={{ backgroundImage: "url(" + this.state.imageProfile + ")" }}></div>
                            </Link>
                        </div>

                        <label onClick={this.selectPostType} id="optionEvento" htmlFor="checkPostEvento">
                            <input type="radio" id="checkPostEvento" name="option" />
                            <img src={IconEvent} alt="Postar Evento" />
                        </label>
                        <span>EVENTO</span>

                        <label onClick={this.selectPostType} id="optionVaga" htmlFor="CheckPostVaga">
                            <input type="radio" id="CheckPostVaga" name="option" />
                            <img src={IconVaga} alt="Postar Vaga" />
                        </label>
                        <span>VAGA</span>
                    </Icons>

                    <PostForm>
                        <div id="postimage">
                            <input
                                onChange={this.handleImageChange}
                                id="perfil"
                                type="file"
                                required
                            />
                            <label htmlFor="perfil">
                                <img className="imgIcon" src={Cam} />
                            </label>
                        </div>
                        <div>
                            <input
                                placeholder="TITULO DA POSTAGEM"
                                type="text"
                                onChange={this.handleInputChange}
                                value={this.state.postTitle}
                                name="postTitle"
                                required
                            />
                            <textarea
                                placeholder="Descrição"
                                type="text"
                                onChange={this.handleInputChange}
                                value={this.state.description}
                                name="description"
                                maxLength="620"
                                required
                            />
                            <hr />
                            <section>
                                <input
                                    onChange={this.handleInputChange}
                                    value={this.state.placeEvent}
                                    placeholder="Local"
                                    type="text"
                                    name="placeEvent"
                                    required
                                />
                                <input
                                    onChange={this.handleInputChange}
                                    value={this.state.date}
                                    type="date"
                                    name="date"
                                    min="2019-11-27"
                                    required
                                />
                            </section>
                        </div>
                    </PostForm>

                </NewPostContainer>
                <button className="postar">POSTAR</button>
            </PostManager>
        );
    }
}