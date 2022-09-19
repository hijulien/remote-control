import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';
import './App.css';

const App = () => {

  const [data, setData] = useState({
    peer: {},
    mediaChan: null,
    dataChan: null
  })

  const hangUp = () => {
    window.location.reload()
  }

  useEffect(() => {
    const peer = new Peer('wir001', {
      host: '124.222.249.224',
      port: '9000',
      path: '/myapp'
    });

    peer.on('open', (id) => {
      console.log("open");
      setData(data => {
        return {
          ...data,
          peer: peer
        }
      });
    });

    peer.on('connection', (conn) => {
      // console.log("远程请求建立数据连接");
      setData(data => {
        return {
          ...data,
          dataChan: conn
        }
      });
      conn.on('data', (msg) => {
        if(msg.type === 'key'){
          window.electronAPI.keyEvent(msg)
        } else {
          window.electronAPI.mouseEvent(msg)
        }
      });
      conn.on('close', () => {
        // console.log("远程挂断");
        window.location.reload();
      })
    });

    peer.on('call', (call) => {
      // console.log("远程请求建立媒体连接");
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          cursor: "never",
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: "screen:0:0",
          }
        }
      })
        .then(stream => {
          call.answer(stream);
          setData(data => {
            return {
              ...data,
              mediaChan: call
            }
          });
        })
        .catch(e => {
          console.log(e);
        })
    });
  }, [])

  return (
    <>
      <h1>{data.dataChan && data.mediaChan ? "通话中" : "待机中"}</h1>
      <div className="col">
        <p>本地ID:{data.peer._id}</p>
        <p>远程ID:{data.mediaChan ? data.mediaChan.peer : ""}</p>
        <button onClick={hangUp}>挂断</button>
      </div>
    </>
  );
}

export default App;