import React from 'react'

const Dashboard = () => {
  return (
    <div>
      <div>
        <h1>QuizZie</h1>
        <div>
            <button>Dashboard</button>
            <button>Analytics</button>
            <button>Create Quizz</button>
        </div>
        <div>
            <button>Logout</button>
        </div>
      </div>
      <div>
        <div>
            <div>Quizz created</div>
            <div>Questions created</div>
            <div>Total Impressions</div>
        </div>
        <div>
            <h1>Trending Quizs</h1>
            <div>no of boxes</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
