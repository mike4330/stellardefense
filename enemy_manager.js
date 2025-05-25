// Enemy Manager - Handles all enemy-related functionality
class EnemyManager {
    constructor(canvas, ctx, soundManager, visualEffects) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.soundManager = soundManager;
        this.visualEffects = visualEffects;
        
        // Game state references
        this.enemies = [];
        this.spawnSchedule = [];
        this.nextSpawnIndex = 0;
        this.totalEnemiesCreated = 0;
        
        // Base enemy configurations
        this.enemyBaseConfig = {
            type1: {
                speedX: { min: 1.0, max: 2.5 },
                speedY: { min: 0.6, max: 1.2 },
                points: 20,
                respawnDelay: 750,
                width: 22,
                height: 22,
                directionChangeProbability: 0.001,  // 2% chance per frame
                reverseMovementProbability: 0.0  // No reverse movement
            },
            type2: {
                speedX: { min: 0.5, max: 1.5 },
                speedY: { min: 0.7, max: 1.3 },
                points: 30,
                respawnDelay: 950,
                width: 26,
                height: 26,
                directionChangeProbability: 0.002,  // 1.5% chance per frame
                reverseMovementProbability: 0.0  // No reverse movement
            },
            type3: {
                speedX: { min: 1.0, max: 2.0 },
                speedY: { min: .8, max: 1.4 },
                points: 45,
                respawnDelay: 975,
                width: 30,
                height: 30,
                directionChangeProbability: 0.004,  // 2.5% chance per frame
                reverseMovementProbability: 0.0  // No reverse movement
            },
            type4: {
                speedX: { min: 0.8, max: 1.8 },
                speedY: { min: 0.9, max: 1.5 },
                points: 60,
                respawnDelay: 1100,
                width: 32,
                height: 32,
                directionChangeProbability: 0.006,  // 3% chance per frame (more erratic)
                reverseMovementProbability: 0.003  // 0.3% chance to move backward (unique to type 4!)
            },
            type5: {
                speedX: { min: 1.2, max: 2.2 },
                speedY: { min: 1.0, max: 1.6 },
                points: 75,
                respawnDelay: 1200,
                width: 28,
                height: 28,
                directionChangeProbability: 0.008,  // 4% chance per frame (very erratic)
                reverseMovementProbability: 0.0  // No reverse movement
            },
            type6: {
                speedX: { min: 1.0, max: 2.0 },
                speedY: { min: 1.1, max: 1.7 },
                points: 90,
                respawnDelay: 1300,
                width: 34,
                height: 34,
                directionChangeProbability: 0.006,  // 3% chance per frame 
                reverseMovementProbability: 0.008  // 0.8% chance to reverse Y direction (high retrograde capability)
            }
        };
    }
    
    // Initialize enemies for a new level
    initializeLevel(levelConfig) {
        this.levelConfig = levelConfig;
        this.enemies.length = 0;
        this.totalEnemiesCreated = 0;
        this.spawnSchedule = this.generateSpawnSchedule(levelConfig);
        this.nextSpawnIndex = 0;
    }
    
    // Generate spawn schedule for the current level
    generateSpawnSchedule(levelConfig) {
        const schedule = [];
        
        for (let i = 0; i < levelConfig.global.maxEnemies; i++) {
            // Random time within the spawn window
            const randomTime = Math.random() * levelConfig.global.spawnTimeWindow;
            schedule.push({
                spawnTime: randomTime,
                spawned: false
            });
        }
        
        // Sort by spawn time so we can process chronologically
        schedule.sort((a, b) => a.spawnTime - b.spawnTime);
        
        return schedule;
    }
    
    // Create new enemy
    createEnemy(type = 1) {
        // Play spawn sound
        this.soundManager.playSpawnSound();
        
        // Determine enemy type based on level and spawn chances
        let enemyType = type;
        let config;
        
        if (type === 1) {
            // Random type selection for automatic spawning
            const allowedTypes = this.levelConfig.allowedEnemyTypes;
            
            // Randomly pick from allowed types
            enemyType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
            config = this.enemyBaseConfig[`type${enemyType}`];
        } else {
            // Specific type requested - check if it's allowed
            if (this.levelConfig.allowedEnemyTypes.includes(type)) {
                config = this.enemyBaseConfig[`type${type}`];
            } else {
                // Fallback to first allowed type
                enemyType = this.levelConfig.allowedEnemyTypes[0];
                config = this.enemyBaseConfig[`type${enemyType}`];
            }
        }
        
        // Apply level speed multiplier
        const speedMultiplier = this.levelConfig.global.speedMultiplier || 1.0;
        
        const enemy = {
            x: Math.random() * (this.canvas.width - config.width),
            y: Math.random() * -50 - 20,  // Spawn closer to top of screen
            width: config.width,
            height: config.height,
            speedX: (Math.random() * (config.speedX.max - config.speedX.min) + config.speedX.min) * speedMultiplier,
            speedY: (Math.random() * (config.speedY.max - config.speedY.min) + config.speedY.min) * speedMultiplier,
            direction: Math.random() > 0.5 ? 1 : -1,
            directionY: 1,  // Start moving downward
            alive: true,
            type: enemyType
        };
        
        // Add rotation for type 5 enemies to match their direction of travel
        if (enemyType === 5) {
            const vx = enemy.speedX * enemy.direction;
            const vy = enemy.speedY * enemy.directionY;
            enemy.rotation = Math.atan2(vy, vx) - Math.PI/2;
        }
        
        // Add force field properties for type 4 enemies
        if (enemyType === 4) {
            enemy.forceField = {
                active: false,
                nextActivationTime: Math.random() * 10000 + 5000, // Random delay 5-15 seconds
                duration: 30000, // 30 seconds
                activationChance: 0.20, // 20% chance
                lastCheckTime: Date.now()
            };
        }
        
        return enemy;
    }
    
    // Spawn enemies based on schedule
    spawnEnemies(gameStartTime, totalPausedTime) {
        // Don't spawn if game hasn't started yet
        if (gameStartTime === 0) return;
        
        // Calculate current game time, excluding paused time
        const currentTime = (Date.now() - gameStartTime - totalPausedTime) / 1000;
        
        // Check if any scheduled spawns are ready
        while (this.nextSpawnIndex < this.spawnSchedule.length) {
            const spawn = this.spawnSchedule[this.nextSpawnIndex];
            
            if (!spawn.spawned && currentTime >= spawn.spawnTime) {
                this.enemies.push(this.createEnemy());
                spawn.spawned = true;
                this.totalEnemiesCreated++;
                this.nextSpawnIndex++;
            } else {
                // Since schedule is sorted, no more spawns are ready yet
                break;
            }
        }
    }
    
    // Enhanced collision check that handles both rectangular and circular collision
    checkEnhancedCollision(obj1, obj2) {
        // Check if either object is a type 4 enemy (circular collision)
        const obj1IsType4 = obj1.type === 4;
        const obj2IsType4 = obj2.type === 4;
        
        if (obj1IsType4 && !obj2IsType4) {
            return this.checkCircularCollision(obj1, obj2);
        } else if (obj2IsType4 && !obj1IsType4) {
            return this.checkCircularCollision(obj2, obj1);
        } else if (obj1IsType4 && obj2IsType4) {
            // Both are type 4, use circle-to-circle collision
            const center1X = obj1.x + obj1.width / 2;
            const center1Y = obj1.y + obj1.height / 2;
            const radius1 = obj1.width / 2;
            
            const center2X = obj2.x + obj2.width / 2;
            const center2Y = obj2.y + obj2.height / 2;
            const radius2 = obj2.width / 2;
            
            const dx = center1X - center2X;
            const dy = center1Y - center2Y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return distance < (radius1 + radius2);
        } else {
            // Neither is type 4, use regular rectangular collision
            return this.checkCollision(obj1, obj2);
        }
    }
    
    // Regular collision detection
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Circular collision detection for type 4 enemies
    checkCircularCollision(circle, rect) {
        // Get circle center and radius
        const circleX = circle.x + circle.width / 2;
        const circleY = circle.y + circle.height / 2;
        const radius = circle.width / 2; // Assuming circular shape with radius = width/2
        
        // Get rectangle center
        const rectCenterX = rect.x + rect.width / 2;
        const rectCenterY = rect.y + rect.height / 2;
        
        // Calculate distance between centers
        const dx = circleX - rectCenterX;
        const dy = circleY - rectCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if distance is less than radius (treating other object as a point for simplicity)
        // For bullets and small objects, this works well
        const otherRadius = Math.min(rect.width, rect.height) / 2;
        return distance < (radius + otherRadius);
    }
    
    // Check if enemies are colliding and handle avoidance
    handleEnemyCollision() {
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = i + 1; j < this.enemies.length; j++) {
                const enemy1 = this.enemies[i];
                const enemy2 = this.enemies[j];
                
                if (enemy1.alive && enemy2.alive && this.checkEnhancedCollision(enemy1, enemy2)) {
                    const centerX1 = enemy1.x + enemy1.width / 2;
                    const centerY1 = enemy1.y + enemy1.height / 2;
                    const centerX2 = enemy2.x + enemy2.width / 2;
                    const centerY2 = enemy2.y + enemy2.height / 2;
                    
                    const dx = centerX1 - centerX2;
                    const dy = centerY1 - centerY2;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        const separationForce = this.levelConfig.global.collisionSeparation;
                        const separationX = (dx / distance) * separationForce;
                        const separationY = (dy / distance) * separationForce;
                        
                        enemy1.x += separationX;
                        enemy1.y += separationY;
                        enemy2.x -= separationX;
                        enemy2.y -= separationY;
                        
                        enemy1.x = Math.max(0, Math.min(this.canvas.width - enemy1.width, enemy1.x));
                        enemy1.y = Math.max(0, Math.min(this.canvas.height - enemy1.height, enemy1.y));
                        enemy2.x = Math.max(0, Math.min(this.canvas.width - enemy2.width, enemy2.x));
                        enemy2.y = Math.max(0, Math.min(this.canvas.height - enemy2.height, enemy2.y));
                        
                        enemy1.direction *= -1;
                        enemy2.direction *= -1;
                    }
                }
            }
        }
    }
    
    // Update all enemies
    updateEnemies(enemyBullets) {
        const now = Date.now();
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.alive) {
                // Get the base config for this enemy type
                const baseConfig = this.enemyBaseConfig[`type${enemy.type}`];
                
                // Random direction change based on probability, modified by level's eccentricity
                const eccentricityMultiplier = this.levelConfig.global.eccentricityMultiplier || 1.0;
                if (Math.random() < baseConfig.directionChangeProbability * eccentricityMultiplier) {
                    enemy.direction *= -1;
                }
                
                // Check for reverse movement (type 4 only) - but not if in top 10% of screen
                if (enemy.y > this.canvas.height * 0.1 && Math.random() < baseConfig.reverseMovementProbability * eccentricityMultiplier) {
                    enemy.directionY *= -1;
                }
                
                // Special case: Type 6 can reverse movement anywhere on screen (enhanced retrograde)
                if (enemy.type === 6 && Math.random() < baseConfig.reverseMovementProbability * eccentricityMultiplier) {
                    enemy.directionY *= -1;
                }
                
                enemy.x += enemy.speedX * enemy.direction;
                
                if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
                    enemy.direction *= -1;
                }
                
                enemy.y += enemy.speedY * enemy.directionY;
                
                // Update rotation for type 5 enemies to match their direction of travel
                if (enemy.type === 5) {
                    const vx = enemy.speedX * enemy.direction;
                    const vy = enemy.speedY * enemy.directionY;
                    enemy.rotation = Math.atan2(vy, vx) - Math.PI/2;
                    
                    // Type 5 enemies can shoot bullets
                    if (!enemy.lastShot) enemy.lastShot = 0;
                    if (now - enemy.lastShot > 2000 + Math.random() * 3000) { // Random shooting interval between 2-5 seconds
                        enemy.lastShot = now;
                        
                        // Calculate bullet velocity based on enemy's rotation
                        const bulletSpeed = 3;
                        const bulletVx = -Math.cos(enemy.rotation) * bulletSpeed;
                        const bulletVy = Math.sin(enemy.rotation) * bulletSpeed;
                        
                        enemyBullets.push({
                            x: enemy.x + enemy.width / 2 - 2,
                            y: enemy.y + enemy.height / 2 - 3,
                            width: 4,
                            height: 6,
                            vx: bulletVx,
                            vy: bulletVy
                        });
                        
                        // Play enemy bullet sound (slightly different from player)
                        this.soundManager.playEnemyBulletSound();
                    }
                }
                
                // Handle wrapping for enemies going off screen
                if (enemy.y > this.canvas.height) {
                    enemy.y = Math.random() * -50 - 20;  // Match the spawn position
                    enemy.x = Math.random() * (this.canvas.width - enemy.width);
                    enemy.direction = Math.random() > 0.5 ? 1 : -1;
                    enemy.directionY = 1;  // Reset to moving downward
                    
                    // Update rotation for type 5 enemies after wrapping
                    if (enemy.type === 5) {
                        const vx = enemy.speedX * enemy.direction;
                        const vy = enemy.speedY * enemy.directionY;
                        enemy.rotation = Math.atan2(vy, vx) - Math.PI/2;
                    }
                } else if (enemy.y < -100) {  // If moving backward and goes too far up
                    enemy.y = this.canvas.height + 20;  // Wrap to bottom
                    enemy.x = Math.random() * (this.canvas.width - enemy.width);
                    enemy.direction = Math.random() > 0.5 ? 1 : -1;
                    enemy.directionY = 1;  // Reset to moving downward
                    
                    // Update rotation for type 5 enemies after wrapping
                    if (enemy.type === 5) {
                        const vx = enemy.speedX * enemy.direction;
                        const vy = enemy.speedY * enemy.directionY;
                        enemy.rotation = Math.atan2(vy, vx) - Math.PI/2;
                    }
                }
                
                // Update force field for type 4 enemies
                if (enemy.type === 4 && enemy.forceField) {
                    const currentTime = now;
                    
                    if (!enemy.forceField.active) {
                        // Check if it's time to potentially activate the force field
                        if (currentTime - enemy.forceField.lastCheckTime >= enemy.forceField.nextActivationTime) {
                            // Roll for activation chance
                            if (Math.random() < enemy.forceField.activationChance) {
                                enemy.forceField.active = true;
                                enemy.forceField.activationStartTime = currentTime;
                            }
                            
                            // Set next check time regardless of activation
                            enemy.forceField.lastCheckTime = currentTime;
                            enemy.forceField.nextActivationTime = Math.random() * 10000 + 5000; // 5-15 seconds
                        }
                    } else {
                        // Force field is active, check if duration is over
                        if (currentTime - enemy.forceField.activationStartTime >= enemy.forceField.duration) {
                            enemy.forceField.active = false;
                            enemy.forceField.lastCheckTime = currentTime;
                            enemy.forceField.nextActivationTime = Math.random() * 10000 + 5000; // 5-15 seconds
                        }
                    }
                }
            }
        }
        
        this.handleEnemyCollision();
    }
    
    // Get points for an enemy type
    getEnemyPoints(enemyType) {
        const basePoints = this.enemyBaseConfig[`type${enemyType}`]?.points || this.enemyBaseConfig.type1.points;
        const scoreBonus = this.levelConfig.global.scoreBonus || 0;
        return basePoints + scoreBonus;
    }
    
    // Remove dead enemies
    removeDeadEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (!this.enemies[i].alive) {
                setTimeout(() => {
                    const index = this.enemies.findIndex(e => e === this.enemies[i]);
                    if (index > -1) {
                        this.enemies.splice(index, 1);
                    }
                }, 100);
            }
        }
    }
    
    // Clear all enemies
    clearEnemies() {
        this.enemies.length = 0;
    }
    
    // Get enemies array (for external access)
    getEnemies() {
        return this.enemies;
    }
    
    // Get alive enemies count
    getAliveEnemiesCount() {
        return this.enemies.filter(e => e.alive).length;
    }
    
    // Get total enemies created
    getTotalEnemiesCreated() {
        return this.totalEnemiesCreated;
    }
    
    // Get spawn schedule info
    getSpawnScheduleInfo() {
        return {
            nextSpawnIndex: this.nextSpawnIndex,
            totalScheduled: this.spawnSchedule.length
        };
    }
} 