class ConnectForm extends React.Component {

    render() {
        return (
            <form onSubmit={this.connect.bind(this)}>
                <label htmlFor="user">User: </label>
                <input id="user" ref="user" type="text" />
                <input type="submit" value="Connect"/>
            </form>
        )
    }

    connect(e) {
        e.preventDefault();
        let user = React.findDOMNode(this.refs.user).value.trim();
        this.props.onConnect(user);
    }
}

class Video extends React.Component {
    constructor(){
        this.state = {video: null, call: this.props.call};
    }
    render(){
        if(this.state.call) {
            this.state.call.on('stream', stream => {
                let video = URL.createObjectURL(stream);
                this.setState({video});
            });
        }

        return (
            <div>
                {this.props.call ? (
                    <video src={this.state.video} autoplay></video>
                ) :
                <form onSubmit={this.callPeer.bind(this)}>
                    <input type="text" ref="peerId"/>
                    <input type="submit" value="Call" />
                </form>
                }
            </div>
        )
    }

    callPeer(e) {
        e.preventDefault();
        let peerId = React.findDOMNode(this.refs.peerId).value;
        let call = this.props.callPeer(peerId);

        call.on('stream', stream => {
            console.log('Video component call on stream');
            let video = URL.createObjectURL(stream);
            this.setState({video});
        })
    }

}


class VideoChat extends React.Component {
    constructor() {
        this.state = {myId: '', peer: null, call: null, myStream: null}
    }

    onConnect(user) {

        let myStream;
        let peer =  new Peer({key: 's5lw9do7zht1emi'});
        this.setState({peer});

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.getUserMedia({ audio: true, video: true }, stream => {
            this.setState({myStream: stream});
        }, err => {
            console.log('There was an error. Surprise surprise.');
        });

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

        peer.on('call', call => {
            console.log('peer.on call', this.state.myStream);
            call.answer(this.state.myStream);
            this.setState({call});
        })

    }

    makeCall(peerId){
        console.log('makeCall this.state.myStream', this.state.myStream);
        let call = this.state.peer.call(peerId, this.state.myStream);
        this.setState({call});
        return call;
    }

    render() {

        return (
            <div>
                {this.state.myId ? (
                    <div>
                        <h1>{this.state.myId}</h1>
                        <Video callPeer= {this.makeCall.bind(this)} call={this.state.call} />
                    </div>
                ) :
                    <ConnectForm onConnect={this.onConnect.bind(this)}/>
                }
            </div>
        )

    }
}

React.render(<VideoChat />, document.body);
