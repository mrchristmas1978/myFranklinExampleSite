export default function decorate(block) {
  block.textContent = '';

  const canvas = document.createElement('canvas');
  canvas.classList.add('snow-canvas');
  block.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let snowflakes = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Snowflake {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.radius = Math.random() * 3 + 1;
      this.speed = Math.random() * 1 + 0.5;
      this.wind = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.y += this.speed;
      this.x += this.wind;

      if (this.y > canvas.height) {
        this.reset();
      }

      if (this.x > canvas.width || this.x < 0) {
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    snowflakes = [];
    const snowflakeCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < snowflakeCount; i += 1) {
      const snowflake = new Snowflake();
      snowflake.y = Math.random() * canvas.height;
      snowflakes.push(snowflake);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach((snowflake) => {
      snowflake.update();
      snowflake.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && animationId) {
        cancelAnimationFrame(animationId);
      } else if (entry.isIntersecting) {
        animate();
      }
    });
  });

  observer.observe(block);
}
