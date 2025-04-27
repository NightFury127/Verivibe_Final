import React from 'react';
import { Link } from 'react-router-dom';

const History = ({ history, onClear }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-5">
    <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-2xl w-full animate-[fadeIn_1s_ease-in]">
      <h1 className="text-3xl font-bold text-center mb-6">History</h1>
      {history.length === 0 ? (
        <div className="text-center text-gray-500 mb-8">No history yet.</div>
      ) : (
        <div className="max-h-96 overflow-y-auto mb-8">
          {history.map((item, idx) => (
            <div key={idx} className="mb-4 p-4 rounded-lg bg-gray-100 border-l-4 border-blue-400">
              <div className="text-xs text-gray-500 mb-1">{item.timestamp}</div>
              <div className="font-semibold mb-1">{item.text}</div>
              <div className={item.result.includes('Warning') ? 'text-red-600' : 'text-green-600'}>{item.result}</div>
              {item.confidence !== undefined && (
                <div className="mt-2 text-xs text-gray-600">Confidence: {item.confidence}%</div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between">
        <Link to="/" className="px-5 py-2 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold shadow hover:scale-105 transition-all">Back to Home</Link>
        <button onClick={onClear} className="px-5 py-2 rounded-lg bg-gradient-to-br from-red-400 to-red-600 text-white font-semibold shadow hover:scale-105 transition-all">Clear History</button>
      </div>
    </div>
  </div>
);

export default History; 