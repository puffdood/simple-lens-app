import { useState, useEffect } from 'react'
import { client, recommendedProfiles } from '../api'
import Link from 'next/link'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const response = await client.query(recommendedProfiles).toPromise()
      setProfiles(response.data.recommendedProfiles)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <ConnectButton />
      </div>
      {profiles.map((profile, index) => (
        <Link href={`/profile/${profile.id}`} key={`${profile.id}`}>
          <a>
            <div>
              {profile.picture?.original?.url ? (
                <Image
                  src={profile.picture.original.url}
                  width="60px"
                  height="60px"
                />
              ) : (
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'white',
                  }}
                />
              )}
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}
