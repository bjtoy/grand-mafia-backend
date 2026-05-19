import { createCanvas } from 'canvas';

export function generateGuideImage(title, content, category, styling = {}) {
  const canvas = createCanvas(1200, 1600);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = styling.backgroundColor ?? '#050308';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = styling.headerColor ?? '#241338';
  ctx.fillRect(0, 0, canvas.width, 200);

  ctx.fillStyle = styling.accentColor ?? '#FF3FD2';
  ctx.fillRect(0, 200, canvas.width, 4);

  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#F4EEFF';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, 120);

  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(content.substring(0, 800), 40, 260);

  return canvas.toBuffer('image/png');
}