import React from 'react'
import { Message } from '../types/message'

type Props = {
  messages: Message[]
  currentWallet: string
}

const MessageList: React.FC<Props> = ({ messages, currentWallet }) => {
  return (
    <div className="space-y-3 p-4 h-64 overflow-y-auto border rounded bg-white">
      {messages.length === 0 ? (
        <div className="text-gray-400 italic">No messages yet.</div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender === currentWallet
                ? 'bg-blue-100 text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            <div className="font-semibold text-sm mb-1">
              {msg.sender === currentWallet ? 'You' : msg.senderUsername || 'User'}
            </div>
            <div className="text-sm">{msg.content}</div>
            {msg.fileUrl && (
              <a
                href={msg.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-xs block mt-1"
              >
                📎 {msg.fileName}
              </a>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MessageList;
