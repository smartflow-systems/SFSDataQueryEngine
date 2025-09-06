// SmartFlow Systems Interactive Sparkles System
class SparklesSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId) || this.createCanvas(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.sparkles = [];
    this.mouseSparkles = [];
    this.mouse = { x: 0, y: 0, moving: false };
    this.animationId = null;
    this.isTabVisible = true;
    this.isMobile = window.innerWidth < 768;
    
    this.colors = {
      gold: '#d4af37',
      goldBright: '#ffdd00',
      white: '#ffffff',
      goldFade: 'rgba(212, 175, 55, 0.8)',
      brightFade: 'rgba(255, 221, 0, 0.6)'
    };
    
    this.init();
    this.setupEventListeners();
  }
  
  createCanvas(canvasId) {
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.className = 'sparkles-canvas';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    return canvas;
  }
  
  init() {
    this.resizeCanvas();
    this.generateAmbientSparkles();
    if (!this.isMobile) {
      this.animate();
    }
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.isMobile = window.innerWidth < 768;
  }
  
  generateAmbientSparkles() {
    // Create ambient sparkles throughout the page
    const sparkleCount = this.isMobile ? 15 : 30;
    
    for (let i = 0; i < sparkleCount; i++) {
      this.createSparkle({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        type: 'ambient'
      });
    }
  }
  
  createSparkle(options = {}) {
    const sparkle = {
      x: options.x || Math.random() * this.canvas.width,
      y: options.y || Math.random() * this.canvas.height,
      size: options.size || (Math.random() * 3 + 1),
      life: options.life || 1.0,
      maxLife: options.maxLife || 1.0,
      type: options.type || 'click',
      velocityX: options.velocityX || (Math.random() - 0.5) * 4,
      velocityY: options.velocityY || (Math.random() - 0.5) * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.1 + Math.random() * 0.1,
      color: this.getSparkleColor(options.type),
      glow: options.glow !== undefined ? options.glow : (Math.random() * 0.5 + 0.5),
      gravity: options.gravity || 0.02,
      friction: options.friction || 0.98
    };
    
    if (sparkle.type === 'ambient') {
      sparkle.life = Infinity;
      sparkle.velocityX *= 0.2;
      sparkle.velocityY *= 0.2;
      sparkle.gravity = 0;
    }
    
    return sparkle;
  }
  
  getSparkleColor(type) {
    switch (type) {
      case 'ambient':
        return Math.random() < 0.7 ? this.colors.gold : this.colors.goldBright;
      case 'mouse':
        return Math.random() < 0.5 ? this.colors.goldBright : this.colors.white;
      case 'click':
        return Math.random() < 0.3 ? this.colors.white : this.colors.goldBright;
      default:
        return this.colors.gold;
    }
  }
  
  addMouseSparkle(x, y) {
    if (this.isMobile) return;
    
    const sparkle = this.createSparkle({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 2 + 0.5,
      life: 0.8 + Math.random() * 0.4,
      maxLife: 0.8 + Math.random() * 0.4,
      type: 'mouse',
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: (Math.random() - 0.5) * 2,
      gravity: 0.01,
      friction: 0.95
    });
    
    this.mouseSparkles.push(sparkle);
  }
  
  createClickBurst(x, y) {
    if (this.isMobile) return;
    
    const burstCount = 12 + Math.random() * 8;
    
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 / burstCount) * i + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      
      const sparkle = this.createSparkle({
        x: x,
        y: y,
        size: Math.random() * 4 + 2,
        life: 1.0 + Math.random() * 0.5,
        maxLife: 1.0 + Math.random() * 0.5,
        type: 'click',
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        glow: 0.8 + Math.random() * 0.4,
        gravity: 0.05,
        friction: 0.96
      });
      
      this.sparkles.push(sparkle);
    }
  }
  
  updateSparkles(sparkleArray) {
    return sparkleArray.filter(sparkle => {
      // Update position
      sparkle.x += sparkle.velocityX;
      sparkle.y += sparkle.velocityY;
      
      // Apply physics
      if (sparkle.type !== 'ambient') {
        sparkle.velocityY += sparkle.gravity;
        sparkle.velocityX *= sparkle.friction;
        sparkle.velocityY *= sparkle.friction;
        sparkle.life -= 0.016; // Approximately 60fps
      }
      
      // Update animation properties
      sparkle.rotation += sparkle.rotationSpeed;
      sparkle.twinkle += sparkle.twinkleSpeed;
      
      // Handle ambient sparkle movement
      if (sparkle.type === 'ambient') {
        sparkle.x += sparkle.velocityX;
        sparkle.y += sparkle.velocityY;
        
        // Wrap around screen
        if (sparkle.x < -10) sparkle.x = this.canvas.width + 10;
        if (sparkle.x > this.canvas.width + 10) sparkle.x = -10;
        if (sparkle.y < -10) sparkle.y = this.canvas.height + 10;
        if (sparkle.y > this.canvas.height + 10) sparkle.y = -10;
        
        return true;
      }
      
      // Remove dead sparkles
      return sparkle.life > 0;
    });
  }
  
  drawSparkle(sparkle) {
    this.ctx.save();
    
    const alpha = sparkle.type === 'ambient' ? 
      (0.6 + 0.4 * Math.sin(sparkle.twinkle)) : 
      (sparkle.life / sparkle.maxLife);
    
    this.ctx.globalAlpha = alpha * sparkle.glow;
    this.ctx.translate(sparkle.x, sparkle.y);
    this.ctx.rotate(sparkle.rotation);
    
    // Multi-layered glow effect
    const glowSizes = [sparkle.size * 3, sparkle.size * 2, sparkle.size];
    const glowOpacities = [0.1, 0.3, 1.0];
    
    glowSizes.forEach((size, index) => {
      this.ctx.globalAlpha = alpha * sparkle.glow * glowOpacities[index];
      
      // Create star shape
      this.ctx.fillStyle = sparkle.color;
      this.ctx.shadowColor = sparkle.color;
      this.ctx.shadowBlur = size;
      
      this.ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
        
        // Add inner points for star effect
        const innerAngle = angle + Math.PI / 4;
        const innerX = Math.cos(innerAngle) * size * 0.4;
        const innerY = Math.sin(innerAngle) * size * 0.4;
        this.ctx.lineTo(innerX, innerY);
      }
      this.ctx.closePath();
      this.ctx.fill();
    });
    
    this.ctx.restore();
  }
  
  animate() {
    if (!this.isTabVisible || this.isMobile) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw all sparkles
    this.sparkles = this.updateSparkles(this.sparkles);
    this.mouseSparkles = this.updateSparkles(this.mouseSparkles);
    
    [...this.sparkles, ...this.mouseSparkles].forEach(sparkle => {
      this.drawSparkle(sparkle);
    });
    
    // Regenerate ambient sparkles if needed
    if (this.sparkles.filter(s => s.type === 'ambient').length < 15) {
      this.generateAmbientSparkles();
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  setupEventListeners() {
    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
      if (this.isMobile) return;
      
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.moving = true;
      
      // Add mouse sparkles occasionally
      if (Math.random() < 0.1) {
        this.addMouseSparkle(this.mouse.x, this.mouse.y);
      }
      
      // Clear moving flag after delay
      clearTimeout(this.mouseTimeout);
      this.mouseTimeout = setTimeout(() => {
        this.mouse.moving = false;
      }, 100);
    });
    
    // Click burst effect
    document.addEventListener('click', (e) => {
      if (this.isMobile) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      this.createClickBurst(clickX, clickY);
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.sparkles = this.sparkles.filter(s => s.type === 'ambient');
      this.generateAmbientSparkles();
    });
    
    // Tab visibility
    document.addEventListener('visibilitychange', () => {
      this.isTabVisible = !document.hidden;
      document.body.classList.toggle('tab-hidden', document.hidden);
    });
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.sparklesSystem = new SparklesSystem('sparkles-canvas');
  });
} else {
  window.sparklesSystem = new SparklesSystem('sparkles-canvas');
}