import React, { useState } from 'react'
import { GobletSVG } from '_common/svgs'

const Info = () => (
  <header className="text-center w-full">
    <h1 className="text-5xl tracking-widest text-white py-4 bg-gray-700">
      Goblet Of Fire Polls 1994
    </h1>
    <h3 className="text-2xl text-center my-8 text-gray-400 font-thin w-4/6 mx-auto">
      Goblet of fire at 1994 Triwizard Tournament was bewitched, it could have
      been avoided if it was on BlockChain. Vote for the champion of the
      tournament.
    </h3>
    <h4 className="text-center text-4xl mb-6 text-gray-500 font-bold">
      Drag the parchment into the Goblet of Fire
    </h4>
  </header>
)
const PaperParchment = ({
  candidateName,
  candidateSchool,
  candidateID,
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
    onDragEnd={onEndParchmentDrag}>
    {candidateName}
    <br />
    <p className="text-sm text-center">{candidateSchool}</p>
  </div>
)

const Parchments = ({
  candidates,
  parchmentInDrag,
  onStartParchmentDrag,
  onEndParchmentDrag,
}) => {
  return (
    <div className="flex flex-row items-center justify-around">
      {candidates.map(candidate => (
        <PaperParchment
          key={candidate.candidateID}
          candidateID={candidate.candidateID}
          candidateName={candidate.candidateName}
          candidateSchool={candidate.candidateSchool}
          parchmentInDrag={parchmentInDrag}
          onStartParchmentDrag={onStartParchmentDrag}
          onEndParchmentDrag={onEndParchmentDrag}
        />
      ))}
    </div>
  )
}

const GobletOfFire = ({
  onParchmentEnterGoblet,
  onParchmentOverGoblet,
  onParchmentLeaveGoblet,
  onParchmentDropInGoblet,
  isGobletFireInRed,
}) => (
  <div
    className="w-auto mt-6"
    onDragEnter={onParchmentEnterGoblet}
    onDragOver={onParchmentOverGoblet}
    onDragLeave={onParchmentLeaveGoblet}
    onDrop={onParchmentDropInGoblet}>
    <GobletSVG isGobletFireInRed={isGobletFireInRed} />
  </div>
)

const Home = () => {
  const [isGobletFireInRed, setGobletFireToRed] = useState(false)
  const [parchmentInDrag, setParchmentInDrag] = useState(0)

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

  const candidates = [
    {
      candidateID: '1',
      candidateName: 'Cedric Diggory',
      candidateSchool: 'Hogwarts School',
    },
    {
      candidateID: '2',
      candidateName: 'Fleur Delacour',
      candidateSchool: 'Beauxbatons Academy of Magic',
    },
    {
      candidateID: '3',
      candidateName: 'Viktor Krum',
      candidateSchool: 'Durmstrang Institute',
    },
  ]

  return (
    <main className="flex flex-col justify-center items-center">
      <Info />
      <Parchments
        candidates={candidates}
        onStartParchmentDrag={onStartParchmentDrag}
        onEndParchmentDrag={onEndParchmentDrag}
        parchmentInDrag={parchmentInDrag}
      />
      <GobletOfFire
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
