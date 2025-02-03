import React, { useState, useEffect } from 'react';

// Simple timer and meditation sound app with session records
const MeditationApp = () => {
  const [timeLeft, setTimeLeft] = useState(300); // Time in seconds (5 minutes)
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio('path_to_your_meditation_sound.mp3'));
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Load records from localStorage if available
    const savedRecords = JSON.parse(localStorage.getItem('meditationRecords'));
    if (savedRecords) {
      setRecords(savedRecords);
    }

    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsPlaying(true);
      audio.play(); // Play sound when timer finishes
      saveRecord(); // Save record when session finishes
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, audio]);

  const startTimer = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(300); // Reset to 5 minutes
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const saveRecord = () => {
    const newRecord = {
      date: new Date().toLocaleString(),
      duration: 300 - timeLeft, // Save the actual meditation time
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    localStorage.setItem('meditationRecords', JSON.stringify(updatedRecords)); // Save records to localStorage
  };

  return (
    <div className="meditation-app">
      <h1>Meditation Timer</h1>
      <div className="timer">
        <p>{formatTime(timeLeft)}</p>
      </div>
      <div className="controls">
        {!isActive && timeLeft === 0 ? (
          <button onClick={resetTimer}>Start a New Session</button>
        ) : (
          <button onClick={startTimer} disabled={isActive}>
            Start Meditation
          </button>
        )}
        {isActive && timeLeft > 0 && (
          <button onClick={resetTimer}>Reset Timer</button>
        )}
      </div>
      <div className="audio-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? 'Pause Sound' : 'Play Sound'}
        </button>
      </div>

      <div className="session-records">
        <h2>Session Records</h2>
        {records.length > 0 ? (
          <ul>
            {records.map((record, index) => (
              <li key={index}>
                {record.date} - Duration: {formatTime(record.duration)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No records yet. Start a meditation session!</p>
        )}
      </div>
    </div>
  );
};

export default MeditationApp;
