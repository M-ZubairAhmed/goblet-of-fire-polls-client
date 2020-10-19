import React, { useEffect, useRef, useState } from 'react'
import Web3 from 'web3'

import ElectionABI from '_abi/Election.json'
import { GobletSVG } from '_common/svgs'

const NavBar = ({ isWalletConnected = false }) => (
  <header className="text-center w-full flex flex-col">
    <div className="flex flex-col bg-gray-700 py-4 px-4">
      <h1 className="text-5xl tracking-widest text-white py-4">
        Goblet Of Fire Polls 1994
      </h1>
      <nav className="text-right">
        <div
          className={`text-white font-bold py-2 px-4 
          rounded-full transition duration-200 ease-linear font-sans`}>
          <span
            className={`w-3 h-3 rounded-full ${
              isWalletConnected ? 'bg-green-400' : 'bg-gray-400'
            } inline-block mr-3`}
          />
          {isWalletConnected ? 'Connected' : 'Disconnected'}
        </div>
      </nav>
    </div>
  </header>
)

const Info = () => (
  <article>
    <h3 className="text-2xl text-center my-8 text-gray-400 font-thin w-4/6 mx-auto">
      Goblet of fire at 1994 Triwizard Tournament was bewitched, it could have
      been avoided if it was on BlockChain. Vote for the champion of the
      tournament.
    </h3>
    <h4 className="text-center text-4xl mb-6 text-gray-500 font-bold">
      Drag the parchment into the Goblet of Fire
    </h4>
  </article>
)

const PaperParchment = ({
  candidateID,
  candidateName,
  candidateSchool,
  candidateVotes,
  showVotesCount,
  parchmentInDrag,
  onStartParchmentDrag,
  onEndParchmentDrag,
}) => (
  <div
    className={`flex justify-center flex-col w-64 h-32 bg-yellow-200 text-gray-700 items-center 
  text-2xl relative parchment font-bold cursor-move select-none mx-6 hover:bg-yellow-100
  transition duration-200 ease-in-out ${
    parchmentInDrag === candidateID ? 'opacity-0' : ''
  }`}
    draggable
    onDragStart={() => onStartParchmentDrag(candidateID)}
    onDragEnd={onEndParchmentDrag}
    title={`Drag ${candidateName}'s name into the goblet of fire`}>
    <h4>{candidateName}</h4>
    <p className="text-sm text-center">{candidateSchool}</p>
    {showVotesCount && <h2 className="text-4xl">{candidateVotes}</h2>}
  </div>
)

const Parchments = ({
  candidates,
  showVotesCount,
  parchmentInDrag,
  onStartParchmentDrag,
  onEndParchmentDrag,
}) => {
  return (
    <div className="flex flex-row items-center justify-around">
      {candidates.map(candidate => (
        <PaperParchment
          key={candidate.id}
          candidateID={candidate.id}
          candidateName={candidate.name}
          candidateSchool={candidate.school}
          candidateVotes={candidate.votes}
          showVotesCount={showVotesCount}
          parchmentInDrag={parchmentInDrag}
          onStartParchmentDrag={onStartParchmentDrag}
          onEndParchmentDrag={onEndParchmentDrag}
        />
      ))}
    </div>
  )
}

const GobletOfFire = ({
  candidates = [],
  onParchmentEnterGoblet,
  onParchmentOverGoblet,
  onParchmentLeaveGoblet,
  onParchmentDropInGoblet,
  isGobletFireInRed,
}) => {
  if (candidates.length === 0) {
    return null
  }

  return (
    <div
      className="w-auto mt-6"
      onDragEnter={onParchmentEnterGoblet}
      onDragOver={onParchmentOverGoblet}
      onDragLeave={onParchmentLeaveGoblet}
      onDrop={onParchmentDropInGoblet}>
      <GobletSVG isGobletFireInRed={isGobletFireInRed} />
    </div>
  )
}

const Home = () => {
  const [isGobletFireInRed, setGobletFireToRed] = useState(false)
  const [parchmentInDrag, setParchmentInDrag] = useState(0)

  const web3 = useRef()
  const electionContract = useRef()
  const [isWalletConnected, setWalletConnectionTo] = useState(false)
  const [userAccount, setUserAccount] = useState(null)

  const [candidates, setCandidates] = useState([])
  const [showVotesCount, setShowVotesTo] = useState(false)

  function onStartParchmentDrag(candidateID) {
    setParchmentInDrag(candidateID)
  }

  function onEndParchmentDrag() {
    setParchmentInDrag(0)
  }

  function onParchmentEnterGoblet() {
    setGobletFireToRed(true)
  }

  function onParchmentOverGoblet(event) {
    event.preventDefault()
  }

  function onParchmentLeaveGoblet() {
    setGobletFireToRed(false)
  }

  function onParchmentDropInGoblet() {
    setGobletFireToRed(false)
    console.log('ok')
  }

  async function activateWeb3() {
    // modern browsers
    if (window && window.ethereum) {
      try {
        // request for accound access prompt
        await window.ethereum.enable()

        const web3 = new Web3(window.ethereum)
        return web3
      } catch (err) {
        // user denied account access
        console.error('User denied connection', err)
        return null
      }
    }

    // legacy browsers
    if (window && window.web3) {
      const web3 = new Web3(web3.currentProvider)
      return web3
    }

    // unsupported browsers
    console.error('Unsupported browsers')
    return null
  }

  async function getAllCandidates() {
    const numberOfCandidates = await electionContract.current.methods
      .numberOfCandidates()
      .call()

    if (numberOfCandidates !== 0) {
      let candidates = []
      for (
        let candidateIndex = 1;
        candidateIndex <= numberOfCandidates;
        candidateIndex++
      ) {
        const candidateData = await electionContract.current.methods
          .candidates(candidateIndex)
          .call()

        const candidate = {
          id: candidateData.id,
          name: candidateData.name,
          school: candidateData.school,
          votes: candidateData.votes,
        }

        candidates.push(candidate)
      }

      setCandidates(candidates)
    } else {
      console.error('No candidates')
    }
  }

  async function getBlockChainInitData() {
    const account = await web3.current.eth.getAccounts()

    const userAccount = account[0]
    setUserAccount(userAccount)

    const networkID = await web3.current.eth.net.getId()
    const networkData = ElectionABI.networks[networkID]
    if (networkData) {
      electionContract.current = new web3.current.eth.Contract(
        ElectionABI.abi,
        networkData.address,
      )

      await getAllCandidates()
    } else {
      // Contract not found in the network
      console.error('Contract not found on the given network')
    }
  }

  async function loadBlockChain() {
    const activatedWeb3 = await activateWeb3()

    // if wallet connected
    if (activatedWeb3 !== null) {
      web3.current = activatedWeb3
      setWalletConnectionTo(true)

      await getBlockChainInitData()
    } else {
      // wallet not connected
      setWalletConnectionTo(false)
    }
  }

  useEffect(() => {
    loadBlockChain()
  }, [])

  return (
    <main className="flex flex-col justify-center items-center">
      <NavBar isWalletConnected={isWalletConnected} />
      <Info />
      <Parchments
        candidates={candidates}
        showVotesCount={showVotesCount}
        onStartParchmentDrag={onStartParchmentDrag}
        onEndParchmentDrag={onEndParchmentDrag}
        parchmentInDrag={parchmentInDrag}
      />
      <GobletOfFire
        candidates={candidates}
        onParchmentEnterGoblet={onParchmentEnterGoblet}
        onParchmentOverGoblet={onParchmentOverGoblet}
        onParchmentLeaveGoblet={onParchmentLeaveGoblet}
        onParchmentDropInGoblet={onParchmentDropInGoblet}
        isGobletFireInRed={isGobletFireInRed}
      />
    </main>
  )
}

export default Home
