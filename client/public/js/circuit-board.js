// SmartFlow Systems Circuit Board Animation System
class CircuitBoardAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId) || this.createCanvas(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.dataPulses = [];
    this.stars = [];
    this.animationId = null;
    this.isTabVisible = true;
    
    this.colors = {
      gold: '#d4af37',
      goldBright: '#ffdd00',
      goldDim: 'rgba(212, 175, 55, 0.3)',
      connection: 'rgba(212, 175, 55, 0.2)',
      star: 'rgba(255, 255, 255, 0.6)'
    };
    
    this.init();
    this.setupEventListeners();
  }
  
  createCanvas(canvasId) {
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.className = 'circuit-canvas';
    document.body.appendChild(canvas);
    return canvas;
  }
  
  init() {
    this.resizeCanvas();
    this.generateCircuitBoard();
    this.generateStars();
    this.animate();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  generateCircuitBoard() {
    this.nodes = [];
    this.connections = [];
    
    const nodeCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    
    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        glow: Math.random() * 0.5 + 0.5,
        connected: false
      });
    }
    
    // Generate connections between nearby nodes
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const distance = this.getDistance(this.nodes[i], this.nodes[j]);
        if (distance < 150 && Math.random() < 0.3) {
          this.connections.push({
            nodeA: i,
            nodeB: j,
            opacity: 0.3 + Math.random() * 0.4,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.02
          });
          this.nodes[i].connected = true;
          this.nodes[j].connected = true;
        }
      }
    }
  }
  
  generateStars() {
    this.stars = [];
    for (let i = 0; i < 120; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.005 + Math.random() * 0.01,
        driftX: (Math.random() - 0.5) * 0.2,
        driftY: (Math.random() - 0.5) * 0.2
      });
    }
  }
  
  getDistance(nodeA, nodeB) {
    return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
  }
  
  spawnDataPulse() {
    if (this.connections.length === 0) return;
    
    const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
    const nodeA = this.nodes[connection.nodeA];
    const nodeB = this.nodes[connection.nodeB];
    
    this.dataPulses.push({
      startX: nodeA.x,
      startY: nodeA.y,
      endX: nodeB.x,
      endY: nodeB.y,
      progress: 0,
      speed: 0.01 + Math.random() * 0.02,
      size: 2 + Math.random() * 3,
      life: 1.0
    });
  }
  
  drawStars() {
    this.ctx.save();
    this.stars.forEach(star => {
      star.x += star.driftX;
      star.y += star.driftY;
      star.twinkle += star.twinkleSpeed;
      
      // Wrap around screen
      if (star.x < 0) star.x = this.canvas.width;
      if (star.x > this.canvas.width) star.x = 0;
      if (star.y < 0) star.y = this.canvas.height;
      if (star.y > this.canvas.height) star.y = 0;
      
      const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
      this.ctx.shadowColor = this.colors.star;
      this.ctx.shadowBlur = star.size * 2;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.restore();
  }
  
  drawConnections() {
    this.ctx.save();
    this.connections.forEach(connection => {
      const nodeA = this.nodes[connection.nodeA];
      const nodeB = this.nodes[connection.nodeB];
      
      connection.pulse += connection.pulseSpeed;
      const pulseIntensity = 0.5 + 0.5 * Math.sin(connection.pulse);
      
      const gradient = this.ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
      gradient.addColorStop(0, `rgba(212, 175, 55, ${connection.opacity * pulseIntensity})`);
      gradient.addColorStop(0.5, `rgba(255, 221, 0, ${connection.opacity * pulseIntensity * 0.8})`);
      gradient.addColorStop(1, `rgba(212, 175, 55, ${connection.opacity * pulseIntensity})`);
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 1;
      this.ctx.shadowColor = this.colors.gold;
      this.ctx.shadowBlur = 3;
      
      this.ctx.beginPath();
      this.ctx.moveTo(nodeA.x, nodeA.y);
      this.ctx.lineTo(nodeB.x, nodeB.y);
      this.ctx.stroke();
    });
    this.ctx.restore();
  }
  
  drawNodes() {
    this.ctx.save();
    this.nodes.forEach(node => {
      node.pulse += node.pulseSpeed;
      const pulseIntensity = 0.7 + 0.3 * Math.sin(node.pulse);
      
      // Outer glow
      const glowGradient = this.ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 4
      );
      glowGradient.addColorStop(0, `rgba(212, 175, 55, ${node.glow * pulseIntensity * 0.8})`);
      glowGradient.addColorStop(0.7, `rgba(255, 221, 0, ${node.glow * pulseIntensity * 0.3})`);
      glowGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Core node
      const coreGradient = this.ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius
      );
      coreGradient.addColorStop(0, node.connected ? this.colors.goldBright : this.colors.gold);
      coreGradient.addColorStop(1, node.connected ? this.colors.gold : this.colors.goldDim);
      
      this.ctx.fillStyle = coreGradient;
      this.ctx.shadowColor = node.connected ? this.colors.goldBright : this.colors.gold;
      this.ctx.shadowBlur = node.radius * 2;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius * pulseIntensity, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.restore();
  }
  
  drawDataPulses() {
    this.ctx.save();
    this.dataPulses = this.dataPulses.filter(pulse => {
      pulse.progress += pulse.speed;
      pulse.life -= 0.01;
      
      if (pulse.progress >= 1 || pulse.life <= 0) return false;
      
      const x = pulse.startX + (pulse.endX - pulse.startX) * pulse.progress;
      const y = pulse.startY + (pulse.endY - pulse.startY) * pulse.progress;
      
      // Trail effect
      const trailLength = 0.3;
      for (let i = 0; i < 5; i++) {
        const trailProgress = Math.max(0, pulse.progress - (i * trailLength / 5));
        const trailX = pulse.startX + (pulse.endX - pulse.startX) * trailProgress;
        const trailY = pulse.startY + (pulse.endY - pulse.startY) * trailProgress;
        const trailAlpha = pulse.life * (1 - i / 5);
        
        this.ctx.fillStyle = `rgba(255, 221, 0, ${trailAlpha})`;
        this.ctx.shadowColor = this.colors.goldBright;
        this.ctx.shadowBlur = pulse.size * 2;
        this.ctx.beginPath();
        this.ctx.arc(trailX, trailY, pulse.size * (1 - i / 5), 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      return true;
    });
    this.ctx.restore();
  }
  
  animate() {
    if (!this.isTabVisible) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawStars();
    this.drawConnections();
    this.drawNodes();
    this.drawDataPulses();
    
    // Spawn data pulses occasionally
    if (Math.random() < 0.02) {
      this.spawnDataPulse();
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.generateCircuitBoard();
      this.generateStars();
    });
    
    // Handle tab visibility
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
    window.circuitBoard = new CircuitBoardAnimation('circuit-canvas');
  });
} else {
  window.circuitBoard = new CircuitBoardAnimation('circuit-canvas');
}