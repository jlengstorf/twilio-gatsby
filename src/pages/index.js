import React, { useEffect, useRef, useState } from "react"
import TwilioVideo from "twilio-video"

import Layout from "../components/layout"
import SEO from "../components/seo"
import StartForm from "../components/start-form"

const Video = ({ token }) => {
  const localVidRef = useRef()
  const remoteVidRef = useRef()

  useEffect(() => {
    TwilioVideo.connect(token, { video: true, audio: true, name: "test" }).then(
      room => {
        // Attach the local video
        TwilioVideo.createLocalVideoTrack().then(track => {
          localVidRef.current.appendChild(track.attach())
        })

        // Attach video for all remote participants
        room.participants.forEach(participant => {
          participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
              const track = publication.track

              remoteVidRef.current.appendChild(track.attach())
            }
          })
        })
      }
    )
  }, [token])

  return (
    <div>
      <div ref={localVidRef} />
      <div ref={remoteVidRef} />
    </div>
  )
}

const IndexPage = () => {
  const [token, setToken] = useState(false)
  return (
    <Layout>
      <SEO title="Home" />
      {!token ? <StartForm storeToken={setToken} /> : <Video token={token} />}
      <p>
        TODO: 1. Show local video 2. Connect to a room 3. Show participants’
        video (remote) 4. Handle events
      </p>
    </Layout>
  )
}

export default IndexPage
