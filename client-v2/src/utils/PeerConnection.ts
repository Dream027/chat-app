class PeerConnection {
    public instance: RTCPeerConnection | null = null;

    constructor() {
        if (!!window) {
            this.instance = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            });
        }
    }

    public async createOffer() {
        if (!this.instance) return;
        const offer = await this.instance.createOffer();
        await this.instance.setLocalDescription(
            new RTCSessionDescription(offer)
        );
        return offer;
    }

    public async createAnswer(offer: RTCSessionDescriptionInit) {
        if (!this.instance) return;
        await this.instance.setRemoteDescription(offer);
        const answer = await this.instance.createAnswer();
        await this.instance.setLocalDescription(
            new RTCSessionDescription(answer)
        );
        return answer;
    }

    public async setLocalDescription(description: RTCSessionDescriptionInit) {
        if (!this.instance) return;
        await this.instance.setLocalDescription(
            new RTCSessionDescription(description)
        );
    }

    public async setRemoteDescription(description: RTCSessionDescriptionInit) {
        if (!this.instance) return;
        await this.instance.setRemoteDescription(
            new RTCSessionDescription(description)
        );
    }
}

export default new PeerConnection();
