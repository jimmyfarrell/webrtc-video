class ConnectForm extends React.Component {

    render() {
        return (
            <form onSubmit={this.connect.bind(this)}>
                <label htmlFor="user">User: </label>
                <input id="user" ref="user" type="text" />
                <input type="submit" value="Connect"/>
            </form>
        );
    }

    connect(e) {
        e.preventDefault();
        let user = React.findDOMNode(this.refs.user).value.trim();
        this.props.onConnect(user);
    }
}

class Video extends React.Component {
    constructor(){
        this.state = {video: null, call: null};
    }

    showVideo(stream) {
        let video = URL.createObjectURL(stream);
        this.setState({video});
    }

    render(){
        let peer = this.props.peer;

        peer.on('call', call => {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            navigator.getUserMedia(
                { audio: true, video: true },
                stream => {
                    call.answer(stream);
                    this.setState({call});
                },
                err => {
                    console.log('There was an error. Surprise surprise.');
                }
            );
        });

        if (this.state.call) {
            this.state.call.on('stream', stream => {
                this.showVideo(stream);
            });
        }

        return (
            <div>
                {this.state.call ? (
                    <video src={this.state.video} autoPlay></video>
                ) :
                <form onSubmit={this.callPeer.bind(this)}>
                    <input type="text" ref="peerId"/>
                    <input type="submit" value="Call" />
                </form>
                }
            </div>
        );
    }

    callPeer(e) {
        e.preventDefault();
        let peerId = React.findDOMNode(this.refs.peerId).value;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.getUserMedia(
            { audio: true, video: true },
            stream => {
                let call = this.props.peer.call(peerId, stream);
                this.setState({call});
            },
            err => {
                console.log('There was an error. Surprise surprise.');
            }
        );
    }

}


class VideoChat extends React.Component {
    constructor() {
        this.state = {myId: '', peer: null}
    }

    onConnect(user) {

        let peer =  new Peer({key: 's5lw9do7zht1emi'});
        this.setState({peer});

        peer.on('open', id => {
            this.setState({ myId: id });

            $.ajax({
                url: '/connect',
                type: 'POST',
                data: {user, id},
                success: data => console.log('ajax success', data),
                error: (xhr, status, err) => console.log(error)
            });
        });

    }

    render() {
        return (
            <div>
                {this.state.myId ? (
                    <div>
                        <h1>{this.state.myId}</h1>
                        <Video peer={this.state.peer} />
                    </div>
                ) :
                    <ConnectForm onConnect={this.onConnect.bind(this)}/>
                }
            </div>
        );
    }
}

React.render(<VideoChat />, document.body);
