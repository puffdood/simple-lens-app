import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { client, getProfilesById, getPublications } from '../../api'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import Image from 'next/image'

import ABI from '../../abi.json'
import { ConnectButton } from '@rainbow-me/rainbowkit'
const address = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export default function Profile() {
  const router = useRouter()
  const { id } = router.query

  const [profile, setProfile] = useState()
  const [pubs, setPubs] = useState([])

  const { config } = usePrepareContractWrite({
    addressOrName: address,
    contractInterface: ABI,
    functionName: 'follow',
    args: [[id], [0x0]],
  })
  const {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    write: followUser,
  } = useContractWrite(config)

  useEffect(() => {
    if (id) {
      fetchProfile()
    }
  }, [id])

  const fetchProfile = async () => {
    try {
      const response = await client.query(getProfilesById, { id }).toPromise()
      console.log('response: ', response)
      console.log('profile', response.data.profiles.items[0])
      setProfile(response.data.profiles.items[0])

      const publicationData = await client
        .query(getPublications, { id })
        .toPromise()
      console.log('pubs', publicationData)
      setPubs(publicationData.data.publications.items)
    } catch (error) {
      console.log(error)
    }
  }

  if (!profile) return null

  return (
    <div>
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <ConnectButton />
      </div>
      <div>
        {profile.picture?.original?.url ? (
          <Image
            src={profile.picture.original.url}
            width="120px"
            height="120px"
          />
        ) : (
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: 'white',
            }}
          />
        )}
      </div>
      <button
        onClick={followUser}
        style={{ marginTop: '20px', marginBottom: '20px' }}
      >
        Follow user
      </button>
      {isLoading && <div>Loading...</div>}
      {isSuccess && <div>Transaction success: {JSON.stringify(data)}</div>}
      {isError && <div>Transaction error: {`${error}`}</div>}
      <div>
        <h4>{profile.handle}</h4>
        <p>{profile.bio}</p>
        <p>Followers: {profile.stats.totalFollowers}</p>
        <p>Following: {profile.stats.totalFollowing}</p>
      </div>
      <div>
        {pubs.map((pub) => (
          <div
            style={{ padding: '20px', borderTop: '1px solid #ededed' }}
            key={pub.id}
          >
            {pub.metadata.content}
          </div>
        ))}
      </div>
    </div>
  )
}
