// High Score Management System
class HighScoreManager {
    constructor() {
        this.maxEntries = 10;
        this.maxNameLength = 8;
        this.storageKey = 'stellarDefenseHighScores';
        this.scores = this.loadScores();
    }
    
    // Load high scores from localStorage
    loadScores() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const scores = JSON.parse(stored);
                // Validate the data structure
                if (Array.isArray(scores) && scores.every(score => 
                    score.hasOwnProperty('name') && 
                    score.hasOwnProperty('score') && 
                    score.hasOwnProperty('level') &&
                    score.hasOwnProperty('date')
                )) {
                    return scores;
                }
            }
        } catch (error) {
            console.warn('Error loading high scores:', error);
        }
        
        // Return default empty scores if loading fails
        return this.getDefaultScores();
    }
    
    // Save high scores to localStorage
    saveScores() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
            return true;
        } catch (error) {
            console.warn('Error saving high scores:', error);
            return false;
        }
    }
    
    // Get default high scores structure
    getDefaultScores() {
        return [];
    }
    
    // Check if a score qualifies for the high score table
    isHighScore(score) {
        if (this.scores.length < this.maxEntries) {
            return true;
        }
        return score > this.scores[this.scores.length - 1].score;
    }
    
    // Add a new high score entry
    addScore(name, score, level) {
        // Validate and sanitize the name
        name = this.sanitizeName(name);
        
        const newEntry = {
            name: name,
            score: parseInt(score),
            level: parseInt(level),
            date: new Date().toISOString()
        };
        
        // Check if this exact entry already exists (prevent duplicates)
        const existingEntry = this.scores.find(entry => 
            entry.name === name && 
            entry.score === newEntry.score && 
            entry.level === newEntry.level
        );
        
        if (existingEntry) {
            console.warn('Duplicate high score entry prevented:', newEntry);
            // Return the rank of the existing entry instead
            return this.scores.indexOf(existingEntry) + 1;
        }
        
        // Add the new score
        this.scores.push(newEntry);
        
        // Sort by score (descending) and then by level (descending) as tiebreaker
        this.scores.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.level - a.level;
        });
        
        // Keep only top entries
        if (this.scores.length > this.maxEntries) {
            this.scores = this.scores.slice(0, this.maxEntries);
        }
        
        // Save to localStorage
        this.saveScores();
        
        // Return the rank of the new entry (1-based index)
        const rank = this.scores.findIndex(entry => 
            entry.name === name && 
            entry.score === newEntry.score && 
            entry.level === newEntry.level &&
            entry.date === newEntry.date
        ) + 1;
        
        console.log('High score added:', newEntry, 'Rank:', rank);
        return rank;
    }
    
    // Sanitize player name input
    sanitizeName(name) {
        if (!name || typeof name !== 'string') {
            return 'PLAYER';
        }
        
        // Remove unwanted characters and limit length
        return name
            .toUpperCase()
            .replace(/[^A-Z0-9\s\-\_]/g, '')
            .substring(0, this.maxNameLength)
            .trim() || 'PLAYER';
    }
    
    // Get all high scores
    getScores() {
        return [...this.scores]; // Return a copy to prevent external modification
    }
    
    // Get a specific high score by rank (1-based)
    getScore(rank) {
        if (rank < 1 || rank > this.scores.length) {
            return null;
        }
        return this.scores[rank - 1];
    }
    
    // Clear all high scores
    clearScores() {
        this.scores = [];
        this.saveScores();
    }
    
    // Format score for display
    formatScore(score) {
        return score.toString().padStart(6, '0');
    }
    
    // Format date for display
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: '2-digit'
            });
        } catch (error) {
            return 'N/A';
        }
    }
    
    // Generate high scores table HTML
    generateScoresTableHTML() {
        if (this.scores.length === 0) {
            return `
                <div class="no-scores">
                    <p>No high scores yet!</p>
                    <p>Be the first to set a record!</p>
                </div>
            `;
        }
        
        let html = `
            <table class="high-scores-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Level</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        this.scores.forEach((entry, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            
            html += `
                <tr class="score-entry ${rankClass}">
                    <td class="rank">${rank}</td>
                    <td class="name">${entry.name}</td>
                    <td class="score">${this.formatScore(entry.score)}</td>
                    <td class="level">${entry.level}</td>
                    <td class="date">${this.formatDate(entry.date)}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    }
    
    // Show high score entry form
    showHighScoreEntry(score, level, onComplete) {
        const overlay = document.getElementById('highScoreEntryOverlay');
        const scoreDisplay = document.getElementById('newHighScore');
        const levelDisplay = document.getElementById('newHighLevel');
        const nameInput = document.getElementById('playerNameInput');
        const submitBtn = document.getElementById('submitHighScore');
        const skipBtn = document.getElementById('skipHighScore');
        
        // Update displays
        scoreDisplay.textContent = this.formatScore(score);
        levelDisplay.textContent = level;
        nameInput.value = '';
        nameInput.focus();
        
        // Show overlay
        overlay.classList.add('active');
        
        // Handle form submission
        const handleSubmit = () => {
            const playerName = nameInput.value || 'PLAYER';
            const rank = this.addScore(playerName, score, level);
            overlay.classList.remove('active');
            if (onComplete) {
                onComplete(true, rank);
            }
            cleanup();
        };
        
        // Handle skip
        const handleSkip = () => {
            overlay.classList.remove('active');
            if (onComplete) {
                onComplete(false, null);
            }
            cleanup();
        };
        
        // Handle enter key in input
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            } else if (e.key === 'Escape') {
                handleSkip();
            }
        };
        
        // Cleanup event listeners
        const cleanup = () => {
            submitBtn.removeEventListener('click', handleSubmit);
            skipBtn.removeEventListener('click', handleSkip);
            nameInput.removeEventListener('keypress', handleKeyPress);
        };
        
        // Add event listeners
        submitBtn.addEventListener('click', handleSubmit);
        skipBtn.addEventListener('click', handleSkip);
        nameInput.addEventListener('keypress', handleKeyPress);
        
        // Limit input length
        nameInput.addEventListener('input', (e) => {
            if (e.target.value.length > this.maxNameLength) {
                e.target.value = e.target.value.substring(0, this.maxNameLength);
            }
        });
    }
    
    // Show high scores table
    showHighScores(onClose) {
        const overlay = document.getElementById('highScoresOverlay');
        const tableContainer = document.getElementById('highScoresTable');
        const closeBtn = document.getElementById('closeHighScores');
        
        // Update table content
        tableContainer.innerHTML = this.generateScoresTableHTML();
        
        // Show overlay
        overlay.classList.add('active');
        
        // Handle close
        const handleClose = () => {
            overlay.classList.remove('active');
            if (onClose) {
                onClose();
            }
            cleanup();
        };
        
        // Handle escape key
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        
        // Cleanup event listeners
        const cleanup = () => {
            closeBtn.removeEventListener('click', handleClose);
            document.removeEventListener('keypress', handleKeyPress);
        };
        
        // Add event listeners
        closeBtn.addEventListener('click', handleClose);
        document.addEventListener('keypress', handleKeyPress);
    }
}

// Export for use in main game file
window.HighScoreManager = HighScoreManager; 