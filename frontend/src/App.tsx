import React, { useState } from 'react';
import { AddCandidateForm } from './components/AddCandidateForm';
import './App.css';

function App() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recruiter Dashboard</h1>
        <p className="App-subtitle">LTI Talent Tracking System</p>

        {!showAddForm ? (
          <section className="App-dashboard" aria-label="Main actions">
            <a
              href="#add-candidate"
              className="App-cta"
              onClick={(e) => {
                e.preventDefault();
                setShowAddForm(true);
              }}
            >
              Add candidate
            </a>
            <p className="App-hint">
              Add new candidates to the ATS and manage their selection process.
            </p>
          </section>
        ) : (
          <section className="App-form-section" aria-label="Add candidate">
            <AddCandidateForm
              onCancel={() => setShowAddForm(false)}
              onSuccess={() => setShowAddForm(false)}
            />
          </section>
        )}
      </header>
    </div>
  );
}

export default App;
