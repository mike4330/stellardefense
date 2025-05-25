// Visual Effects Module
class VisualEffects {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.explosions = [];
        this.stars = [];
        this.currentLevel = 1; // Track current level for starfield color
        this.enemyImages = {
            type1: null,
            type2: null,
            type3: null,
            type5: null,
            type6: null
        };
        this.imagesLoaded = 0;
        this.totalImages = 5;
        
        this.initStarfield();
        this.loadEnemyImages();
    }
    
    // Set current level (called from main game)
    setCurrentLevel(level) {
        this.currentLevel = level;
    }
    
    // Initialize starfield
    initStarfield() {
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 0.5,
                brightness: Math.random()
            });
        }
    }
    
    // Load enemy images
    loadEnemyImages() {
        // Type 1 enemy image (red diamond-like)
        this.enemyImages.type1 = new Image();
        this.enemyImages.type1.onload = () => {
            this.imagesLoaded++;
            console.log('Type 1 enemy image loaded');
        };
        this.enemyImages.type1.onerror = () => {
            console.log('Type 1 enemy image failed to load, using fallback shapes');
            this.imagesLoaded++;
        };
        this.enemyImages.type1.src = 'enemy_type1.png';
        
        // Type 2 enemy image (blue cross-like)
        this.enemyImages.type2 = new Image();
        this.enemyImages.type2.onload = () => {
            this.imagesLoaded++;
            console.log('Type 2 enemy image loaded');
        };
        this.enemyImages.type2.onerror = () => {
            console.log('Type 2 enemy image failed to load, using fallback shapes');
            this.imagesLoaded++;
        };
        this.enemyImages.type2.src = 'enemy_type2.png';
        
        // Type 3 enemy image (new enemy type)
        this.enemyImages.type3 = new Image();
        this.enemyImages.type3.onload = () => {
            this.imagesLoaded++;
            console.log('Type 3 enemy image loaded');
        };
        this.enemyImages.type3.onerror = () => {
            console.log('Type 3 enemy image failed to load, using fallback shapes');
            this.imagesLoaded++;
        };
        this.enemyImages.type3.src = 'enemy_type3.png';
        
        // Type 5 enemy image (red cross)
        this.enemyImages.type5 = new Image();
        this.enemyImages.type5.onload = () => {
            this.imagesLoaded++;
            console.log('Type 5 enemy image loaded');
        };
        this.enemyImages.type5.onerror = () => {
            console.log('Type 5 enemy image failed to load, using fallback shapes');
            this.imagesLoaded++;
        };
        this.enemyImages.type5.src = 'enemy_type5.png';
        
        // Type 6 enemy image (new enemy type)
        this.enemyImages.type6 = new Image();
        this.enemyImages.type6.onload = () => {
            this.imagesLoaded++;
            console.log('Type 6 enemy image loaded');
        };
        this.enemyImages.type6.onerror = () => {
            console.log('Type 6 enemy image failed to load, using fallback shapes');
            this.imagesLoaded++;
        };
        this.enemyImages.type6.src = 'enemy_type6.png';
    }
    
    // Create explosion effect
    createExplosion(x, y, soundManager) {
        for (let i = 0; i < 8; i++) {
            this.explosions.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4.4,
                vy: (Math.random() - 0.5) * 4.4,
                life: 33,
                maxLife: 33
            });
        }
        
        if (soundManager) {
            soundManager.playExplosionSound();
        }
    }
    
    // Update starfield
    updateStarfield() {
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.y += star.speed;
            
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        }
    }
    
    // Update explosion particles
    updateExplosions() {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const particle = this.explosions[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.explosions.splice(i, 1);
            }
        }
    }
    
    // Draw starfield
    drawStarfield() {
        // Draw white stars
        this.stars.forEach(star => {
            const alpha = star.brightness;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fillRect(star.x, star.y, 1, 1);
        });
        
        // Add blue overlay for levels 8-14 to create "different place" effect
        if (this.currentLevel >= 8 && this.currentLevel <= 14) {
            this.ctx.fillStyle = 'rgba(31, 31, 220, 0.3)'; // #3333ee with 30% opacity
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    // Draw player ship
    drawPlayer(player, playerInvulnerable) {
        this.ctx.fillStyle = '#00ccff';
        this.ctx.beginPath();
        this.ctx.moveTo(player.x + player.width / 2, player.y);
        this.ctx.lineTo(player.x, player.y + player.height);
        this.ctx.lineTo(player.x + player.width, player.y + player.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw invulnerability effect
        if (playerInvulnerable) {
            const alpha = Math.sin(Date.now() / 100) * 0.5 + 0.5; // Pulsing effect
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(player.x - 2, player.y - 2, player.width + 4, player.height + 4);
        }
    }
    
    // Draw player lives
    drawPlayerLives(playerLives) {
        this.ctx.fillStyle = '#00ccff';
        for (let i = 0; i < playerLives; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(20 + i * 25, 20);
            this.ctx.lineTo(10 + i * 25, 30);
            this.ctx.lineTo(30 + i * 25, 30);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    // Draw enemies
    drawEnemies(enemies) {
        enemies.forEach(enemy => {
            if (enemy.alive) {
                const centerX = enemy.x + enemy.width / 2;
                const centerY = enemy.y + enemy.height / 2;
                
                // Apply rotation for type 5 enemies
                if (enemy.type === 5 && enemy.rotation !== undefined) {
                    this.ctx.save();
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(enemy.rotation);
                    this.ctx.translate(-centerX, -centerY);
                }
                
                // Try to draw with image first, fallback to shapes
                const enemyImage = this.enemyImages[`type${enemy.type}`];
                
                if (enemyImage && enemyImage.complete && enemyImage.naturalHeight !== 0) {
                    // Draw with bitmap image
                    this.ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
                } else {
                    // Fallback to original shape drawing
                    this.drawEnemyFallback(enemy);
                }
                
                // Restore context if we applied rotation
                if (enemy.type === 5 && enemy.rotation !== undefined) {
                    this.ctx.restore();
                }
                
                // Draw circular collision boundary for type 4 enemies
                if (enemy.type === 4) {
                    // Only show force field if it's active
                    if (enemy.forceField && enemy.forceField.active) {
                        // Active force field - brighter, bigger, thicker
                        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; // Bright cyan, more opaque
                        this.ctx.lineWidth = 2; // 1px thicker
                        this.ctx.setLineDash([4, 4]); // Slightly longer dashes
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, (enemy.width / 2) + 2, 0, 2 * Math.PI); // 2px bigger radius
                        this.ctx.stroke();
                        this.ctx.setLineDash([]); // Reset line dash
                        
                        // Add pulsing glow effect for active force field
                        const glowAlpha = (Math.sin(Date.now() / 200) + 1) * 0.3 + 0.2; // Pulsing between 0.2 and 0.8
                        this.ctx.strokeStyle = `rgba(0, 255, 255, ${glowAlpha})`;
                        this.ctx.lineWidth = 4;
                        this.ctx.setLineDash([]);
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, (enemy.width / 2) + 2, 0, 2 * Math.PI);
                        this.ctx.stroke();
                    } else {
                        // Inactive state - subtle collision boundary (original appearance)
                        this.ctx.strokeStyle = 'rgba(0, 170, 255, 0.3)'; // Dimmer
                        this.ctx.lineWidth = 1;
                        this.ctx.setLineDash([2, 4]); // More subtle dashed line
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, enemy.width / 2, 0, 2 * Math.PI);
                        this.ctx.stroke();
                        this.ctx.setLineDash([]); // Reset line dash
                    }
                }
            }
        });
    }
    
    // Draw enemy fallback shapes
    drawEnemyFallback(enemy) {
        if (enemy.type === 1) {
            this.ctx.fillStyle = '#ff0000';
            this.ctx.beginPath();
            
            const centerX = enemy.x + enemy.width / 2;
            const centerY = enemy.y + enemy.height / 2;
            const size = enemy.width / 2;
            
            this.ctx.moveTo(centerX, enemy.y);
            this.ctx.lineTo(centerX + size, centerY);
            this.ctx.lineTo(centerX, enemy.y + enemy.height);
            this.ctx.lineTo(centerX - size, centerY);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.fillRect(enemy.x, centerY - size/3, enemy.width, size*2/3);
        } else if (enemy.type === 2) {
            this.ctx.fillStyle = '#0066ff';
            
            const centerX = enemy.x + enemy.width / 2;
            const centerY = enemy.y + enemy.height / 2;
            const verticalArmWidth = enemy.width / 3;
            const horizontalArmWidth = enemy.width / 2.2;
            const armLength = enemy.width / 2;
            
            this.ctx.fillRect(centerX - armLength, centerY - horizontalArmWidth/2, armLength * 2, horizontalArmWidth);
            this.ctx.fillRect(centerX - verticalArmWidth/2, centerY - armLength, verticalArmWidth, armLength * 2);
        } else if (enemy.type === 3) {
            // Type 3 fallback shape (purple triangle)
            this.ctx.fillStyle = '#8844ff';
            this.ctx.beginPath();
            
            const centerX = enemy.x + enemy.width / 2;
            const centerY = enemy.y + enemy.height / 2;
            
            this.ctx.moveTo(centerX, enemy.y);
            this.ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
            this.ctx.lineTo(enemy.x, enemy.y + enemy.height);
            this.ctx.closePath();
            this.ctx.fill();
        } else if (enemy.type === 4) {
            // Type 4 procedural star shape (cyan with rotating points)
            this.ctx.fillStyle = '#00aaff';
            this.ctx.strokeStyle = '#44ccff';
            this.ctx.lineWidth = 1;
            
            const centerX = enemy.x + enemy.width / 2;
            const centerY = enemy.y + enemy.height / 2;
            const outerRadius = enemy.width / 2.5;
            const innerRadius = outerRadius * 0.4;
            const spikes = 6;
            
            // Add slight rotation based on position for visual variety
            const rotation = (enemy.x + enemy.y) * 0.02;
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(rotation);
            
            this.ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
                const angle = (i * Math.PI) / spikes;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            
            this.ctx.restore();
        } else if (enemy.type === 5) {
            // Type 5 red cross/plus shape
            this.ctx.fillStyle = '#ff0000';
            this.ctx.strokeStyle = '#ff4444';
            this.ctx.lineWidth = 1;
            
            const centerX = enemy.x + enemy.width / 2;
            const centerY = enemy.y + enemy.height / 2;
            const crossThickness = enemy.width / 4;
            const crossLength = enemy.width * 0.8;
            
            // Draw horizontal bar of the cross
            this.ctx.fillRect(
                centerX - crossLength/2, 
                centerY - crossThickness/2, 
                crossLength, 
                crossThickness
            );
            
            // Draw vertical bar of the cross
            this.ctx.fillRect(
                centerX - crossThickness/2, 
                centerY - crossLength/2, 
                crossThickness, 
                crossLength
            );
            
            // Add outline stroke
            this.ctx.strokeRect(
                centerX - crossLength/2, 
                centerY - crossThickness/2, 
                crossLength, 
                crossThickness
            );
            this.ctx.strokeRect(
                centerX - crossThickness/2, 
                centerY - crossLength/2, 
                crossThickness, 
                crossLength
            );
        } else if (enemy.type === 6) {
            // Type 6 retrograde enemy - arrow-like shape that can point either direction
            this.ctx.fillStyle = '#ff6600';
            this.ctx.strokeStyle = '#ffaa44';
            this.ctx.lineWidth = 1;
            
            const centerX = enemy.x + enemy.width / 2;
            const centerY = enemy.y + enemy.height / 2;
            const arrowSize = enemy.width * 0.4;
            
            // Draw arrow pointing in movement direction
            const pointingUp = enemy.directionY < 0;
            
            this.ctx.beginPath();
            if (pointingUp) {
                // Arrow pointing up (retrograde movement)
                this.ctx.moveTo(centerX, centerY - arrowSize);           // Top point
                this.ctx.lineTo(centerX - arrowSize, centerY);           // Left
                this.ctx.lineTo(centerX - arrowSize/2, centerY);         // Left inner
                this.ctx.lineTo(centerX - arrowSize/2, centerY + arrowSize); // Left bottom
                this.ctx.lineTo(centerX + arrowSize/2, centerY + arrowSize); // Right bottom
                this.ctx.lineTo(centerX + arrowSize/2, centerY);         // Right inner
                this.ctx.lineTo(centerX + arrowSize, centerY);           // Right
            } else {
                // Arrow pointing down (normal movement)
                this.ctx.moveTo(centerX, centerY + arrowSize);           // Bottom point
                this.ctx.lineTo(centerX - arrowSize, centerY);           // Left
                this.ctx.lineTo(centerX - arrowSize/2, centerY);         // Left inner
                this.ctx.lineTo(centerX - arrowSize/2, centerY - arrowSize); // Left top
                this.ctx.lineTo(centerX + arrowSize/2, centerY - arrowSize); // Right top
                this.ctx.lineTo(centerX + arrowSize/2, centerY);         // Right inner
                this.ctx.lineTo(centerX + arrowSize, centerY);           // Right
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    // Draw bullets
    drawBullets(bullets) {
        this.ctx.fillStyle = '#ffff00';
        bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
    
    // Draw enemy bullets
    drawEnemyBullets(enemyBullets) {
        // Save the current context state
        this.ctx.save();
        
        // Set up glow effect
        this.ctx.shadowColor = '#ff9999';
        this.ctx.shadowBlur = 9;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        this.ctx.fillStyle = '#ff0000';
        enemyBullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // Restore the context state to remove glow for other elements
        this.ctx.restore();
    }
    
    // Draw explosions
    drawExplosions() {
        this.explosions.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = `rgba(255, ${Math.floor(255 * alpha)}, 0, ${alpha})`;
            this.ctx.fillRect(particle.x - 1, particle.y - 1, 3, 3);
        });
    }
    
    // Show/hide overlay screens using HTML elements
    showOverlay(type, data = {}) {
        // Hide all overlays first
        this.hideAllOverlays();
        
        switch (type) {
            case 'paused':
                document.getElementById('pauseOverlay').classList.add('active');
                break;
                
            case 'gameOver':
                document.getElementById('finalScore').textContent = data.score.toString().padStart(6, '0');
                document.getElementById('gameOverOverlay').classList.add('active');
                break;
                
            case 'levelTransition':
                document.getElementById('completedLevelName').textContent = data.levelName;
                document.getElementById('transitionScore').textContent = data.score.toString().padStart(6, '0');
                document.getElementById('levelTransitionOverlay').classList.add('active');
                break;
                
            case 'victory':
                document.getElementById('victoryScore').textContent = data.score.toString().padStart(6, '0');
                document.getElementById('victoryOverlay').classList.add('active');
                break;
        }
    }
    
    // Hide all overlay screens
    hideAllOverlays() {
        const overlays = ['pauseOverlay', 'gameOverOverlay', 'levelTransitionOverlay', 'victoryOverlay'];
        overlays.forEach(id => {
            document.getElementById(id).classList.remove('active');
        });
    }
    
    // Clear screen with background
    clearScreen() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Export for use in main game file
window.VisualEffects = VisualEffects; 
