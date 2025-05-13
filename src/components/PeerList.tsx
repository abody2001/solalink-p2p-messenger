import React from 'react'

type Peer = {
  address: string
  username?: string
}

type Props = {
  peers?: Peer[]
  onSelectPeer: (peer: Peer) => void
}

const PeerList: React.FC<Props> = ({ peers = [], onSelectPeer }) => {
  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">Recent Peers</h2>
      {peers.length === 0 ? (
        <div className="text-gray-500 text-sm">No peers found.</div>
      ) : (
        peers.map((peer) => (
          <div
            key={peer.address}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
            onClick={() => onSelectPeer(peer)}
          >
            <div className="font-medium">
              {peer.username || peer.address.slice(0, 6) + '...' + peer.address.slice(-4)}
            </div>
            <div className="text-xs text-gray-500">{peer.address}</div>
          </div>
        ))
      )}
    </div>
  )
}

export default PeerList;
