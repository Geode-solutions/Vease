<template>
  <div class="auth-background">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  </div>
</template>

<style scoped>
.auth-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: white;
  top: -150px;
  right: -100px;
  animation: float 25s infinite alternate;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #a7f3d0;
  bottom: -100px;
  left: -50px;
  animation: float 20s infinite alternate-reverse;
}

@keyframes float {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(60px, 60px) scale(1.1);
  }
}
</style>
