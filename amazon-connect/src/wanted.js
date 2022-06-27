import React, { useEffect, useRef } from 'react';
import 'amazon-connect-streams';
const connect = window.connect;

function App() {
    const containerRef = useRef(null);
    // const instanceURL = 'https://my-instance-domain.awsapps.com/connect/ccp-v2/';
    // auto login and redirect to real `instanceURL`
    const autoInsURL = 'https://instance.custom.com/path/to/login/and/get/instanceUrl'

    function init() {
        // skip initCCP 
        // connect.core.initCCP(containerRef.current, {
        //     ccpUrl: instanceURL,            // REQUIRED
        //     loginPopup: true,               // optional, defaults to `true`
        //     loginPopupAutoClose: true,      // optional, defaults to `false`
        //     loginOptions: {                 // optional, if provided opens login in new window
        //         autoClose: true,              // optional, defaults to `false`
        //         height: 600,                  // optional, defaults to 578
        //         width: 400,                   // optional, defaults to 433
        //         top: 0,                       // optional, defaults to 0
        //         left: 0                       // optional, defaults to 0
        //     },
        //     region: "eu-west-2",         // REQUIRED for `CHAT`, optional otherwise
        //     softphone: {                    // optional, defaults below apply if not provided
        //         allowFramedSoftphone: true,   // optional, defaults to false
        //         disableRingtone: false,       // optional, defaults to false
        //         ringtoneUrl: "./ringtone.mp3" // optional, defaults to CCP’s default ringtone if a falsy value is set
        //     },
        //     pageOptions: { //optional
        //         enableAudioDeviceSettings: false, //optional, defaults to 'false'
        //         enablePhoneTypeSettings: true //optional, defaults to 'true'
        //     },
        //     ccpAckTimeout: 5000, //optional, defaults to 3000 (ms)
        //     ccpSynTimeout: 3000, //optional, defaults to 1000 (ms)
        //     ccpLoadTimeout: 10000 //optional, defaults to 5000 (ms)
        // });
        // manual init from autoInsURL in iframe
        // https://github.com/amazon-connect/amazon-connect-streams/blob/master/src/core.js#L863 
        // connect.contact(subscribeToContactEvents);
    }
    // get agent status
    function getAgent() {
        var agent = new connect.Agent();
        console.log("agent status::::::", agent.getStatus());
        console.log("agent name::::::", agent.getName());
    }
    function outbound(phoneNumber) {
        var endpoint = connect.Endpoint.byPhoneNumber("+44" + phoneNumber);
        var agent = new connect.Agent();
        //var queueArn = "arn:aws:connect:<REGION>:<ACCOUNT_ID>:instance/<CONNECT_INSTANCE_ID>/queue/<CONNECT_QUEUE_ID>";

        agent.connect(endpoint, {
            //queueARN: queueArn,
            success: function () { console.log("outbound call connected"); },
            failure: function (err) {
                console.log("outbound call connection failed");
                console.log(err);
            }
        });
    }

    var c;
    function subscribeToContactEvents(contact) {
        c = contact;
        console.log("Subscribing to events for contact");
        contact.onConnected(handleContactConnected);
        contact.onEnded(handleContactEnded);
    }

    function handleContactConnected(contact) {
        if (contact) {
            console.log("[contact.onConnected] Contact connected to agent. Contact state is " + contact.getStatus().type);
        } else {
            console.log("[contact.onConnected] Contact connected to agent. Null contact passed to event handler");
        }
    }

    function handleContactEnded(contact) {
        if (contact) {
            console.log("[contact.onEnded] Contact has ended. Contact state is " + contact.getStatus().type);
            //contact.clear();
        } else {
            console.log("[contact.onEnded] Contact has ended. Null contact passed to event handler");
        }
    }

    function disconnectContact() {
        //cannot do contact.destroy(), can only destroy (hang-up) agent connection
        c.getAgentConnection().destroy({
            success: function () {
                console.log("Disconnected contact via Streams");
            },
            failure: function () {
                console.log("Failed to disconnect contact via Streams");
            }
        });
    }

    useEffect(() => {
        if (containerRef.current) {
            init();
        }
    })

    return (
        <>
            <button onClick={() => {
                outbound('8707460424')
            }}> Make call</button>
            <button onClick={disconnectContact}>Call off</button>
            <div id="container-div" ref={containerRef} style={{ width: '300px', height: '500px' }}>
                <iframe src={autoInsURL} allow="microphone; autoplay" title="Amazon Connect CCP" name="amazon-connect-CCP-login" width={'100%'} height={'100%'}></iframe>
            </div>
        </>
    );
}

export default App;
