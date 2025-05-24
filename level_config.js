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
        allowedEnemyTypes: [1,2],
        global: {
            maxEnemies: 20,
            spawnTimeWindow: 45.0,  // 30 seconds to spawn all enemies
            collisionSeparation: 2.0,
            wrapBuffer: 50,
            speedMultiplier: 1.1,
            eccentricityMultiplier: .6  // Base eccentricity
        }
    },
    2: {
        name: "1 Bravo",
        allowedEnemyTypes: [1,2],
        global: {
            maxEnemies: 27,
            spawnTimeWindow: 46.8,  // 35 seconds to spawn all enemies
            collisionSeparation: 2.2,
            wrapBuffer: 60,
            speedMultiplier: 1.21,
            eccentricityMultiplier: 1.5  // More erratic movement
        }
    },
    3: {
        name: "1 Charlie",
        allowedEnemyTypes: [1, 2, 3],
        global: {
            maxEnemies: 32,
            spawnTimeWindow: 48.7,  // 40 seconds to spawn all enemies
            collisionSeparation: 2.5,
            wrapBuffer: 70,
            speedMultiplier: 1.33,
            eccentricityMultiplier: 1.11  // Even more erratic movement
        }
    },
    4: {
        name: "1 Delta",
        allowedEnemyTypes: [1, 2, 3],
        global: {
            maxEnemies: 37,
            spawnTimeWindow: 50.6,  // 45 seconds to spawn all enemies
            collisionSeparation: 2.5,
            wrapBuffer: 70,
            speedMultiplier: 1.46,
            eccentricityMultiplier: 1.3  // Even more erratic movement
        }
    },
    5: {
        name: "1 Echo",
        allowedEnemyTypes: [1, 2, 3, 4],
        global: {
            maxEnemies: 41,
            spawnTimeWindow: 30.9,  // 50 seconds to spawn all enemies

            collisionSeparation: 3.0,
            wrapBuffer: 80,
            speedMultiplier: 1.61,
            eccentricityMultiplier: 1.47  // Maximum erratic movement
        }
    },
    6: {
        name: "1 Foxtrot",
        allowedEnemyTypes: [1, 2, 3, 4],
        global: {
            maxEnemies: 45,         // 30 * 1.1 = 33
            spawnTimeWindow: 54.7,  // 50 * 1.1 = 55 seconds to spawn all enemies
            collisionSeparation: 3.3,  // 3.0 * 1.1 = 3.3
            wrapBuffer: 88,            // 80 * 1.1 = 88
            speedMultiplier: 1.77,      // 2.0 * 1.1 = 2.2
            eccentricityMultiplier: 1.61  // 3.0 * 1.1 = 3.3 (even more chaotic movement)
        }
    },
    7: {
        name: "1 Golf",
        allowedEnemyTypes: [1, 2, 3, 4, 5],
        global: {
            maxEnemies: 48,         // 30 * 1.1 = 33
            spawnTimeWindow: 56.9,  // 50 * 1.1 = 55 seconds to spawn all enemies
            collisionSeparation: 3.3,  // 3.0 * 1.1 = 3.3
            wrapBuffer: 88,            // 80 * 1.1 = 88
            speedMultiplier: 1.95,      // 2.0 * 1.1 = 2.2
            eccentricityMultiplier: 1.75  // 3.0 * 1.1 = 3.3 (even more chaotic movement)
        }
    },
    8: {
        name: "2 Alpha",
        allowedEnemyTypes: [1, 2, 3, 4, 5],
        global: {
            maxEnemies: 51,         // 30 * 1.1 = 33
            spawnTimeWindow: 59.2,  // 50 * 1.1 = 55 seconds to spawn all enemies
            collisionSeparation: 3.3,  // 3.0 * 1.1 = 3.3
            wrapBuffer: 88,            // 80 * 1.1 = 88
            speedMultiplier: 2.14,      // 2.0 * 1.1 = 2.2
            eccentricityMultiplier: 1.88,  // 3.0 * 1.1 = 3.3 (even more chaotic movement)
            scoreBonus: 10  // Bonus points added to all enemy scores
        }
    },
    9: {
        name: "2 Bravo",
        allowedEnemyTypes: [1,2, 3, 4, 5,6],
        global: {
            maxEnemies: 54,
            spawnTimeWindow: 61.6,
            collisionSeparation: 3.6,
            wrapBuffer: 95,
            speedMultiplier: 2.35,
            eccentricityMultiplier: 2.03,
            scoreBonus: 10
        }
    },
    10: {
        name: "2 Charlie",
        allowedEnemyTypes: [1,2, 3, 4, 5,6],
        global: {
            maxEnemies: 57,
            spawnTimeWindow: 64.1,
            collisionSeparation: 3.9,
            wrapBuffer: 102,
            speedMultiplier: 2.59,
            eccentricityMultiplier: 2.20,
            scoreBonus: 10
        }
    },
    11: {
        name: "2 Delta",
        allowedEnemyTypes: [2,3, 4, 5,6],
        global: {
            maxEnemies: 60,
            spawnTimeWindow: 66.7,
            collisionSeparation: 4.2,
            wrapBuffer: 110,
            speedMultiplier: 2.85,
            eccentricityMultiplier: 2.38,
            scoreBonus: 10
        }
    },
    12: {
        name: "2 Echo",
        allowedEnemyTypes: [2,3, 4, 5, 6],
        global: {
            maxEnemies: 63,
            spawnTimeWindow: 69.4,
            collisionSeparation: 4.6,
            wrapBuffer: 118,
            speedMultiplier: 3.14,
            eccentricityMultiplier: 2.58,
            scoreBonus: 10
        }
    },
    13: {
        name: "2 Foxtrot",
        allowedEnemyTypes: [3, 4, 5, 6],
        global: {
            maxEnemies: 66,
            spawnTimeWindow: 72.2,
            collisionSeparation: 5.0,
            wrapBuffer: 125,
            speedMultiplier: 3.45,
            eccentricityMultiplier: 2.79,
            scoreBonus: 10
        }
    },
    14: {
        name: "2 Golf",
        allowedEnemyTypes: [3, 4, 5, 6],
        global: {
            maxEnemies: 69,
            spawnTimeWindow: 75.1,
            collisionSeparation: 5.5,
            wrapBuffer: 133,
            speedMultiplier: 3.80,
            eccentricityMultiplier: 3.02,
            scoreBonus: 10
        }
    }
}; 
