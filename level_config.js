/**
 * Level configuration object that defines the behavior and parameters for each game level.
 * Each level has a unique configuration for different enemy types and global settings.
 * 
 * Structure:
 * {
 *   [levelNumber]: {
 *     name: string,              // Display name of the level (e.g. "1 Alpha")
 *     allowedEnemyTypes: number[], // Array of allowed enemy types (1, 2, 3)
 *     global: {                  // Global level settings
 *       maxEnemies: number,      // Maximum number of enemies allowed in the level
 *       spawnTimeWindow: number, // Time window in seconds to spawn all enemies
 *       collisionSeparation: number, // Force applied to separate colliding enemies
 *       wrapBuffer: number,      // Distance from top before enemies wrap around
 *       speedMultiplier: number, // Multiplier applied to all enemy speeds
 *       eccentricityMultiplier: number // Multiplier for enemy direction change probability
 *     }
 *   }
 * }
 */
const levelConfigs = {
    1: {
        name: "1 Alfa",
        allowedEnemyTypes: [1, 2],
        global: {
            maxEnemies: 20,
            spawnTimeWindow: 35.0,
            collisionSeparation: 2.0,
            wrapBuffer: 50,
            speedMultiplier: 1.02,
            eccentricityMultiplier: 1.0
        }
    },
    2: {
        name: "1 Bravo",
        allowedEnemyTypes: [1, 2],
        global: {
            maxEnemies: 27,
            spawnTimeWindow: 40.0,
            collisionSeparation: 2.2,
            wrapBuffer: 60,
            speedMultiplier: 1.24,
            eccentricityMultiplier: 1.29
        }
    },
    3: {
        name: "1 Charlie",
        allowedEnemyTypes: [1, 2, 3],
        global: {
            maxEnemies: 32,
            spawnTimeWindow: 43.8,
            collisionSeparation: 2.4,
            wrapBuffer: 70,
            speedMultiplier: 1.4,
            eccentricityMultiplier: 1.31
        }
    },
    4: {
        name: "1 Delta",
        allowedEnemyTypes: [1, 2, 3],
        global: {
            maxEnemies: 37,
            spawnTimeWindow: 47.0,
            collisionSeparation: 2.6,
            wrapBuffer: 70,
            speedMultiplier: 1.54,
            eccentricityMultiplier: 1.5
        }
    },
    5: {
        name: "1 Echo",
        allowedEnemyTypes: [1, 2, 3, 4],
        global: {
            maxEnemies: 41,
            spawnTimeWindow: 49.8,
            collisionSeparation: 2.8,
            wrapBuffer: 80,
            speedMultiplier: 1.66,
            eccentricityMultiplier: 1.67
        }
    },
    6: {
        name: "1 Foxtrot",
        allowedEnemyTypes: [1, 2, 3, 4],
        global: {
            maxEnemies: 45,
            spawnTimeWindow: 52.4,
            collisionSeparation: 3.0,
            wrapBuffer: 88,
            speedMultiplier: 1.77,
            eccentricityMultiplier: 1.81
        }
    },
    7: {
        name: "1 Golf",
        allowedEnemyTypes: [1, 2, 3, 4, 5],
        global: {
            maxEnemies: 48,
            spawnTimeWindow: 54.7,
            collisionSeparation: 3.2,
            wrapBuffer: 88,
            speedMultiplier: 1.88,
            eccentricityMultiplier: 1.95
        }
    },
    8: {
        name: "2 Alpha",
        allowedEnemyTypes: [1, 2, 3, 4, 5],
        global: {
            maxEnemies: 51,
            spawnTimeWindow: 56.9,
            collisionSeparation: 3.4,
            wrapBuffer: 88,
            speedMultiplier: 1.97,
            eccentricityMultiplier: 2.08,
            scoreBonus: 10
        }
    },
    9: {
        name: "2 Bravo",
        allowedEnemyTypes: [1, 2, 3, 4, 5, 6],
        global: {
            maxEnemies: 54,
            spawnTimeWindow: 59.0,
            collisionSeparation: 3.6,
            wrapBuffer: 95,
            speedMultiplier: 2.06,
            eccentricityMultiplier: 2.2,
            scoreBonus: 10
        }
    },
    10: {
        name: "2 Charlie",
        allowedEnemyTypes: [1, 2, 3, 4, 5, 6],
        global: {
            maxEnemies: 57,
            spawnTimeWindow: 60.9,
            collisionSeparation: 3.9,
            wrapBuffer: 102,
            speedMultiplier: 2.14,
            eccentricityMultiplier: 2.31,
            scoreBonus: 10
        }
    },
    11: {
        name: "2 Delta",
        allowedEnemyTypes: [1, 2, 3, 4, 5, 6, 7],
        global: {
            maxEnemies: 59,
            spawnTimeWindow: 62.8,
            collisionSeparation: 4.2,
            wrapBuffer: 110,
            speedMultiplier: 2.22,
            eccentricityMultiplier: 2.42,
            scoreBonus: 10
        }
    },
    12: {
        name: "2 Echo",
        allowedEnemyTypes: [1, 2, 3, 4, 5, 6, 7],
        global: {
            maxEnemies: 62,
            spawnTimeWindow: 64.6,
            collisionSeparation: 4.6,
            wrapBuffer: 118,
            speedMultiplier: 2.3,
            eccentricityMultiplier: 2.52,
            scoreBonus: 10
        }
    },
    13: {
        name: "2 Foxtrot",
        allowedEnemyTypes: [1, 2, 3, 4, 5, 6, 7, 8],
        global: {
            maxEnemies: 64,
            spawnTimeWindow: 66.3,
            collisionSeparation: 5.0,
            wrapBuffer: 125,
            speedMultiplier: 2.37,
            eccentricityMultiplier: 2.62,
            scoreBonus: 10
        }
    },
    14: {
        name: "2 Golf",
        allowedEnemyTypes: [1, 2, 3, 4, 5, 6, 7, 8],
        global: {
            maxEnemies: 67,
            spawnTimeWindow: 67.9,
            collisionSeparation: 5.5,
            wrapBuffer: 133,
            speedMultiplier: 2.45,
            eccentricityMultiplier: 2.92,
            scoreBonus: 10
        }
    },
    15: {
        name: "3 Alfa",
        allowedEnemyTypes: [2, 3, 4, 5, 6, 7, 8],
        global: {
            maxEnemies: 69,
            spawnTimeWindow: 69.48,
            collisionSeparation: 5.5,
            wrapBuffer: 133,
            speedMultiplier: 2.51,
            eccentricityMultiplier: 3.01,
            scoreBonus: 15
        }
    },
    16: {
        name: "3 Bravo",
        allowedEnemyTypes: [2, 3, 4, 5, 6, 7, 8],
        global: {
            maxEnemies: 71,
            spawnTimeWindow: 71.0,
            collisionSeparation: 5.51,
            wrapBuffer: 132,
            speedMultiplier: 2.58,
            eccentricityMultiplier: 3.1,
            scoreBonus: 15
        }
    },
    17: {
        name: "3 Charlie",
        allowedEnemyTypes: [3, 4, 5, 6, 7, 8],
        global: {
            maxEnemies: 73,
            spawnTimeWindow: 72.48,
            collisionSeparation: 5.0,
            wrapBuffer: 132,
            speedMultiplier: 2.64,
            eccentricityMultiplier: 4.22,
            scoreBonus: 15
        }
    }
}; 
